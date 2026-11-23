import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { SubmitButton } from "@/components/admin/submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Career admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-4">
          <a href="/admin" className="font-extrabold tracking-tight">
            Aman <span className="font-medium text-muted-foreground">/ career</span>
          </a>
          <div className="flex items-center gap-1">
            <a href="/" className="px-2 text-sm text-muted-foreground hover:text-foreground">
              Public site
            </a>
            <form action={signOut}>
              <SubmitButton className="px-2 text-sm text-muted-foreground hover:text-foreground">Sign out</SubmitButton>
            </form>
            <ThemeToggle />
          </div>
        </div>
        <div className="container">
          <AdminNav />
        </div>
      </header>
      <main className="container pb-24 pt-8 sm:pt-10">{children}</main>
    </>
  );
}
