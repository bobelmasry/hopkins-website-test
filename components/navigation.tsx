"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  return <aside className="w-44 shrink-0 border-r border-black/10 bg-[#f0efec] p-4 md:w-56">
    <div className="mb-8 flex items-center gap-2 text-xl font-bold"><Image src="/askhopkins.png" alt="" width={30} height={30} />Hopkins</div>
    <nav aria-label="Main navigation" className="space-y-2">
      {[{ href: "/", label: "Visibility" }, { href: "/configuration", label: "Configuration" }].map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`block rounded-lg px-3 py-2 text-sm ${pathname === item.href ? "bg-white font-semibold shadow-sm" : "hover:bg-white/60"}`}>{item.label}</Link>)}
      <Link href="/#history" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/60">Run history</Link>
    </nav>
    <p className="mt-8 px-3 text-xs leading-5 text-gray-500">OpenAI visibility demo</p>
  </aside>;
}
