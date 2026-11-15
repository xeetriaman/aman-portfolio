import CountUp from "@/components/motion/CountUp";

export type Stat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number };

/** The headline numbers on a project page; each counts up once as it scrolls into view. */
export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-10 md:grid-cols-4">
      {stats.map((st) => (
        <div key={st.label}>
          <dt className="sr-only">{st.label}</dt>
          <dd className="text-4xl font-extrabold tracking-tight">
            <CountUp to={st.value} prefix={st.prefix} suffix={st.suffix} decimals={st.decimals} separator="," duration={1.4} easing="expo" />
          </dd>
          <dd className="mt-1 text-sm leading-snug text-muted-foreground">{st.label}</dd>
        </div>
      ))}
    </dl>
  );
}
