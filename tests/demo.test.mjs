import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function load(name) {
  const source = fs.readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', code)(mod.exports, mod);
  return mod.exports;
}
const history = load('history');
const configuration = load('configuration');
const research = load('research');
let storage = new Map();
global.window = { localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
function run(time = '2026-09-21T12:00:00Z') {
  return {
    completed_at: time, model: 'demo', web_search_enabled: true,
    companies: [{ name: 'Acme', domain: 'acme.com', aliases: ['acme.com', 'acme'] }, { name: 'Other', domain: 'other.com', aliases: ['other'] }],
    answers: [{ question: 'Best shoes?', answer: 'Acme and Other.', sources: [], mentions: [{ domain: 'acme.com', matched_text: 'Acme' }, { domain: 'other.com', matched_text: 'Other' }] }, { question: 'Best boots?', answer: 'Other.', sources: [], mentions: [{ domain: 'other.com', matched_text: 'Other' }] }],
  };
}

test('saved runs survive reload and retain original evidence, capped at 20', () => {
  storage = new Map();
  const runs = Array.from({ length: 25 }, (_, i) => run(new Date(2026, 8, 21, 12, i).toISOString()));
  history.saveHistory(runs);
  assert.deepEqual(history.loadHistory(), runs.slice(0, 20));
});

test('invalid history is rejected or filtered without crashing result rendering', () => {
  storage.set('hopkins-runs-v1', 'broken json');
  assert.throws(() => history.loadHistory(), /could not be read/);
  storage.set('hopkins-runs-v1', JSON.stringify([null, {}, { ...run(), answers: [null] }, run()]));
  assert.deepEqual(history.loadHistory(), [run()]);
});

test('comparison requires matching names, questions, model and primary business', () => {
  const original = run();
  assert.equal(history.comparisonKey(original), history.comparisonKey({ ...original, completed_at: '2026-09-22T12:00:00Z', answers: [...original.answers].reverse() }));
  for (const changed of [
    { ...original, model: 'different' },
    { ...original, web_search_enabled: false },
    { ...original, companies: [...original.companies].reverse() },
    { ...original, answers: original.answers.slice(0, 1) },
    { ...original, companies: original.companies.map((c) => ({ ...c, aliases: [...c.aliases, 'new alias'] })) },
  ]) assert.notEqual(history.comparisonKey(original), history.comparisonKey(changed));
});

test('old configuration migrates and explicit names survive saving', () => {
  const old = { businessDomain: 'acme.com', competitorDomains: ['other.com'], questions: ['Best shoes?'] };
  configuration.saveConfiguration(old);
  assert.equal(configuration.configuredBrands(configuration.loadConfiguration())[0].domain, 'acme.com');
  const updated = { ...old, brands: [{ domain: 'acme.com', name: 'Acme Shoes', aliases: ['ACME'] }] };
  configuration.saveConfiguration(updated);
  assert.deepEqual(configuration.configuredBrands(configuration.loadConfiguration())[0], updated.brands[0]);
});

test('visibility uses shared answers and zero matches have no share', () => {
  const summary = research.summarizeResearch(run());
  assert.equal(summary[0].visibility, 50);
  assert.equal(summary[1].visibility, 100);
  assert.ok(Math.abs(summary[0].shareOfVoice - 100 / 3) < 1e-10);
  const zero = research.summarizeResearch({ ...run(), answers: [{ mentions: [] }] });
  assert.equal(zero[0].visibility, 0);
  assert.equal(zero[0].shareOfVoice, null);
});

test('storage write failures propagate rather than reporting a saved run', () => {
  const write = window.localStorage.setItem;
  window.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => history.saveHistory([run()]), /Quota exceeded/);
  window.localStorage.setItem = write;
});
