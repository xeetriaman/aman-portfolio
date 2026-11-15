import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChanceMeter } from "@/components/admin/chance-meter";
import { MatchMeter } from "@/components/admin/match-meter";
import { SourceBadge } from "@/components/admin/source-badge";
import { StatusSelect } from "@/components/admin/status";
import type { Job } from "@/lib/admin/data";
import { daysUntil, shortDate } from "@/lib/admin/format";

const METHOD_LABEL = { email: "Email", quick: "Quick apply", company: "Company site" };

function closingNote(closes: string | null) {
  if (!closes) return null;
  const days = daysUntil(closes);
  if (days < 0) return <span className="text-muted-foreground">Closed {shortDate(closes)}</span>;
  if (days <= 3) return <span className="font-semibold text-negative">Closes {days === 0 ? "today" : `in ${days} d`}</span>;
  return <span>Closes {shortDate(closes)}</span>;
}

/** One job as a list row: title and facts on the left, chance and status on the right. */
export function JobRow({ job }: { job: Job }) {
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Link href={`/admin/jobs/${job.id}`} className="font-semibold decoration-primary/50 underline-offset-4 hover:underline">
            {job.role}
          </Link>
          <SourceBadge source={job.source} />
        </div>
        <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          <span className="text-foreground">{job.company}</span>
          {job.location && <span>{job.location}</span>}
          <span>{METHOD_LABEL[job.apply_method]}</span>
          {closingNote(job.closes_on)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex flex-col gap-1.5">
          <ChanceMeter value={job.chance} />
          <MatchMeter skills={job.skills} missing={job.missing_skills} />
        </div>
        <div className="flex items-center gap-2">
          <a
            href={job.apply_url ?? job.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the ad for ${job.role} at ${job.company}`}
            className="grid size-9 place-items-center rounded-md border hover:border-foreground/40"
          >
            <ArrowUpRight className="size-4" />
          </a>
          <StatusSelect id={job.id} status={job.status} />
        </div>
      </div>
    </li>
  );
}
