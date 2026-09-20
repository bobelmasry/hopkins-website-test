import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="app-shell">
      <Sidebar aria-label="Main navigation">
        <div className="brand-lockup">
          <Image
            src="/askhopkins.png"
            alt=""
            width={34}
            height={34}
            className="brand-mark rounded-lg"
            priority
          />
          <span>Hopkins</span>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your brand</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="#" aria-current="page">
                    <span className="nav-dot" aria-hidden="true" />
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
                    <span className="nav-dot" aria-hidden="true" />
                    Visibility
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <span className="nav-dot" aria-hidden="true" />
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
                    <span className="nav-dot" aria-hidden="true" />
                    AEO/SEO Agents
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <span className="nav-dot" aria-hidden="true" />
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
                    <span className="nav-dot" aria-hidden="true" />
                    Knowledge Bases
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="main-content">
        <div className="content-intro">
          <h1>Home</h1>
          <p className="intro-copy">Your brand visibility workspace.</p>
        </div>
      </main>
    </div>
  );
}
