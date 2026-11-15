type Tone = "primary" | "muted" | "accent";
type Series = { name: string; values: number[]; tone: Tone };

const STROKE: Record<Tone, string> = { primary: "stroke-primary", muted: "stroke-muted-foreground/50", accent: "stroke-marigold" };
const FILL: Record<Tone, string> = { primary: "fill-primary", muted: "fill-muted-foreground/50", accent: "fill-marigold" };
const SWATCH: Record<Tone, string> = { primary: "bg-primary", muted: "bg-muted-foreground/50", accent: "bg-marigold" };

const W = 640;
const H = 260;
const PAD = { left: 52, right: 28, top: 16, bottom: 32 };

/** Simple responsive SVG line chart for season-by-season values. */
export function LineChart({
  labels,
  series,
  min,
  max,
  step,
  unit = "",
  highlightFrom,
  highlightLabel,
  title,
  everyLabel = false,
}: {
  labels: (string | number)[];
  series: Series[];
  min: number;
  max: number;
  step: number;
  unit?: string;
  highlightFrom?: number;
  highlightLabel?: string;
  title: string;
  everyLabel?: boolean;
}) {
  const x = (i: number) => PAD.left + (i / (labels.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - ((v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const ticks: number[] = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        {highlightFrom !== undefined && (
          <>
            <rect
              x={x(highlightFrom) - 6}
              y={PAD.top}
              width={x(labels.length - 1) - x(highlightFrom) + 12}
              height={H - PAD.top - PAD.bottom}
              className="fill-marigold/15"
            />
            <text x={x(highlightFrom) - 2} y={PAD.top + 14} className="fill-foreground text-[11px] font-semibold">
              {highlightLabel}
            </text>
          </>
        )}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-border" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {t.toLocaleString("en-AU")}
              {unit}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          everyLabel || i % 2 === 0 ? (
            <text key={l} x={x(i)} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {l}
            </text>
          ) : null
        )}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              fill="none"
              strokeWidth={2.5}
              strokeLinejoin="round"
              className={STROKE[s.tone]}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={3} className={FILL[s.tone]}>
                <title>
                  {labels[i]}: {v}
                  {unit}
                </title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      {series.length > 1 && (
        <figcaption className="mt-2 flex flex-wrap gap-5 text-sm text-muted-foreground">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-2">
              <span aria-hidden className={`inline-block h-0.5 w-5 ${SWATCH[s.tone]}`} />
              {s.name}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
