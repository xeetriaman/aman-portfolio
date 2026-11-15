import type { Job } from "@/lib/admin/data";
import { shortDate } from "@/lib/admin/format";

const WEEKS = 8;
const RESPONDED = new Set(["replied", "interview", "offer", "rejected"]);

/** Monday (yyyy-mm-dd) of the week a date falls in. */
function weekStart(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

/** Applications sent per week for the last eight weeks, plus the response rate so far. */
export function WeeklyProgress({ jobs }: { jobs: Job[] }) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const thisWeek = new Date(`${weekStart(today)}T00:00:00Z`);
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(thisWeek);
    d.setUTCDate(d.getUTCDate() - 7 * (WEEKS - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  const applied = jobs.filter((j) => j.applied_on);
  const perWeek = weeks.map((w) => applied.filter((j) => weekStart(j.applied_on!) === w).length);
  const peak = Math.max(...perWeek, 5);
  const responded = applied.filter((j) => RESPONDED.has(j.status)).length;
  const rate = applied.length ? Math.round((responded / applied.length) * 100) : null;

  return (
    <div className="grid gap-8 border-t pt-5 sm:grid-cols-[1fr_12rem]">
      <figure>
        <div className="flex h-28 items-end gap-2" role="img" aria-label={`Applications per week: ${perWeek.join(", ")}`}>
          {perWeek.map((n, i) => (
            <div key={weeks[i]} className="flex flex-1 flex-col items-center justify-end gap-1.5 self-stretch">
              {n > 0 && <span className="text-xs font-semibold tabular-nums">{n}</span>}
              <span
                className={`w-full rounded-t-sm ${i === WEEKS - 1 ? "bg-primary" : "bg-primary/35"}`}
                style={{ height: n ? `${(n / peak) * 100}%` : "2px" }}
              />
            </div>
          ))}
        </div>
        <figcaption className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Week of {shortDate(weeks[0])}</span>
          <span>This week</span>
        </figcaption>
      </figure>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-1">
        <div>
          <dt className="text-sm text-muted-foreground">Applied, all time</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums">{applied.length}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Heard back</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums">
            {rate === null ? "–" : `${rate}%`}
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              {responded}/{applied.length}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
