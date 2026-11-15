import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { Chip, Empty, PageTitle } from "@/components/admin/section";
import { getProjects, type Project } from "@/lib/admin/data";
import { shortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const STAGES: { key: Project["status"]; label: string }[] = [
  { key: "planned", label: "Planned" },
  { key: "analysis", label: "Analysis" },
  { key: "published", label: "Published" },
];

function Stages({ status }: { status: Project["status"] }) {
  const reached = STAGES.findIndex((s) => s.key === status);
  return (
    <ol className="flex gap-1.5" aria-label={`Stage: ${STAGES[reached].label}`}>
      {STAGES.map((s, i) => (
        <li key={s.key} className="flex-1">
          <span className={cn("block h-1 rounded-full", i <= reached ? "bg-primary" : "bg-secondary")} />
          <span className={cn("mt-1.5 block text-xs", i === reached ? "font-semibold" : "text-muted-foreground")}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageTitle title="Projects">One portfolio project a week, ready on Sunday. Planned on Monday, published by Friday.</PageTitle>
      {projects.length ? (
        <ul className="mt-8 divide-y border-y">
          {projects.map((p) => (
            <li key={p.id} className="grid gap-5 py-6 md:grid-cols-[1fr_16rem] md:gap-10">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Week of {shortDate(p.week_of)}</p>
                <h2 className="mt-1 text-xl font-bold">{p.title}</h2>
                {p.summary && <p className="mt-2 max-w-[65ch] text-[15px] text-muted-foreground">{p.summary}</p>}
                {p.skill_focus.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.skill_focus.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                )}
                {p.resume_bullets.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold">Resume bullets</h3>
                      <CopyButton text={p.resume_bullets.map((b) => `• ${b}`).join("\n")} />
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
                      {p.resume_bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.interview_notes && (
                  <details className="mt-5 rounded-md border px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold">Interview notes</summary>
                    <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{p.interview_notes}</p>
                  </details>
                )}
              </div>
              <div className="space-y-4">
                <Stages status={p.status} />
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                      Live page <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                      Code <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="mt-8">No projects yet. The first one is planned from the skills employers ask for most.</Empty>
      )}
    </>
  );
}
