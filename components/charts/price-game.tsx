"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Sale = { date: string; suburb: string; area: number; price: number; predicted: number };

const MIN = 300_000;
const MAX = 5_000_000;
// The slider moves on a log scale so $400k and $4m are equally easy to reach.
const toSlider = (v: number) => Math.round((Math.log(v / MIN) / Math.log(MAX / MIN)) * 1000);
const fromSlider = (s: number) => Math.round((MIN * Math.pow(MAX / MIN, s / 1000)) / 5000) * 5000;

const money = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}m` : `$${Math.round(v / 1000)}k`);
const pctOff = (guess: number, actual: number) => Math.abs(guess - actual) / actual;

function Bar({ label, value, actual, tone }: { label: string; value: number; actual: number; tone: string }) {
  const scale = Math.max(value, actual) * 1.08;
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className={`h-4 rounded-sm transition-[width] duration-500 ease-out ${tone}`} style={{ width: `${(value / scale) * 100}%` }} />
        <span className="shrink-0 font-semibold tabular-nums">{money(value)}</span>
      </span>
    </div>
  );
}

/** Guess a real July–December 2018 sale, then compare with the model that never saw it. */
export function PriceGame({ sales }: { sales: Sale[] }) {
  const [order, setOrder] = React.useState<number[]>(() => sales.map((_, i) => i));
  const [round, setRound] = React.useState(0);
  const [guess, setGuess] = React.useState(1_000_000);
  const [revealed, setRevealed] = React.useState(false);
  const [score, setScore] = React.useState({ played: 0, beatModel: 0 });

  // Shuffle after mount so the server and browser render the same first sale.
  React.useEffect(() => setOrder((o) => [...o].sort(() => Math.random() - 0.5)), []);

  const sale = sales[order[round % order.length]];
  const yourError = pctOff(guess, sale.price);
  const modelError = pctOff(sale.predicted, sale.price);

  function reveal() {
    setRevealed(true);
    setScore((s) => ({ played: s.played + 1, beatModel: s.beatModel + (yourError < modelError ? 1 : 0) }));
  }

  function next() {
    setRound((r) => r + 1);
    setRevealed(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div>
        <p className="text-sm text-muted-foreground">
          House sold {new Date(sale.date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{sale.suburb}</p>
        <p className="mt-1 text-lg">{sale.area.toLocaleString("en-AU")} m² of land</p>

        <label htmlFor="guess" className="mt-8 block text-sm font-semibold">
          Your guess: <span className="tabular-nums">{money(guess)}</span>
        </label>
        <input
          id="guess"
          type="range"
          min={0}
          max={1000}
          value={toSlider(guess)}
          disabled={revealed}
          onChange={(e) => setGuess(fromSlider(Number(e.target.value)))}
          className="mt-3 w-full accent-[hsl(var(--primary))] disabled:opacity-60"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>$300k</span>
          <span>$5m</span>
        </div>
        <div className="mt-6">
          {revealed ? <Button onClick={next}>Next house</Button> : <Button onClick={reveal}>Reveal the price</Button>}
        </div>
      </div>

      <div aria-live="polite" className="flex flex-col justify-center">
        {revealed ? (
          <>
            <p className="text-sm text-muted-foreground">It sold for</p>
            <p className="mt-1 text-5xl font-extrabold tabular-nums tracking-tight">{money(sale.price)}</p>
            <div className="mt-6 space-y-2.5">
              <Bar label="You" value={guess} actual={sale.price} tone="bg-marigold" />
              <Bar label="Model" value={sale.predicted} actual={sale.price} tone="bg-primary" />
              <Bar label="Actual" value={sale.price} actual={sale.price} tone="bg-foreground" />
            </div>
            <p className="mt-5 text-[15px]">
              {yourError < modelError ? "You beat the model on this one. " : "The model was closer this time. "}
              <span className="text-muted-foreground">
                You were {Math.round(yourError * 100)}% off, the model {Math.round(modelError * 100)}%.
              </span>
            </p>
          </>
        ) : (
          <p className="max-w-[40ch] text-muted-foreground">
            Pick a price, then reveal what it sold for and what my gradient boosting model predicted. The model was trained
            only on sales before July 2018, so it never saw this one.
          </p>
        )}
        {score.played > 0 && (
          <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">
            You beat the model in <span className="font-semibold text-foreground tabular-nums">{score.beatModel}</span> of{" "}
            <span className="tabular-nums">{score.played}</span> {score.played === 1 ? "house" : "houses"}.
          </p>
        )}
      </div>
    </div>
  );
}
