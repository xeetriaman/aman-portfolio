import { cn } from "@/lib/utils";

// One colour per job board so the source is recognisable at a glance.
const SOURCES: Record<string, { label: string; dot: string }> = {
  seek: { label: "SEEK", dot: "bg-[#e60278]" },
  linkedin: { label: "LinkedIn", dot: "bg-[#0a66c2]" },
  indeed: { label: "Indeed", dot: "bg-[#2557a7]" },
  jora: { label: "Jora", dot: "bg-[#1fa04a]" },
  gradconnection: { label: "GradConnection", dot: "bg-[#f26b21]" },
  "seek grad": { label: "SEEK Grad", dot: "bg-[#e60278]" },
  prosple: { label: "Prosple", dot: "bg-[#6b4bd8]" },
  "employment hero": { label: "Employment Hero", dot: "bg-[#7622d7]" },
  email: { label: "Email", dot: "bg-foreground" },
};

export function SourceBadge({ source, className }: { source: string | null; className?: string }) {
  if (!source) return null;
  const known = SOURCES[source.toLowerCase()];
  const label = known?.label ?? source;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded border px-1.5 py-px text-[11px] font-semibold leading-4 tracking-wide text-foreground/80", className)}
      title={`Listed on ${label}`}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", known?.dot ?? "bg-muted-foreground")} />
      {label}
    </span>
  );
}
