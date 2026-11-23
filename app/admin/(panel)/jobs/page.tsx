import Link from "next/link";
import { JobRow } from "@/components/admin/job-row";
import { Empty, PageTitle } from "@/components/admin/section";
import { getJobs, type JobStatus } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const FILTERS: { key: string; label: string; statuses?: JobStatus[] }[] = [
  { key: "all", label: "All" },
  { key: "queued", label: "To apply", statuses: ["queued"] },
  { key: "applied", label: "Applied", statuses: ["applied"] },
  { key: "replies", label: "Replies", statuses: ["replied", "interview", "offer"] },
  { key: "done", label: "Closed", statuses: ["rejected", "skipped", "closed"] },
];

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = FILTERS.find((f) => f.key === status) ?? FILTERS[0];
  const jobs = await getJobs(active.statuses);

  return (
    <>
      <PageTitle title="Jobs">Every data role found, newest first. Change a status and it saves straight away.</PageTitle>

      <div role="tablist" aria-label="Filter jobs" className="mb-2 mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            role="tab"
            aria-selected={f === active}
            href={f.key === "all" ? "/admin/jobs" : `/admin/jobs?status=${f.key}`}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              f === active ? "border-foreground bg-foreground font-semibold text-background" : "hover:border-foreground/40"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {jobs.length ? (
        <ul className="divide-y border-y">{jobs.map((job) => <JobRow key={job.id} job={job} />)}</ul>
      ) : (
        <Empty>{active.key === "all" ? "No jobs yet. The first job search fills this list." : "No jobs with this status."}</Empty>
      )}
    </>
  );
}
