import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../components/ui/button.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const mod = { exports: {} };
new Function('exports', 'require', code)(mod.exports, createRequire(import.meta.url));
const { Button } = mod.exports;

test('initial loading button renders a native disabled attribute on the server', () => {
  const html = renderToStaticMarkup(React.createElement(Button, { disabled: true }, 'Run Check'));
  assert.match(html, /<button /);
  assert.match(html, / disabled=""/);
  assert.match(html, /type="button"/);
  assert.match(html, /autoComplete="off"/i);
  assert.match(html, />Run Check<\/button>/);
});

test('ready button is enabled and form buttons retain submit behavior', () => {
  const html = renderToStaticMarkup(React.createElement(Button, { disabled: false, type: 'submit' }, 'Save'));
  assert.doesNotMatch(html, / disabled=/);
  assert.match(html, /type="submit"/);
});
