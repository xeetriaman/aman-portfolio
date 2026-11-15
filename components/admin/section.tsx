import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {children && <p className="mt-2 max-w-[65ch] text-muted-foreground">{children}</p>}
    </div>
  );
}

export function Section({ title, more, children }: { title: string; more?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {more && (
          <Link href={more.href} className="text-sm font-medium text-brand hover:underline">
            {more.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("rounded-md border border-dashed px-4 py-6 text-[15px] text-muted-foreground", className)}>{children}</p>;
}

export function Chip({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "have" | "missing" }) {
  const styles = {
    plain: "border-border text-foreground",
    have: "border-positive/40 bg-positive/10 text-foreground",
    missing: "border-marigold/60 bg-marigold/10 text-foreground",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[13px] ${styles[tone]}`}>{children}</span>;
}
