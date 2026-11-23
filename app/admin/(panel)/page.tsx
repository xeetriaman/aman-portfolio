import Link from "next/link";
import { JobRow } from "@/components/admin/job-row";
import { Empty, PageTitle, Section } from "@/components/admin/section";
import { StatusDot } from "@/components/admin/status-dot";
import { STATUS_DOT } from "@/lib/admin/constants";
import { STATUS_LABEL, getCourses, getJobs, getLastRuns, getProjects, getRecruiters, getSkillDemand, type JobStatus } from "@/lib/admin/data";
import { StatCards, type Stat } from "@/components/admin/stat-cards";
import { WeeklyProgress } from "@/components/admin/weekly-progress";
import { daysUntil, longToday, timeAgo } from "@/lib/admin/format";

const FUNNEL: JobStatus[] = ["queued", "applied", "replied", "interview", "offer"];
const REPLIED: JobStatus[] = ["replied", "interview", "offer"];
const RUN_LABEL: Record<string, string> = { jobs: "Job search", recruiters: "Recruiters", project: "Project build", report: "Weekly report" };

export default async function AdminHome() {
  const [jobs, projects, courses, skills, runs, recruiters] = await Promise.all([
    getJobs(),
    getProjects(),
    getCourses(),
    getSkillDemand(),
    getLastRuns(),
    getRecruiters(),
  ]);

  // Jobs closing within a week jump the queue; otherwise best chance first.
  const urgency = (closes: string | null) => (closes && daysUntil(closes) >= 0 && daysUntil(closes) <= 7 ? 1 : 0);
  const toApply = jobs
    .filter((j) => j.status === "queued")
    .sort((a, b) => urgency(b.closes_on) - urgency(a.closes_on) || (b.chance ?? 0) - (a.chance ?? 0));
  const counts = Object.fromEntries(FUNNEL.map((s) => [s, jobs.filter((j) => j.status === s).length])) as Record<JobStatus, number>;
  const funnelTotal = FUNNEL.reduce((sum, s) => sum + counts[s], 0);
  const project = projects.at(0);
  const gaps = skills.filter((s) => !s.have).slice(0, 6);
  const closingSoon = toApply.filter((j) => j.closes_on && daysUntil(j.closes_on) >= 0 && daysUntil(j.closes_on) <= 7);
  // Monday of this week in Sydney, as yyyy-mm-dd, so it compares directly with applied_on.
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
  today.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const monday = today.toLocaleDateString("en-CA");
  const applied = jobs.filter((j) => j.applied_on);
  const replies = jobs.filter((j) => REPLIED.includes(j.status)).length;
  const closing3 = toApply.filter((j) => j.closes_on && daysUntil(j.closes_on) >= 0 && daysUntil(j.closes_on) <= 3).length;
  // Follow-ups go out after 5 business days, which is about a week.
  const followUpDue = recruiters.filter((r) => r.status === "emailed" && r.first_emailed_on && daysUntil(r.first_emailed_on) <= -7).length;
  const stats: Stat[] = [
    { label: "Applied this week", value: applied.filter((j) => j.applied_on! >= monday).length, hint: `${applied.length} in total` },
    { label: "Ready to apply", value: toApply.length, hint: "queued with a cover letter" },
    { label: "Closing in 3 days", value: closing3, hint: "apply to these first", alert: closing3 > 0 },
    { label: "Replies", value: replies, hint: "replied, interview or offer" },
    { label: "Response rate", value: applied.length ? Math.round((replies / applied.length) * 100) : 0, suffix: "%", hint: "of applications sent" },
    { label: "Follow-ups due", value: followUpDue, hint: "recruiters emailed a week ago" },
  ];
  const lastRun = Object.fromEntries([...runs].reverse().map((r) => [r.kind, r.ran_at]));

  return (
    <>
      <PageTitle title={longToday()}>
        {toApply.length
          ? `${toApply.length} ${toApply.length === 1 ? "job is" : "jobs are"} ready for you to apply to.`
          : "Nothing waiting for you right now."}
        {closingSoon.length > 0 && (
          <span className="font-semibold text-negative">
            {" "}
            {closingSoon.length} {closingSoon.length === 1 ? "closes" : "close"} within a week.
          </span>
        )}
      </PageTitle>

      <div className="mb-12">
        <StatCards stats={stats} />
      </div>

      <Section title="Apply next" more={toApply.length > 6 ? { href: "/admin/jobs?status=queued", label: `All ${toApply.length}` } : undefined}>
        {toApply.length ? (
          <ul className="divide-y border-y">{toApply.slice(0, 6).map((job) => <JobRow key={job.id} job={job} />)}</ul>
        ) : (
          <Empty>The next job search fills this list. Jobs that can be applied to by email are sent for you and show up as Applied.</Empty>
        )}
      </Section>

      <Section title="Pipeline" more={{ href: "/admin/jobs", label: "All jobs" }}>
        {/* One proportional strip: where every live application sits right now. */}
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-secondary">
          {FUNNEL.map((s) => counts[s] > 0 && <span key={s} className={STATUS_DOT[s]} style={{ flexGrow: counts[s] }} />)}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-y-4 sm:grid-cols-5">
          {FUNNEL.map((s) => (
            <div key={s}>
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <StatusDot status={s} />
                {STATUS_LABEL[s]}
              </dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{counts[s]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Applications per week">
        <WeeklyProgress jobs={jobs} />
      </Section>

      <div className="grid gap-x-12 md:grid-cols-2">
        <Section title="This week's project" more={{ href: "/admin/projects", label: "Projects" }}>
          {project ? (
            <div className="border-t pt-4">
              <p className="font-semibold">{project.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.status === "published" ? "Published" : project.status === "analysis" ? "Analysis in progress" : "Planned"}
                {project.skill_focus.length > 0 && ` · ${project.skill_focus.join(", ")}`}
              </p>
            </div>
          ) : (
            <Empty>The first project is planned after the first job search shows which skills employers want.</Empty>
          )}
        </Section>

        <Section title="Study" more={{ href: "/admin/study", label: "Update" }}>
          <ul className="space-y-4 border-t pt-4">
            {courses.map((c) => (
              <li key={c.id}>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="font-medium">{c.name.replace(" Professional Certificate", "")}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {c.done_parts}/{c.total_parts}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(c.done_parts / c.total_parts) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-x-12 md:grid-cols-2">
        <Section title="Skills you're missing" more={{ href: "/admin/skills", label: "All skills" }}>
          {gaps.length ? (
            <ol className="divide-y border-y">
              {gaps.map((g) => (
                <li key={g.skill} className="flex justify-between py-2.5 text-[15px]">
                  <span>{g.skill}</span>
                  <span className="tabular-nums text-muted-foreground">{g.ads} {g.ads === 1 ? "ad" : "ads"}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>Filled in from the skills listed in each job ad.</Empty>
          )}
        </Section>

        <Section title="Automatic runs">
          <ul className="divide-y border-y text-[15px]">
            {Object.entries(RUN_LABEL).map(([kind, label]) => (
              <li key={kind} className="flex justify-between py-2.5">
                <span>{label}</span>
                <span className="text-muted-foreground">{lastRun[kind] ? timeAgo(lastRun[kind]) : "Not run yet"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            <Link href="/admin/recruiters" className="text-brand hover:underline">
              Recruiter contacts
            </Link>{" "}
            are tracked separately.
          </p>
        </Section>
      </div>
    </>
  );
}
