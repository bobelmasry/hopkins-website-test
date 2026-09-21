"use client";

import { useState } from "react";
import { comparisonKey } from "@/lib/history";
import { ResearchResponse, summarizeResearch } from "@/lib/research";

export function VisibilityChart({ history, selected }: { history: ResearchResponse[]; selected: ResearchResponse | null }) {
  const [days, setDays] = useState(30);
  const reference = selected ?? history[0];
  const comparable = reference ? history.filter((run) => comparisonKey(run) === comparisonKey(reference)).sort((a, b) => Date.parse(a.completed_at) - Date.parse(b.completed_at)) : [];
  const end = comparable.length ? Date.parse(comparable[comparable.length - 1].completed_at) : 0;
  const runs = comparable.filter((run) => Date.parse(run.completed_at) >= end - days * 86400000);
  const start = runs.length ? Date.parse(runs[0].completed_at) : end;
  const x = (run: ResearchResponse) => end === start ? 450 : 60 + (Date.parse(run.completed_at) - start) / (end - start) * 780;
  const series = reference?.companies.map((company, index) => ({
    ...company,
    color: `hsl(${(index * 137.5 + 215) % 360} 48% 42%)`,
    points: runs.map((run) => ({ run, value: summarizeResearch(run).find((item) => item.domain === company.domain)!.visibility })),
  })) ?? [];

  return <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5" aria-label="Visibility over time">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Visibility over time</h2><p className="mt-1 text-sm text-gray-500">Completed checks with the same questions and tracking settings.</p></div>
      <div className="flex gap-1" aria-label="Chart period">{[7, 14, 30].map((value) => <button key={value} aria-pressed={days === value} onClick={() => setDays(value)} className={`rounded-md px-3 py-2 text-sm ${days === value ? "bg-black text-white" : "bg-gray-100"}`}>{value}d</button>)}</div>
    </div>
    {!runs.length ? <p className="py-12 text-center text-sm text-gray-500">Complete a check to start your visibility graph.</p> : <>
      <div className="mt-6 overflow-x-auto"><svg viewBox="0 0 900 310" className="w-full min-w-[480px]" role="img" aria-label={`Visibility percentages across ${runs.length} completed checks. Individual values are listed below.`}>
        {[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1="60" x2="840" y1={250 - value * 2.1} y2={250 - value * 2.1} stroke="#e5e7eb" strokeDasharray="4 4" /><text x="48" y={254 - value * 2.1} textAnchor="end" fontSize="12" fill="#6b7280">{value}%</text></g>)}
        {series.map((company) => <g key={company.domain}><polyline points={company.points.map(({ run, value }) => `${x(run)},${250 - value * 2.1}`).join(" ")} fill="none" stroke={company.color} strokeWidth="2.5" />{company.points.map(({ run, value }) => <circle key={run.completed_at} cx={x(run)} cy={250 - value * 2.1} r="5" fill={company.color} stroke="white" strokeWidth="1.5"><title>{company.name}: {value.toFixed(1)}% · {new Date(run.completed_at).toLocaleString()}</title></circle>)}</g>)}
        <text x="60" y="283" fontSize="12" fill="#6b7280">{new Date(start).toLocaleString()}</text>{end !== start && <text x="840" y="283" textAnchor="end" fontSize="12" fill="#6b7280">{new Date(end).toLocaleString()}</text>}
      </svg></div>
      <div className="flex flex-wrap gap-4 text-xs">{series.map((company) => <span key={company.domain} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ backgroundColor: company.color }} />{company.name}</span>)}</div>
      <p className="mt-3 text-xs text-gray-500">{runs.length === 1 ? "One completed check. Run another check with the same settings to see a trend. " : `${runs.length} completed checks. `}Period ends at the latest comparable check. Lines connect observations; they do not represent measurements between checks.</p>
      <details className="mt-4 text-sm"><summary className="cursor-pointer text-gray-600">View chart data</summary><div className="mt-3 overflow-x-auto"><table className="w-full text-left"><thead><tr><th className="p-2">Completed</th>{series.map((company) => <th className="p-2" key={company.domain}>{company.name}</th>)}</tr></thead><tbody>{runs.map((run, index) => <tr key={run.completed_at}><td className="p-2">{new Date(run.completed_at).toLocaleString()}</td>{series.map((company) => <td className="p-2" key={company.domain}>{company.points[index].value.toFixed(1)}%</td>)}</tr>)}</tbody></table></div></details>
    </>}
  </section>;
}
