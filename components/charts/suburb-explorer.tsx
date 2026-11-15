"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Suburb = { name: string; sales: number; price: number; perSqm: number; area: number };

const money = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}m` : `$${Math.round(v / 1000)}k`);

/** Search any Sydney suburb with 10+ house sales in 2018 and compare it with the city. */
export function SuburbExplorer({ suburbs, sydneyMedian, start }: { suburbs: Suburb[]; sydneyMedian: number; start: string }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(() => suburbs.find((s) => s.name === start) ?? suburbs[0]);

  const q = query.trim().toLowerCase();
  const matches = q ? suburbs.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 8) : [];
  const ratio = selected.price / sydneyMedian;
  const scale = Math.max(selected.price, sydneyMedian) * 1.1;

  return (
    <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-12">
      <div>
        <label htmlFor="suburb" className="text-sm font-semibold">
          Find a suburb
        </label>
        <input
          id="suburb"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${suburbs.length} suburbs, e.g. Ryde`}
          autoComplete="off"
          className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {q && (
          <ul className="mt-2 divide-y rounded-md border">
            {matches.length ? (
              matches.map((s) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(s);
                      setQuery("");
                    }}
                    className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
                  >
                    {s.name}
                    <span className="tabular-nums text-muted-foreground">{money(s.price)}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">No suburb with 10 or more house sales matches.</li>
            )}
          </ul>
        )}
      </div>

      <div aria-live="polite">
        <p className="text-3xl font-extrabold tracking-tight">{selected.name}</p>
        <dl className="mt-5 grid grid-cols-3 gap-4">
          {[
            { label: "Median house price", value: money(selected.price) },
            { label: "Median price per m²", value: `$${selected.perSqm.toLocaleString("en-AU")}` },
            { label: "Typical block", value: `${selected.area.toLocaleString("en-AU")} m²` },
          ].map((d) => (
            <div key={d.label}>
              <dt className="text-sm text-muted-foreground">{d.label}</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{d.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 space-y-2" aria-hidden>
          {[
            { label: selected.name, value: selected.price, tone: "bg-primary" },
            { label: "All Sydney", value: sydneyMedian, tone: "bg-muted-foreground/40" },
          ].map((b) => (
            <div key={b.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-sm">
              <span className="truncate text-muted-foreground">{b.label}</span>
              <span className={cn("h-4 rounded-sm transition-[width] duration-500 ease-out", b.tone)} style={{ width: `${(b.value / scale) * 100}%` }} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-[15px] text-muted-foreground">
          {Math.abs(ratio - 1) < 0.05
            ? "About the same as the Sydney median."
            : `${Math.round(Math.abs(ratio - 1) * 100)}% ${ratio > 1 ? "above" : "below"} the Sydney median of ${money(sydneyMedian)}.`}{" "}
          Based on {selected.sales} house sales.
        </p>
      </div>
    </div>
  );
}
