"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Brand, configuredBrands, loadConfiguration, saveConfiguration } from "@/lib/configuration";

const inputClassName = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-slate-500";
const emptyBrand = (): Brand => ({ domain: "", name: "", aliases: [] });

export default function ConfigurationPage() {
  const [brands, setBrands] = useState<Brand[]>([emptyBrand()]);
  const [questions, setQuestions] = useState([""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const configuration = loadConfiguration();
        if (configuration) {
          setBrands(configuredBrands(configuration));
          setQuestions(configuration.questions.length ? configuration.questions : [""]);
        }
      } catch { setError("Could not load configuration from this browser."); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateBrand(index: number, changes: Partial<Brand>) {
    setMessage("");
    setBrands((items) => items.map((brand, i) => i === index ? { ...brand, ...changes } : brand));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const cleanBrands = brands.map((brand) => {
        const domain = new URL(brand.domain.includes("://") ? brand.domain.trim() : `https://${brand.domain.trim()}`).hostname.toLowerCase().replace(/^www\./, "");
        if (!domain.includes(".")) throw new Error("Enter a valid domain for each company.");
        return { domain, name: brand.name.trim(), aliases: [...new Set(brand.aliases.map((a) => a.trim()).filter(Boolean))] };
      });
      if (new Set(cleanBrands.map((b) => b.domain)).size !== cleanBrands.length) throw new Error("Each company must have a different domain.");
      const cleanQuestions = [...new Set(questions.map((q) => q.trim()).filter(Boolean))];
      if (!cleanQuestions.length) throw new Error("Add at least one question.");
      saveConfiguration({ businessDomain: cleanBrands[0].domain, competitorDomains: cleanBrands.slice(1).map((b) => b.domain), brands: cleanBrands, questions: cleanQuestions });
      setBrands(cleanBrands);
      setQuestions(cleanQuestions);
      setMessage("Configuration saved. Return to Visibility to run a check.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save configuration in this browser."); }
  }

  return <div className="flex min-h-screen text-black"><Navigation /><main className="min-w-0 flex-1 bg-gray-50 p-6 md:p-10">
    <div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Configuration</h1><p className="mt-2 text-sm text-gray-600">Choose who to track and what customers might ask.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {brands.map((brand, index) => <fieldset key={index} className="rounded-xl border border-gray-200 bg-white p-5">
          <legend className="px-2 font-semibold">{index === 0 ? "Your business" : `Competitor ${index}`}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">Domain<input required value={brand.domain} placeholder="thenorthface.com" className={inputClassName} onChange={(e) => updateBrand(index, { domain: e.target.value })} /></label>
            <label className="text-sm">Brand name<input value={brand.name} placeholder="The North Face" className={inputClassName} onChange={(e) => updateBrand(index, { name: e.target.value })} /></label>
            <label className="text-sm md:col-span-2">Alternative spellings (comma separated)<input value={brand.aliases.join(",")} placeholder="North Face, TNF" className={inputClassName} onChange={(e) => updateBrand(index, { aliases: e.target.value.split(",") })} /></label>
          </div>
          <p className="mt-3 text-xs text-gray-500">We match the domain, brand name and alternative spellings. If the name is blank, we infer it from the domain.</p>
          {index > 0 && <Button type="button" variant="ghost" className="mt-3" onClick={() => { setBrands((items) => items.filter((_, i) => i !== index)); setMessage(""); }}>Remove competitor</Button>}
        </fieldset>)}
        <Button type="button" variant="outline" disabled={brands.length >= 20} onClick={() => { setBrands((items) => [...items, emptyBrand()]); setMessage(""); }}>Add competitor</Button>
        <fieldset className="rounded-xl border border-gray-200 bg-white p-5"><legend className="px-2 font-semibold">Questions to monitor</legend><p className="mb-4 text-sm text-gray-600">Use category questions, such as “Which brands make waterproof hiking jackets?”</p>
          <div className="space-y-3">{questions.map((question, index) => <div key={index} className="flex items-end gap-2"><label className="flex-1 text-sm">Question {index + 1}<textarea rows={2} value={question} className={inputClassName} onChange={(e) => { setQuestions((items) => items.map((q, i) => i === index ? e.target.value : q)); setMessage(""); }} /></label>{questions.length > 1 && <Button type="button" variant="ghost" aria-label={`Remove question ${index + 1}`} onClick={() => { setQuestions((items) => items.filter((_, i) => i !== index)); setMessage(""); }}>Remove</Button>}</div>)}</div>
          <Button type="button" variant="outline" className="mt-4" disabled={questions.length >= 20} onClick={() => { setQuestions((items) => [...items, ""]); setMessage(""); }}>Add question</Button>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-green-700">{message}</p>}
        <Button type="submit">Save configuration</Button>
      </form>
    </div>
  </main></div>;
}
