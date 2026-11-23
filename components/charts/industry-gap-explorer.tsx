"use client";

import * as React from "react";
import { BarRows } from "@/components/charts/bar-rows";
import { cn } from "@/lib/utils";

export type IndustryGap = {
  industry: string;
  share: { non_managers: number; promotions_to_manager: number; managers: number };
  promotion: { women: number; men: number; pooled: number; same_employer: number; ci95: number[] };
  resignation: { women: number; men: number };
};

function verdict([low, high]: number[]) {
  if (high < 1) return { text: "Women were promoted less often than men at the same employers.", tone: "text-negative" };
  if (low > 1) return { text: "Women were promoted more often than men at the same employers.", tone: "text-positive" };
  return { text: "Too close to call: the interval includes no gap at all.", tone: "text-muted-foreground" };
}

/** Pick an industry and see where women thin out, and whether the gap holds up at the same employer. */
export function IndustryGapExplorer({ rows, start = "All industries" }: { rows: IndustryGap[]; start?: string }) {
  const [name, setName] = React.useState(start);
  const r = rows.find((row) => row.industry === name) ?? rows[0];
  const v = verdict(r.promotion.ci95);

  return (
    <div>
      <label htmlFor="industry" className="text-sm font-semibold">
        Industry
      </label>
      <select
        id="industry"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-2 block w-full max-w-md rounded-md border bg-background px-3 py-2.5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {rows.map((row) => (
          <option key={row.industry}>{row.industry}</option>
        ))}
      </select>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-bold">Women&apos;s share at each step</h3>
            <BarRows
              max={100}
              rows={[
                { label: "Non-managers", value: r.share.non_managers, tone: "muted" },
                { label: "Promoted into management", value: r.share.promotions_to_manager, tone: "primary" },
                { label: "Managers", value: r.share.managers, tone: "accent" },
              ]}
            />
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-bold">Promoted per 100 non-managers</h3>
              <BarRows
                max={Math.max(r.promotion.women, r.promotion.men) * 1.4}
                unit=""
                decimals={2}
                rows={[
                  { label: "Women", value: r.promotion.women, tone: "primary" },
                  { label: "Men", value: r.promotion.men, tone: "muted" },
                ]}
              />
            </div>
            <div>
              <h3 className="mb-4 font-bold">Resigned per 100 staff</h3>
              <BarRows
                max={Math.max(r.resignation.women, r.resignation.men) * 1.4}
                unit=""
                rows={[
                  { label: "Women", value: r.resignation.women, tone: "primary" },
                  { label: "Men", value: r.resignation.men, tone: "muted" },
                ]}
              />
            </div>
          </div>
        </div>

        <dl aria-live="polite" className="space-y-5 self-start rounded-lg border bg-background p-5">
          <div>
            <dt className="text-sm text-muted-foreground">Women to men, pooled</dt>
            <dd className="text-3xl font-extrabold tabular-nums text-muted-foreground">{r.promotion.pooled.toFixed(3)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Women to men, same employer</dt>
            <dd className="text-3xl font-extrabold tabular-nums">{r.promotion.same_employer.toFixed(3)}</dd>
            <dd className="mt-1 text-sm tabular-nums text-muted-foreground">
              95% interval {r.promotion.ci95[0].toFixed(2)} to {r.promotion.ci95[1].toFixed(2)}
            </dd>
          </div>
          <p className={cn("text-sm font-semibold", v.tone)}>{v.text}</p>
        </dl>
      </div>
    </div>
  );
}
