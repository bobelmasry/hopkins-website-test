"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  ButtonGroup,
} from "@/components/ui/button-group";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [timeRange, setTimeRange] = useState("7d");
  const chartData = {
    "7d": [
      { label: "Mon", values: [14, 6, 2] },
      { label: "Tue", values: [16, 8, 4] },
      { label: "Wed", values: [15, 7, 3] },
      { label: "Thu", values: [18, 10, 6] },
      { label: "Fri", values: [19, 12, 8] },
      { label: "Sat", values: [21, 14, 10] },
      { label: "Sun", values: [23, 16, 12] },
    ],
    "14d": [
      { label: "May 1", values: [12, 5, 2] },
      { label: "May 3", values: [14, 7, 4] },
      { label: "May 5", values: [13, 6, 3] },
      { label: "May 7", values: [16, 9, 6] },
      { label: "May 9", values: [18, 11, 8] },
      { label: "May 11", values: [20, 13, 10] },
      { label: "May 13", values: [23, 16, 12] },
    ],
    "30d": [
      { label: "Apr 15", values: [10, 4, 1] },
      { label: "Apr 20", values: [12, 6, 3] },
      { label: "Apr 25", values: [13, 7, 4] },
      { label: "Apr 30", values: [15, 9, 6] },
      { label: "May 5", values: [17, 11, 8] },
      { label: "May 10", values: [20, 14, 10] },
      { label: "May 15", values: [23, 16, 12] },
    ],
  }[timeRange as "7d" | "14d" | "30d"];
  const businesses = [
    { name: "Hopkins", color: "#475569" },
    { name: "Acme", color: "#a1845c" },
    { name: "Northstar", color: "#9b6b73" },
  ];
  const brandMentions = businesses
    .map((business, businessIndex) => ({
      ...business,
      total: chartData.reduce((sum, point) => sum + point.values[businessIndex], 0),
    }))
    .sort((first, second) => second.total - first.total);
  const highestMentionTotal = brandMentions[0]?.total ?? 1;

  return (
    <div className="flex min-h-screen text-black">
      <Sidebar
        aria-label="Main navigation"
        className="w-64 shrink-0 border-r-2 border-black/20 bg-white p-4 pb-6 text-black bg-[#f0efec]"
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
                <SidebarMenuButton asChild isActive>
                  <Link href="#" aria-current="page">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-black bg-black" aria-hidden="true" />
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

      <main className="min-w-0 flex-1 bg-gray-50">
        <div className="w-full">
          <section className="mb-10 flex items-center justify-between gap-6 border-b-2 border-black/40 py-4 px-6 md:px-10 bg-white">
          <div className="flex items-start justify-start">
            <h2 className="m-0 text-[28px] font-semibold leading-tight text-black">Visibility</h2>
            <ButtonGroup className="ml-8 overflow-hidden rounded-lg border border-black bg-gray-100">
              <Button
                className={`min-w-[46px] rounded-none border-0 ${timeRange === "7d" ? "bg-black text-white hover:bg-black hover:text-white active:bg-black active:text-white" : "text-black"}`}
                variant="outline"
                size="sm"
                aria-pressed={timeRange === "7d"}
                onClick={() => setTimeRange("7d")}
              >
                7d
              </Button>
              <Button
                className={`min-w-[46px] rounded-none border-0 ${timeRange === "14d" ? "bg-black text-white hover:bg-black hover:text-white active:bg-black active:text-white" : "text-black"}`}
                variant="outline"
                size="sm"
                aria-pressed={timeRange === "14d"}
                onClick={() => setTimeRange("14d")}
              >
                14d
              </Button>
              <Button
                className={`min-w-[46px] rounded-none border-0 ${timeRange === "30d" ? "bg-black text-white hover:bg-black hover:text-white active:bg-black active:text-white" : "text-black"}`}
                variant="outline"
                size="sm"
                aria-pressed={timeRange === "30d"}
                onClick={() => setTimeRange("30d")}
              >
                30d
              </Button>
            </ButtonGroup>
            </div>
            <div>
              <Button className="bg-green-100/70 hover:bg-green-100/70 ml-4 md:ml-30 text-green-700" variant="default" size="lg">
                ● Last Run 2h ago
              </Button>
              <Button variant="default" size="lg" className="ml-2 bg-black hover:bg-black">
                Run Check
              </Button>
            </div>
          </section>

          <div className="flex flex-nowrap justify-between gap-4 overflow-x-auto py-1 px-10">
            <Card className="w-80 shrink-0">
            <CardHeader>
              <CardTitle className="text-md capitalize text-gray-800">Visibility</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <p className="text-4xl font-bold text-black">13.5%</p>
                <Badge className="text-md bg-green-100 text-green-700 hover:bg-green-100">+2.5%</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">3 of every 20 answers</p>
            </CardContent>
          </Card>
          <Card className="w-80 shrink-0">
            <CardHeader>
              <CardTitle className="text-md capitalize text-gray-800">Share of Voice</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <p className="text-4xl font-bold text-black">25.3%</p>
                <Badge className="text-md bg-green-100 text-green-700 hover:bg-green-100">+1.2%</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">of all brand mentions</p>
            </CardContent>
          </Card>
          <Card className="w-80 shrink-0">
            <CardHeader>
              <CardTitle className="text-md capitalize text-gray-800">Avg. Position</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <p className="text-4xl font-bold text-black">3.2</p>
                <Badge className="text-md bg-green-100 text-green-700 hover:bg-green-100">-0.5</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">5th on the list</p>
            </CardContent>
          </Card>
          <Card className="w-80 shrink-0">
            <CardHeader>
              <CardTitle className="text-md capitalize text-gray-800">Fact Gap</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <p className="text-4xl font-bold text-black">1.5</p>
                <Badge className="text-md bg-red-100 text-red-700 hover:bg-red-100">6 wrong</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">of 22 claims about you</p>
            </CardContent>
          </Card>
          </div>

          <div className="mx-10 mt-8 flex flex-nowrap gap-4 overflow-x-auto">
            <Card className="min-w-[480px] flex-1">
              <CardHeader>
                <CardTitle>Visibility over time</CardTitle>
                <CardDescription>Business visibility across the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full rounded-lg bg-gray-50 p-3">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 900 280"
                  role="img"
                  aria-labelledby="visibility-chart-title visibility-chart-description"
                  preserveAspectRatio="none"
                >
                  <title id="visibility-chart-title">Business visibility over time</title>
                  <desc id="visibility-chart-description">
                    Visibility over time for Hopkins, Acme, and Northstar across the selected period.
                  </desc>
                  {[4, 8, 12, 16, 20].map((value) => {
                    const y = 230 - value * 8.5;
                    return (
                      <g key={value}>
                        <line x1="42" x2="870" y1={y} y2={y} stroke="#d1d5db" strokeDasharray="4 6" strokeWidth="1" />
                      </g>
                    );
                  })}
                  {businesses.map((business, businessIndex) => {
                    const points = chartData
                      .map((point, index) => `${index * 140 + 30},${230 - point.values[businessIndex] * 8.5}`)
                      .join(" ");

                    return (
                      <g key={business.name}>
                        <polyline points={points} fill="none" stroke={business.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        {chartData.map((point, index) => {
                          const x = index * 140 + 30;
                          const y = 230 - point.values[businessIndex] * 8.5;
                          const value = point.values[businessIndex];

                          return (
                            <circle
                              key={`${business.name}-${point.label}`}
                              cx={x}
                              cy={y}
                              r="8"
                              fill="transparent"
                              stroke="none"
                              className="cursor-pointer"
                              tabIndex={0}
                              aria-label={`${business.name}: ${value}% on ${point.label}`}
                            >
                              <title>{`${business.name}: ${value}% on ${point.label}`}</title>
                            </circle>
                          );
                        })}
                      </g>
                    );
                  })}
                  {chartData.map((point, index) => {
                    const x = index * 140 + 30;
                    return <text key={point.label} x={x} y="252" textAnchor="middle" fill="#6b7280" fontSize="12">{point.label}</text>;
                  })}
                </svg>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 px-3 text-xs text-gray-600">
                {businesses.map((business) => (
                  <div key={business.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: business.color }} aria-hidden="true" />
                    <span>{business.name}</span>
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>

            <Card className="w-96 shrink-0">
              <CardHeader>
                <CardTitle>Who AI names</CardTitle>
                <CardDescription>Most frequently mentioned alongside your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brandMentions.map((business) => (
                    <div key={business.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium text-gray-800">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: business.color }}
                            aria-hidden="true"
                          />
                          <span>{business.name}</span>
                        </div>
                        <span className="text-gray-500">{business.total}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(business.total / highestMentionTotal) * 100}%`,
                            backgroundColor: business.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
