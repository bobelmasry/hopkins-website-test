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
        </div>
      </main>
    </div>
  );
}
