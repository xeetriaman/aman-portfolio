import CountUp from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";

export type Stat = { label: string; value: number; suffix?: string; hint: string; alert?: boolean };

// Top-of-page numbers for the admin home. Values come from the page; this only lays them out.
export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className={cn("rounded-xl border bg-background p-4 shadow-[0_6px_20px_-14px_hsl(var(--foreground)/0.3)]", s.alert && "border-negative/40")}
        >
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className={cn("mt-1 text-3xl font-extrabold tabular-nums tracking-tight", s.alert && "text-negative")}>
            <CountUp to={s.value} suffix={s.suffix} duration={0.8} trigger="load" />
          </dd>
          <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
        </div>
      ))}
    </dl>
  );
}
