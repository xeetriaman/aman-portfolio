type Row = { label: string; value: number; note?: string; tone?: "primary" | "muted" | "accent" };

/** Horizontal bars with labels on the left; values are percentages or plain numbers. */
export function BarRows({ rows, max, unit = "%", reference }: { rows: Row[]; max: number; unit?: string; reference?: number }) {
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,15rem)_1fr]">
          <span className="text-sm leading-tight">
            {r.label}
            {r.note && <span className="text-muted-foreground"> ({r.note})</span>}
          </span>
          <span className="relative flex h-7 items-center">
            {reference !== undefined && (
              <span
                aria-hidden
                className="absolute inset-y-0 border-l border-dashed border-muted-foreground/60"
                style={{ left: `${(reference / max) * 100}%` }}
              />
            )}
            <span
              className={`h-5 rounded-sm ${
                r.tone === "accent" ? "bg-marigold" : r.tone === "muted" ? "bg-muted-foreground/35" : "bg-primary"
              }`}
              style={{ width: `${(r.value / max) * 100}%` }}
            />
            <span className="ml-2 text-sm font-semibold tabular-nums">
              {Number.isInteger(r.value) ? r.value : r.value.toFixed(1)}
              {unit}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
