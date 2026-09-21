"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VisibilityChart } from "@/components/visibility-chart";
import { Navigation } from "@/components/navigation";
import { comparisonKey, loadHistory, saveHistory } from "@/lib/history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { configuredBrands, loadConfiguration } from "@/lib/configuration";
import { ResearchResponse, runResearch, summarizeResearch } from "@/lib/research";

export default function Home() {
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<ResearchResponse[]>([]);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [partial, setPartial] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = loadHistory();
        setHistory(saved);
        setResult(saved[0] ?? null);
      } catch (error) { setError(error instanceof Error ? error.message : "Could not load history."); }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleRunCheck() {
    setError("");
    setIsResearching(true);
    try {
      const configuration = loadConfiguration();
      const questions = [...new Set(configuration?.questions.map((q) => q.trim()).filter(Boolean))];
      if (!configuration?.businessDomain.trim() || !questions.length) {
        throw new Error("Add your business domain and at least one question in Configuration first.");
      }
      const brands = configuredBrands(configuration);
      setProgress({ completed: 0, total: questions.length });
      setPartial(true);
      setResult(null);
      let combined: ResearchResponse | null = null;
      const answers: ResearchResponse["answers"] = [];
      for (const [index, question] of questions.entries()) {
        const response = await runResearch(brands.map((brand) => ({ name: brand.name || brand.domain, aliases: brand.aliases, domain: brand.domain, use_web_search: true, questions: [question] })));
        answers.push(...response.answers);
        combined = { ...response, answers: [...answers] };
        setResult(combined);
        setProgress({ completed: index + 1, total: questions.length });
      }
      if (combined) {
        setPartial(false);
        const updated = [combined, ...history].slice(0, 20);
        setHistory(updated);
        try { saveHistory(updated); }
        catch { setError("Check completed, but this browser could not save it. These results are available until you leave this page."); }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Research failed. Please try again.");
    } finally {
      setIsResearching(false);
    }
  }

  const companies = result ? summarizeResearch(result) : [];
  const primary = companies[0];
  const totalMentions = companies.reduce((total, company) => total + company.mentions, 0);
  const metrics = [
    { title: "Visibility", value: primary ? `${primary.visibility.toFixed(1)}%` : "—", detail: primary ? `${primary.mentions} of ${result!.answers.length} answers mention ${primary.domain}` : "Run a check to measure mentions" },
    { title: "Share of tracked mentions", value: primary?.shareOfVoice != null ? `${primary.shareOfVoice.toFixed(1)}%` : "—", detail: primary ? `${primary.mentions} of ${totalMentions} company–answer matches across tracked companies` : "Each company counts once per answer" },
    { title: "Answers checked", value: result ? String(result.answers.length) : "—", detail: "One OpenAI answer per question in this run" },
  ];

  return (
    <div className="flex min-h-screen text-black">
      <Navigation />
      <main className="min-w-0 flex-1 bg-gray-50 p-6 md:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-semibold">Visibility</h1>
            <p className="mt-2 text-sm text-gray-600">{partial ? "Current check · partial results" : result ? `Completed: ${new Date(result.completed_at).toLocaleString()}` : "No saved check selected"}</p>
          </div>
          <Button onClick={handleRunCheck} disabled={isResearching || !ready}>{isResearching ? "Checking questions…" : "Run Check"}</Button>
        </header>
        <details className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600"><summary className="cursor-pointer font-medium text-gray-800">How this works</summary><p className="mt-3 leading-6">Each category question is sent to OpenAI once, without adding your tracked companies. We look for your domain, brand name and alternative spellings in the answer. Each company counts at most once per answer. A mention does not necessarily mean a recommendation. Visibility is the percentage of answers mentioning your business; share is your portion of all tracked company–answer matches. Results can vary between runs.</p><p className="mt-2 leading-6">The last 20 completed checks are saved in this browser. History comparisons require the same questions, companies, matching names, model and search setting.</p></details>
        {error && <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        {isResearching && <div role="status" className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900"><p>{progress.total ? `Checking question ${Math.min(progress.completed + 1, progress.total)} of ${progress.total} · ${progress.completed} complete` : "Preparing your check…"}</p><progress aria-label="Questions completed" className="mt-2 w-full" value={progress.completed} max={progress.total || 1} /><p className="mt-1">Answers appear below as they finish. Keep this page open until the check completes.</p></div>}
        {partial && !isResearching && result && <p className="mb-4 text-sm text-amber-700">Partial check: {progress.completed} of {progress.total} questions completed. These results are not included in saved history. Run Check to start again.</p>}
        <div className="grid gap-4 lg:grid-cols-3">
          {metrics.map((metric) => <Card key={metric.title}><CardHeader><CardTitle>{metric.title}</CardTitle></CardHeader><CardContent><p className="mb-2 text-3xl font-semibold">{metric.value}</p><p className="text-sm text-gray-600">{metric.detail}</p></CardContent></Card>)}
        </div>
        <VisibilityChart history={history} selected={partial ? null : result} />
        {!result ? <Card className="mt-6"><CardHeader><CardTitle>Start with your market</CardTitle><CardDescription>Save your business, competitors and questions, then run a check to see the actual answers and sources.</CardDescription></CardHeader><CardContent><Link className="underline" href="/configuration">Open Configuration →</Link></CardContent></Card> : <>
          <Card className="mt-6"><CardHeader><CardTitle>Who AI mentions</CardTitle><CardDescription>All tracked companies, measured against the same {result.answers.length} answers. Source URLs alone do not count as mentions.</CardDescription></CardHeader>
            <CardContent className="space-y-5">{companies.map((company) => <div key={company.domain}>
              <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm"><span className="font-medium">{company.name}{company.domain === primary?.domain ? " · Your business" : ""}</span><span>{company.mentions}/{result.answers.length} answers · {company.visibility.toFixed(1)}%</span></div>
              <div className="h-2 overflow-hidden rounded bg-gray-100"><div className="h-full bg-slate-600" style={{ width: `${company.visibility}%` }} /></div>
              <p className="mt-2 text-xs text-gray-500">Matched names: {company.aliases.join(", ")}</p>
            </div>)}<p className="text-xs text-gray-500">Matches use your configured names, or a name inferred from the domain when left blank. Review alternative spellings in Configuration if a mention is missed. Common words may produce false matches.</p></CardContent>
          </Card>
          <section className="mt-8 space-y-4" aria-label="Answer evidence"><h2 className="text-xl font-semibold">Answers and sources</h2>
            {result.answers.map((answer, index) => <details key={`${result.completed_at}-${index}`} className="group rounded-xl border border-gray-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{index + 1}. {answer.question}</span>
                  <span className="mt-1 block text-xs text-gray-500">{answer.mentions.length} tracked {answer.mentions.length === 1 ? "company" : "companies"} mentioned · {answer.sources.length} {answer.sources.length === 1 ? "source" : "sources"} · {answer.web_search_used ? "Web search used" : "No web search used"}</span>
                </span>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <div className="border-t border-gray-100 p-4 md:p-6">
              <p className="mb-4 whitespace-pre-wrap break-words text-sm leading-7">{answer.answer}</p>
              <div className="mb-4 flex flex-wrap gap-2">{companies.map((company) => {
                const mention = answer.mentions.find((item) => item.domain === company.domain);
                return <span key={company.domain} className={`rounded-md px-3 py-2 text-xs ${mention ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-600"}`}>{company.domain}: {mention ? `matched “${mention.matched_text}”` : "no match"}</span>;
              })}</div>
              <h3 className="mb-2 text-sm font-semibold">Cited sources</h3>
              {answer.sources.length ? <ul className="space-y-2">{answer.sources.filter((url) => /^https?:\/\//i.test(url)).map((url) => <li key={url}><a className="break-all text-sm text-blue-700 underline" href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul> : <p className="text-sm text-gray-500">No citation links returned for this answer.</p>}
            </div></details>)}
          </section>
        </>}
        <section id="history" className="mt-8 scroll-mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Run history</h2><p className="mt-2 text-sm text-gray-500">Last 20 completed checks in this browser. Select a run to review its answers.</p>
          {!history.length ? <p className="mt-4 text-sm text-gray-600">Your first completed check will appear here.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Completed</th><th className="p-3">Business</th><th className="p-3">Visibility</th><th className="p-3">Change</th><th className="p-3">Answers</th></tr></thead><tbody>{history.map((run, index) => {
            const summary = summarizeResearch(run)[0];
            const previous = history.slice(index + 1).find((older) => comparisonKey(older) === comparisonKey(run));
            const difference = previous ? summary.visibility - summarizeResearch(previous)[0].visibility : null;
            return <tr key={run.completed_at} className={`border-b last:border-0 ${!partial && result?.completed_at === run.completed_at ? "bg-slate-50" : ""}`}><td className="p-3"><button disabled={isResearching} className="text-left text-blue-700 underline disabled:opacity-50" onClick={() => { setResult(run); setPartial(false); }}>{new Date(run.completed_at).toLocaleString()}</button></td><td className="p-3">{summary.name}</td><td className="p-3">{summary.visibility.toFixed(1)}%</td><td className="p-3">{difference === null ? "No comparable earlier run" : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} pp`}</td><td className="p-3">{run.answers.length}</td></tr>;
          })}</tbody></table><p className="mt-3 text-xs text-gray-500">Change is in percentage points versus the previous comparable run.</p></div>}
        </section>
      </main>
    </div>
  );
}
