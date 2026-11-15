import { Minus, Plus } from "lucide-react";
import { stepCourse } from "@/app/admin/actions";
import { PageTitle } from "@/components/admin/section";
import { SubmitButton } from "@/components/admin/submit-button";
import { getCourses, type Course } from "@/lib/admin/data";
import { daysUntil, shortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

function pace(c: Course) {
  const left = c.total_parts - c.done_parts;
  if (left === 0) return "Finished. Add it to your resume.";
  if (!c.target_date) return `${left} courses left.`;
  const weeks = Math.max(daysUntil(c.target_date) / 7, 0);
  if (weeks < 1) return `${left} courses left and the target date has passed.`;
  const perWeek = left / weeks;
  return `${left} courses left. About ${perWeek < 1 ? "one every " + Math.round(1 / perWeek) + " weeks" : Number(perWeek.toFixed(1)) + " a week"} to finish by ${shortDate(c.target_date)}.`;
}

function StepButton({ course, to, label, children }: { course: Course; to: number; label: string; children: React.ReactNode }) {
  const disabled = to < 0 || to > course.total_parts;
  return (
    <form action={stepCourse}>
      <input type="hidden" name="id" value={course.id} />
      <input type="hidden" name="done" value={to} />
      <SubmitButton
        disabled={disabled}
        aria-label={label}
        className="grid size-10 place-items-center rounded-md border transition-colors hover:border-foreground/40 active:bg-secondary disabled:opacity-40 aria-busy:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </SubmitButton>
    </form>
  );
}

export default async function StudyPage() {
  const courses = await getCourses();

  return (
    <>
      <PageTitle title="Study">Tap plus each time you finish a course on Coursera.</PageTitle>
      <ul className="mt-8 divide-y border-y">
        {courses.map((c) => (
          <li key={c.id} className="py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{c.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{pace(c)}</p>
              </div>
              <div className="flex items-center gap-3">
                <StepButton course={c} to={c.done_parts - 1} label={`One less finished course in ${c.name}`}>
                  <Minus className="size-4" />
                </StepButton>
                <span className="w-14 text-center text-lg font-bold tabular-nums">
                  {c.done_parts}/{c.total_parts}
                </span>
                <StepButton course={c} to={c.done_parts + 1} label={`Mark one more course finished in ${c.name}`}>
                  <Plus className="size-4" />
                </StepButton>
              </div>
            </div>
            {/* One segment per course in the certificate */}
            <div className="mt-4 flex gap-1" aria-hidden>
              {Array.from({ length: c.total_parts }, (_, i) => (
                <span key={i} className={cn("h-2 flex-1 rounded-sm", i < c.done_parts ? "bg-primary" : "bg-secondary")} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
