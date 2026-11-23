import { Empty, PageTitle } from "@/components/admin/section";
import { getRecruiters, type Recruiter } from "@/lib/admin/data";
import { daysUntil, shortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const STATUS: Record<Recruiter["status"], { label: string; dot: string }> = {
  new: { label: "Not contacted", dot: "bg-muted-foreground/50" },
  emailed: { label: "Emailed", dot: "bg-primary" },
  followed_up: { label: "Followed up", dot: "bg-primary" },
  replied: { label: "Replied", dot: "bg-positive" },
  bounced: { label: "Bounced", dot: "bg-negative" },
  do_not_contact: { label: "Do not contact", dot: "bg-negative" },
};

// What, if anything, needs Aman for this recruiter. Lower rank shows first.
function action(r: Recruiter): { rank: number; label: string } | null {
  if (r.status === "replied") return { rank: 0, label: "Reply in Gmail" };
  if (r.status === "emailed" && r.first_emailed_on && daysUntil(r.first_emailed_on) <= -7) return { rank: 1, label: "Follow-up due" };
  if (r.status === "new" && !r.email && r.linkedin) return { rank: 2, label: "Connect on LinkedIn" };
  return null;
}

export default async function RecruitersPage() {
  const recruiters = (await getRecruiters()).sort((a, b) => (action(a)?.rank ?? 9) - (action(b)?.rank ?? 9));
  const replied = recruiters.filter((r) => r.status === "replied");
  const needs = recruiters.filter(action).length;

  return (
    <>
      <PageTitle title="Recruiters">
        Sydney data recruiters contacted from your Gmail. One follow-up after five business days, never more.
        {replied.length > 0 && ` ${replied.length} replied: answer them yourself from Gmail.`}
        {needs > 0 && <span className="font-semibold text-foreground"> {needs} need you, shown first.</span>}
      </PageTitle>
      {recruiters.length ? (
        <ul className="mt-8 divide-y border-y">
          {recruiters.map((r) => (
            <li key={r.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_10rem_9rem] sm:items-center sm:gap-6">
              <div className="min-w-0">
                <p className="font-semibold">
                  {r.linkedin ? (
                    <a href={r.linkedin} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                      {r.name}
                    </a>
                  ) : (
                    r.name
                  )}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {[r.title, r.firm].filter(Boolean).join(", ")}
                  {r.email && ` · ${r.email}`}
                </p>
              </div>
              <span className="flex flex-col items-start gap-1 text-sm">
                <span className="flex items-center gap-2">
                  <span aria-hidden className={cn("size-2 rounded-full", STATUS[r.status].dot)} />
                  {STATUS[r.status].label}
                </span>
                {action(r) && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{action(r)!.label}</span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                {r.followed_up_on
                  ? `Followed up ${shortDate(r.followed_up_on)}`
                  : r.first_emailed_on
                    ? `Emailed ${shortDate(r.first_emailed_on)}`
                    : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="mt-8">No recruiters yet. The weekly outreach run adds them here.</Empty>
      )}
    </>
  );
}
