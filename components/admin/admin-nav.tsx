"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Home" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/recruiters", label: "Recruiters" },
  { href: "/admin/study", label: "Study" },
];

export function AdminNav() {
  const path = usePathname();
  // Move the underline the moment a tab is tapped, before the next page has loaded.
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => setPending(null), [path]);
  return (
    <nav aria-label="Admin" className="-mb-px flex gap-5 overflow-x-auto sm:gap-6 [scrollbar-width:none]">
      {links.map((l) => {
        const here = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        const active = pending ? pending === l.href : here;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={here ? "page" : undefined}
            onClick={() => !here && setPending(l.href)}
            className={cn(
              "shrink-0 border-b-2 py-3 text-[15px] transition-colors",
              active ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
