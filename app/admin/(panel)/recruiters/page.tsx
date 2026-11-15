import { Empty, PageTitle } from "@/components/admin/section";
import { getRecruiters, type Recruiter } from "@/lib/admin/data";
import { shortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const STATUS: Record<Recruiter["status"], { label: string; dot: string }> = {
  new: { label: "Not contacted", dot: "bg-muted-foreground/50" },
  emailed: { label: "Emailed", dot: "bg-primary" },
  followed_up: { label: "Followed up", dot: "bg-primary" },
  replied: { label: "Replied", dot: "bg-positive" },
  bounced: { label: "Bounced", dot: "bg-negative" },
  do_not_contact: { label: "Do not contact", dot: "bg-negative" },
};

export default async function RecruitersPage() {
  const recruiters = await getRecruiters();
  const replied = recruiters.filter((r) => r.status === "replied");

  return (
    <>
      <PageTitle title="Recruiters">
        Sydney data recruiters contacted from your Gmail. One follow-up after five business days, never more.
        {replied.length > 0 && ` ${replied.length} replied: answer them yourself from Gmail.`}
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
              <span className="flex items-center gap-2 text-sm">
                <span aria-hidden className={cn("size-2 rounded-full", STATUS[r.status].dot)} />
                {STATUS[r.status].label}
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
