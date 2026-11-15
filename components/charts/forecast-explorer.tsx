"use client";

import * as React from "react";
import { LineChart } from "@/components/charts/line-chart";
import { cn } from "@/lib/utils";

type Forecast = { months: string[]; actual: number[]; model: number[]; baseline: number[] };
type Errors = { holt_winters: number; seasonal_naive: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Rounds a step up to 1, 2 or 5 times a power of ten so the axis reads cleanly. */
function niceStep(range: number) {
  const raw = range / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw;
}

/** Pick a store type and compare the 2024–25 forecasts with what NSW shops actually took. */
export function ForecastExplorer({
  forecasts,
  errors,
  start = "Total retail",
}: {
  forecasts: Record<string, Forecast>;
  errors: Record<string, Errors>;
  start?: string;
}) {
  const names = Object.keys(forecasts);
  const [name, setName] = React.useState(start);
  const f = forecasts[name];
  const e = errors[name];

  const values = [...f.actual, ...f.model, ...f.baseline];
  const step = niceStep(Math.max(...values) - Math.min(...values));
  const min = Math.floor(Math.min(...values) / step) * step;
  const max = Math.ceil(Math.max(...values) / step) * step;
  const modelWins = e.holt_winters < e.seasonal_naive;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Store type">
        {names.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={n === name}
            onClick={() => setName(n)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors active:scale-[0.97]",
              n === name ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-foreground/40"
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <LineChart
          title={`${name}: monthly turnover in 2024–25 against both forecasts, in millions of dollars`}
          labels={f.months.map((m) => MONTHS[Number(m.slice(5)) - 1])}
          series={[
            { name: "Actual", values: f.actual, tone: "primary" },
            { name: "Holt-Winters forecast", values: f.model, tone: "accent" },
            { name: "Same month last year", values: f.baseline, tone: "muted" },
          ]}
          min={min}
          max={max}
          step={step}
          unit="m"
          everyLabel
        />
        <dl className="space-y-5 self-start rounded-lg border p-5">
          <div>
            <dt className="text-sm text-muted-foreground">Model error, 3 test years</dt>
            <dd className="text-3xl font-extrabold tabular-nums">{e.holt_winters.toFixed(2)}%</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Baseline error</dt>
            <dd className="text-3xl font-extrabold tabular-nums text-muted-foreground">{e.seasonal_naive.toFixed(2)}%</dd>
          </div>
          <p className={cn("text-sm font-semibold", modelWins ? "text-positive" : "text-negative")}>
            {modelWins
              ? `The model was ${(e.seasonal_naive / e.holt_winters).toFixed(1)}x more accurate here.`
              : "The simple baseline won for this store type."}
          </p>
        </dl>
      </div>
    </div>
  );
}
