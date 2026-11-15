import { Chip, Empty, PageTitle } from "@/components/admin/section";
import { getSkillDemand } from "@/lib/admin/data";

export default async function SkillsPage() {
  const skills = await getSkillDemand();
  const top = skills[0]?.ads ?? 1;

  return (
    <>
      <PageTitle title="Skills">How many job ads ask for each skill. Missing skills with the most ads become the next project.</PageTitle>
      {skills.length ? (
        <ol className="mt-8 divide-y border-y">
          {skills.map((s) => (
            <li key={s.skill} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[14rem_1fr_auto]">
              <span className="font-medium">{s.skill}</span>
              <span className="order-last col-span-2 h-1.5 rounded-full bg-secondary sm:order-none sm:col-span-1">
                <span className={`block h-full rounded-full ${s.have ? "bg-positive" : "bg-marigold"}`} style={{ width: `${(s.ads / top) * 100}%` }} />
              </span>
              <span className="flex items-center gap-3 justify-self-end">
                <span className="text-sm tabular-nums text-muted-foreground">{s.ads} {s.ads === 1 ? "ad" : "ads"}</span>
                <Chip tone={s.have ? "have" : "missing"}>{s.have ? "You have it" : "Missing"}</Chip>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <Empty className="mt-8">Skills appear here once the first job search has read some ads.</Empty>
      )}
    </>
  );
}
