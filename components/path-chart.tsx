import { path } from "@/data/profile";

// Plots the career path as a rising line: each step is a milestone in time order.
const W = 960;
const H = 220;
const PAD = { left: 24, right: 24, top: 28, bottom: 36 };
const X0 = 2023.75;
const X1 = 2028.75;

const x = (t: number) => PAD.left + ((t - X0) / (X1 - X0)) * (W - PAD.left - PAD.right);
const y = (i: number, n: number) => H - PAD.bottom - (i / (n - 1)) * (H - PAD.top - PAD.bottom);

export function PathChart() {
  // Built at deploy time, so the marker moves with each weekly rebuild
  const now = new Date();
  const today = Math.min(X1 - 0.1, now.getFullYear() + now.getMonth() / 12);
  const n = path.length;
  const pts = path.map((p, i) => ({ ...p, cx: x(p.t), cy: y(i, n) }));
  const done = pts.filter((p) => !p.planned);
  const lastDone = done[done.length - 1];
  const planned = pts.filter((p) => p.planned);
  const line = (list: typeof pts) => list.map((p, i) => `${i === 0 ? "M" : "L"}${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(" ");
  const years = [2024, 2025, 2026, 2027, 2028];

  return (
    <figure className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <figcaption className="text-lg font-bold">My path so far</figcaption>
        <p className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-0.5 w-6 bg-primary" /> Done
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="inline-block w-6 border-t-2 border-dashed border-marigold" /> Planned
          </span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 hidden w-full md:block"
        role="img"
        aria-label="Timeline from Bachelor's degree in 2024 through three internships to a Master of Data Science finishing in 2028"
      >
        {years.map((yr) => (
          <g key={yr}>
            <line x1={x(yr)} x2={x(yr)} y1={PAD.top - 12} y2={H - PAD.bottom} className="stroke-border" strokeWidth={1} />
            <text x={x(yr)} y={H - 12} textAnchor="middle" className="fill-muted-foreground text-[13px]">
              {yr}
            </text>
          </g>
        ))}

        <line x1={x(today)} x2={x(today)} y1={PAD.top - 12} y2={H - PAD.bottom} className="stroke-foreground" strokeWidth={1} strokeDasharray="2 4" />
        <text x={x(today) + 6} y={PAD.top - 2} className="fill-foreground text-[12px] font-semibold">
          Today
        </text>

        <path d={line(done)} fill="none" className="path-draw stroke-primary" strokeWidth={3} strokeLinejoin="round" pathLength={1} />
        <path d={line([lastDone, ...planned])} fill="none" className="stroke-marigold" strokeWidth={3} strokeDasharray="7 7" />

        {pts.map((p, i) => (
          <g key={p.label}>
            <circle cx={p.cx} cy={p.cy} r={13} className={p.planned ? "fill-background stroke-marigold" : "fill-primary stroke-background"} strokeWidth={3} />
            <text
              x={p.cx}
              y={p.cy + 4.5}
              textAnchor="middle"
              className={`text-[12px] font-bold ${p.planned ? "fill-foreground" : "fill-primary-foreground"}`}
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      <ol className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
        {path.map((p, i) => (
          <li key={p.label} className="flex gap-3 md:block">
            <span
              aria-hidden
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold md:hidden ${
                p.planned ? "border-2 border-marigold" : "bg-primary text-primary-foreground"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="hidden font-bold text-foreground md:inline">{i + 1}. </span>
                {p.when}
              </p>
              <p className="mt-0.5 font-semibold leading-snug">{p.label}</p>
              <p className="text-sm text-muted-foreground">{p.where}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
