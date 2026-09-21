import { ResearchResponse } from "./research";
const key = "hopkins-runs-v1";

export function loadHistory(): ResearchResponse[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    const runs = JSON.parse(raw);
    if (!Array.isArray(runs)) throw new Error();
    return runs.filter((r) => r && typeof r.completed_at === "string" && Number.isFinite(Date.parse(r.completed_at)) && Array.isArray(r.companies) && r.companies.length && r.companies.every((c: ResearchResponse["companies"][number]) => c && typeof c.domain === "string" && typeof c.name === "string" && Array.isArray(c.aliases) && c.aliases.every((a) => typeof a === "string")) && Array.isArray(r.answers) && r.answers.length && r.answers.every((a: ResearchResponse["answers"][number]) => a && typeof a.question === "string" && typeof a.answer === "string" && Array.isArray(a.sources) && a.sources.every((s) => typeof s === "string") && Array.isArray(a.mentions) && a.mentions.every((m) => m && typeof m.domain === "string" && typeof m.matched_text === "string"))).slice(0, 20);
  } catch { throw new Error("Saved history could not be read. You can still run a new check."); }
}

export function saveHistory(runs: ResearchResponse[]) {
  window.localStorage.setItem(key, JSON.stringify(runs.slice(0, 20)));
}

export function comparisonKey(run: ResearchResponse) {
  return JSON.stringify({
    model: run.model,
    search: run.web_search_enabled,
    primary: run.companies[0]?.domain,
    companies: run.companies.map((c) => ({ domain: c.domain, aliases: [...c.aliases].sort() })).sort((a,b) => a.domain.localeCompare(b.domain)),
    questions: run.answers.map((a) => a.question).sort(),
  });
}
