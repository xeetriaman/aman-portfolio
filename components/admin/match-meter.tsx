import { cn } from "@/lib/utils";

/**
 * Skill match: one square per skill the ad names, green when it is on the resume,
 * amber when it is missing. Reads as a tiny fingerprint of how well the ad fits.
 */
export function MatchMeter({ skills, missing, size = "sm" }: { skills: string[]; missing: string[]; size?: "sm" | "lg" }) {
  if (!skills.length) return null;
  const gaps = new Set(missing.map((s) => s.toLowerCase()));
  // Matched skills first so the green run shows the share at a glance.
  const ordered = [...skills].sort((a, b) => Number(gaps.has(a.toLowerCase())) - Number(gaps.has(b.toLowerCase())));
  const have = skills.length - skills.filter((s) => gaps.has(s.toLowerCase())).length;

  return (
    <span className="inline-flex items-center gap-2.5" title={`${have} of ${skills.length} skills in the ad are on your resume`}>
      <span aria-hidden className={cn("grid grid-flow-col gap-[3px]", size === "lg" ? "grid-rows-1" : "grid-rows-2")}>
        {ordered.map((s) => (
          <span
            key={s}
            className={cn(
              "rounded-[2px]",
              size === "lg" ? "size-3" : "size-[5px]",
              gaps.has(s.toLowerCase()) ? "bg-marigold/70" : "bg-positive"
            )}
          />
        ))}
      </span>
      <span className="text-sm tabular-nums">
        <span className="font-semibold">{have}</span>
        <span className="text-muted-foreground">/{skills.length} skills</span>
      </span>
    </span>
  );
}
