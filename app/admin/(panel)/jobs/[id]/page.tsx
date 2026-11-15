import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ChanceMeter } from "@/components/admin/chance-meter";
import { CopyButton } from "@/components/admin/copy-button";
import { MatchMeter } from "@/components/admin/match-meter";
import { SourceBadge } from "@/components/admin/source-badge";
import { Chip, Section } from "@/components/admin/section";
import { StatusSelect } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { getJob } from "@/lib/admin/data";
import { shortDate } from "@/lib/admin/format";

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await getJob(Number(params.id));
  if (!job) notFound();

  const missing = new Set(job.missing_skills.map((s) => s.toLowerCase()));
  const facts = [
    job.location,
    `Added ${shortDate(job.found_on)}`,
    job.closes_on && `Closes ${shortDate(job.closes_on)}`,
    job.applied_on && `Applied ${shortDate(job.applied_on)}`,
  ].filter(Boolean);

  return (
    <article className="max-w-3xl">
      <Link href="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Jobs
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{job.role}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-3 text-lg">
        {job.company}
        <SourceBadge source={job.source} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{facts.join(" · ")}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <a href={job.apply_url ?? job.link} target="_blank" rel="noreferrer">
            {job.status === "queued" ? "Apply" : "Open ad"} <ArrowUpRight />
          </a>
        </Button>
        {job.cover_letter && <CopyButton text={job.cover_letter} label="Copy cover letter" />}
        <StatusSelect id={job.id} status={job.status} />
      </div>

      <Section title="Your chance">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-4">
          <ChanceMeter value={job.chance} />
          <MatchMeter skills={job.skills} missing={job.missing_skills} size="lg" />
        </div>
        {job.chance_reason && <p className="mt-3 max-w-[65ch] text-[15px] text-muted-foreground">{job.chance_reason}</p>}
      </Section>

      {job.skills.length > 0 && (
        <Section title="Skills in the ad">
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {job.skills.map((s) => (
              <Chip key={s} tone={missing.has(s.toLowerCase()) ? "missing" : "have"}>
                {s}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Green: on your resume. Amber: missing, counted toward the next project.</p>
        </Section>
      )}

      {job.summary && (
        <Section title="About the job">
          <p className="max-w-[65ch] border-t pt-4 leading-relaxed">{job.summary}</p>
        </Section>
      )}

      {job.cover_letter && (
        <Section title="Cover letter">
          <div className="whitespace-pre-line rounded-md border bg-secondary/50 p-5 text-[15px] leading-relaxed">{job.cover_letter}</div>
        </Section>
      )}

      {job.notes && (
        <Section title="Notes">
          <p className="whitespace-pre-line border-t pt-4 text-[15px] text-muted-foreground">{job.notes}</p>
        </Section>
      )}
    </article>
  );
}
