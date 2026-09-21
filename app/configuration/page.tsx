"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loadConfiguration, saveConfiguration } from "@/lib/configuration";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const inputClassName =
  "h-11 w-full rounded-md border border-black/25 bg-white px-3 text-sm text-black outline-none transition-colors placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/10";

function SidebarNavigation() {
  return (
    <Sidebar
      aria-label="Main navigation"
      className="w-64 shrink-0 border-r-2 border-black/20 bg-[#f0efec] p-4 pb-6 text-black"
    >
      <div className="flex items-center gap-2.5 px-3 pb-8 text-[21px] font-bold tracking-[-0.03em]">
        <Image
          src="/askhopkins.png"
          alt=""
          width={34}
          height={34}
          className="h-[34px] w-[34px] rounded-lg object-contain"
          priority
        />
        <span>Hopkins</span>
      </div>

      <SidebarContent className="flex flex-col gap-7">
        <SidebarGroup>
          <SidebarGroupLabel>Your brand</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  Visibility
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  Brand AI Analytics
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Optimisations</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  AEO/SEO Agents
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  Documents
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Context</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/configuration" aria-current="page">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black bg-black" aria-hidden="true" />
                  Configuration
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black" aria-hidden="true" />
                  Knowledge Bases
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function ConfigurationPage() {
  const [businessDomain, setBusinessDomain] = useState("");
  const [competitors, setCompetitors] = useState([""]);
  const [questions, setQuestions] = useState([""]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const configuration = loadConfiguration();

      if (!configuration) {
        return;
      }

      setBusinessDomain(configuration.businessDomain);
      setCompetitors(configuration.competitorDomains.length ? configuration.competitorDomains : [""]);
      setQuestions(configuration.questions.length ? configuration.questions : [""]);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function updateItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) {
    setter((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)));
    setSaved(false);
  }

  function removeItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) {
    setter((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveConfiguration({
      businessDomain,
      competitorDomains: competitors.filter(Boolean),
      questions: questions.filter(Boolean),
    });
    setSaved(true);
  }

  return (
    <div className="flex min-h-screen text-black">
      <SidebarNavigation />

      <main className="min-w-0 flex-1 bg-[#f7f7f5]">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-12">
          <div className="mb-8 max-w-2xl">
            <h2 className="mb-2 text-xl font-semibold">Teach Hopkins about your market</h2>
            <p className="m-0 text-sm leading-6 text-black/55">
              Add the domains and questions you want to use when measuring your brand&apos;s visibility.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <section className="rounded-lg border border-black/15 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/4%)]">
              <div className="mb-6 border-b border-black/10 pb-5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-black/45">01</p>
                <h3 className="text-base font-semibold">Your business</h3>
                <p className="mt-1 text-sm leading-5 text-black/50">The primary domain Hopkins should track.</p>
              </div>

              <label htmlFor="business-domain" className="mb-2 block text-sm font-medium">Business domain</label>
              <input
                id="business-domain"
                name="business-domain"
                type="text"
                required
                placeholder="yourcompany.com"
                value={businessDomain}
                className={inputClassName}
                onChange={(event) => {
                  setBusinessDomain(event.target.value);
                  setSaved(false);
                }}
              />
              <p className="mt-2 text-xs text-black/45">Enter the domain without https:// or a trailing path.</p>
            </section>

            <section className="rounded-lg border border-black/15 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/4%)]">
              <div className="mb-6 border-b border-black/10 pb-5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-black/45">02</p>
                <h3 className="text-base font-semibold">Similar companies</h3>
                <p className="mt-1 text-sm leading-5 text-black/50">Compare your visibility against these domains.</p>
              </div>

              <div className="space-y-3">
                {competitors.map((competitor, index) => (
                  <div key={`competitor-${index}`} className="flex items-center gap-2">
                    <label htmlFor={`competitor-${index}`} className="sr-only">Similar company domain {index + 1}</label>
                    <input
                      id={`competitor-${index}`}
                      type="text"
                      value={competitor}
                      placeholder="competitor.com"
                      className={inputClassName}
                      onChange={(event) => updateItem(setCompetitors, index, event.target.value)}
                    />
                    {competitors.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" aria-label={`Remove competitor ${index + 1}`} onClick={() => removeItem(setCompetitors, index)}>
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-black/20 bg-white text-black hover:bg-black/5"
                onClick={() => {
                  setCompetitors((items) => [...items, ""]);
                  setSaved(false);
                }}
              >
                <Plus />
                Add domain
              </Button>
            </section>

            <section className="rounded-lg border border-black/15 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/4%)] lg:col-span-2">
              <div className="mb-6 border-b border-black/10 pb-5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-black/45">03</p>
                <h3 className="text-base font-semibold">Questions to monitor</h3>
                <p className="mt-1 text-sm leading-5 text-black/50">The questions you want to ask AI models about your category.</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {questions.map((question, index) => (
                  <div key={`question-${index}`} className="flex items-start gap-2">
                    <label htmlFor={`question-${index}`} className="sr-only">Question {index + 1}</label>
                    <textarea
                      id={`question-${index}`}
                      rows={3}
                      value={question}
                      placeholder="What is the best option for..."
                      className={`${inputClassName} h-auto resize-y py-3 leading-5`}
                      onChange={(event) => updateItem(setQuestions, index, event.target.value)}
                    />
                    {questions.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" aria-label={`Remove question ${index + 1}`} onClick={() => removeItem(setQuestions, index)}>
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-black/20 bg-white text-black hover:bg-black/5"
                onClick={() => {
                  setQuestions((items) => [...items, ""]);
                  setSaved(false);
                }}
              >
                <Plus />
                Add question
              </Button>
            </section>

            <div className="flex flex-wrap items-center justify-end gap-4 lg:col-span-2">
              {saved && (
                <p className="mr-auto flex items-center gap-2 text-sm text-green-700" role="status">
                  <Check className="size-4" /> Configuration saved
                </p>
              )}
              <Button type="submit" size="lg" className="bg-black px-5 text-white hover:bg-black/80">Save configuration</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}