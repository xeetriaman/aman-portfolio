"use client";

import * as React from "react";

type LiveModel = { features: string[]; mean: number[]; std: number[]; coef: number[]; intercept: number };

/** Runs the exported logistic regression in the browser. */
function winProbability(m: LiveModel, runsNeeded: number, ballsLeft: number, wicketsLeft: number) {
  const rr = (6 * runsNeeded) / Math.max(ballsLeft, 1);
  const x = [runsNeeded, ballsLeft, wicketsLeft, rr, rr * (10 - wicketsLeft), 1];
  const z = x.reduce((acc, v, i) => acc + (m.coef[i] * (v - m.mean[i])) / m.std[i], m.intercept);
  return 1 / (1 + Math.exp(-z));
}

function Field({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
          className="w-16 rounded-md border bg-background px-2 py-1 text-right text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[hsl(var(--primary))]"
      />
    </div>
  );
}

export function WinCalculator({ model }: { model: LiveModel }) {
  const [runs, setRuns] = React.useState(48);
  const [balls, setBalls] = React.useState(30);
  const [wickets, setWickets] = React.useState(6);
  const p = winProbability(model, runs, balls, wickets);
  const pct = Math.round(p * 100);
  const rr = ((6 * runs) / Math.max(balls, 1)).toFixed(1);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
      <div className="space-y-5">
        <Field id="runs" label="Runs needed" value={runs} min={1} max={260} onChange={setRuns} />
        <Field id="balls" label="Balls left" value={balls} min={1} max={120} onChange={setBalls} />
        <Field id="wickets" label="Wickets in hand" value={wickets} min={1} max={10} onChange={setWickets} />
        <p className="text-sm text-muted-foreground">Required run rate: {rr} per over</p>
      </div>
      <div aria-live="polite" className="flex flex-col justify-center">
        <p className="text-sm text-muted-foreground">Chance the chasing team wins</p>
        <p className="mt-1 text-6xl font-extrabold tabular-nums tracking-tight">{pct}%</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-secondary" aria-hidden>
          <div className="bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
          <div className="bg-marigold" style={{ width: `${100 - pct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="font-semibold text-primary">Chasing team {pct}%</span>
          <span className="text-muted-foreground">Defending team {100 - pct}%</span>
        </div>
      </div>
    </div>
  );
}
