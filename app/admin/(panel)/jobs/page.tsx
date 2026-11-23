import Link from "next/link";
import { JobRow } from "@/components/admin/job-row";
import { Empty, PageTitle } from "@/components/admin/section";
import { getJobs, type Job, type JobStatus } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const FILTERS: { key: string; label: string; statuses?: JobStatus[] }[] = [
  { key: "all", label: "All" },
  { key: "queued", label: "To apply", statuses: ["queued"] },
  { key: "applied", label: "Applied", statuses: ["applied"] },
  { key: "replies", label: "Replies", statuses: ["replied", "interview", "offer"] },
  { key: "done", label: "Closed", statuses: ["rejected", "skipped", "closed"] },
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "chance", label: "Best chance" },
  { key: "closing", label: "Closing soon" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];
type Params = { status?: string; sort?: string; board?: string };

const byKey: Record<SortKey, (a: Job, b: Job) => number> = {
  newest: () => 0, // already newest first from the database
  chance: (a, b) => (b.chance ?? 0) - (a.chance ?? 0),
  // Jobs with a closing date come first, soonest first; open-ended ads after.
  closing: (a, b) => (a.closes_on ?? "9999").localeCompare(b.closes_on ?? "9999"),
};

/** Link to this page with one parameter changed and the others kept. */
function hrefWith(params: Params, change: Params) {
  const next = new URLSearchParams(Object.entries({ ...params, ...change }).filter(([, v]) => v && v !== "all" && v !== "newest") as [string, string][]);
  const qs = next.toString();
  return qs ? `/admin/jobs?${qs}` : "/admin/jobs";
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const active = FILTERS.find((f) => f.key === params.status) ?? FILTERS[0];
  const sort = SORTS.find((s) => s.key === params.sort)?.key ?? "newest";
  const all = await getJobs(active.statuses);
  const boards = [...new Set(all.map((j) => j.source).filter(Boolean))].sort() as string[];
  const board = boards.includes(params.board ?? "") ? params.board : undefined;
  const jobs = all.filter((j) => !board || j.source === board).sort(byKey[sort]);

  return (
    <>
      <PageTitle title="Jobs">Every data role found, newest first. Change a status and it saves straight away.</PageTitle>

      <div role="tablist" aria-label="Filter jobs" className="mb-2 mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            role="tab"
            aria-selected={f === active}
            href={hrefWith(params, { status: f.key })}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              f === active ? "border-foreground bg-foreground font-semibold text-background" : "hover:border-foreground/40"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-1" aria-label="Sort jobs">
          <span className="mr-1 text-muted-foreground">Sort</span>
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={hrefWith(params, { sort: s.key })}
              aria-current={s.key === sort ? "true" : undefined}
              className={cn("rounded-md px-2.5 py-1", s.key === sort ? "bg-secondary font-semibold" : "text-muted-foreground hover:text-foreground")}
            >
              {s.label}
            </Link>
          ))}
        </div>
        {boards.length > 1 && (
          <div className="flex flex-wrap items-center gap-1" aria-label="Filter by job board">
            <span className="mr-1 text-muted-foreground">Board</span>
            {["all", ...boards].map((b) => (
              <Link
                key={b}
                href={hrefWith(params, { board: b })}
                aria-current={(board ?? "all") === b ? "true" : undefined}
                className={cn("rounded-md px-2.5 py-1", (board ?? "all") === b ? "bg-secondary font-semibold" : "text-muted-foreground hover:text-foreground")}
              >
                {b === "all" ? "All" : b}
              </Link>
            ))}
          </div>
        )}
        <span className="ml-auto tabular-nums text-muted-foreground">{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</span>
      </div>

      {jobs.length ? (
        <ul className="divide-y border-y">{jobs.map((job) => <JobRow key={job.id} job={job} />)}</ul>
      ) : (
        <Empty>{active.key === "all" ? "No jobs yet. The first job search fills this list." : "No jobs with this status."}</Empty>
      )}
    </>
  );
}
