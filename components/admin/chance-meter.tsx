import { cn } from "@/lib/utils";

/** The chance score drawn as a ten-tick ruler; the same mark is used on every admin page. */
export function ChanceMeter({ value, className }: { value: number | null; className?: string }) {
  if (value == null) return <span className="text-sm text-muted-foreground">Not scored</span>;
  const tone = value >= 7 ? "bg-positive" : value >= 5 ? "bg-primary" : "bg-marigold";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} title={`Chance ${value} out of 10`}>
      <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={cn("w-[3px] rounded-[1px]", i < value ? tone : "bg-border", i === 4 || i === 9 ? "h-3.5" : "h-2.5")}
          />
        ))}
      </span>
      <span className="text-sm font-semibold tabular-nums">
        {value}
        <span className="font-normal text-muted-foreground">/10</span>
      </span>
    </span>
  );
}
