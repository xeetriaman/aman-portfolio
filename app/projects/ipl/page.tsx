import type { Metadata } from "next";
import { Github } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/charts/line-chart";
import { BarRows } from "@/components/charts/bar-rows";
import { WinCalculator } from "@/components/charts/win-calculator";
import ipl from "@/data/ipl.json";

export const metadata: Metadata = {
  title: "IPL Match Analytics, 2008–2026 | Aman Chhetri",
  description:
    "What decides a T20 match? Analysis of 1,243 IPL matches with Python and SQL, plus a live win-probability model.",
};

const CODE = "https://github.com/xeetriaman/data-projects/tree/main/ipl-match-analytics";

function Block({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-12">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function IplPage() {
  const s = ipl.summary;
  const seasons = ipl.seasons;
  const labels = seasons.map((r) => r.season);
  const latest = seasons[seasons.length - 1];
  const firstImpact = labels.indexOf(2023);
  const phaseName: Record<string, string> = { powerplay: "Powerplay (overs 1–6)", middle: "Middle (7–15)", death: "Death (16–20)" };
  const live = ipl.live.by_stage as Record<string, { accuracy: number }>;
  const retrain = ipl.live.retrain_check;

  const stats = [
    { value: s.matches.toLocaleString(), label: `IPL matches analysed, ${s.seasons}` },
    { value: `${s.toss_winner_win_pct}%`, label: "of matches won by the toss winner" },
    { value: `${s.chasing_win_pct}%`, label: "of matches won by the chasing side" },
    { value: `${Math.round(latest.avg_first_innings)}`, label: `average first-innings score in ${latest.season}` },
  ];

  return (
    <>
      <SiteHeader />
      <main className="container pb-20 pt-12 sm:pt-16">
        <a href="/#projects" className="text-sm font-semibold text-primary hover:underline">
          Back to projects
        </a>
        <h1 className="mt-4 max-w-[20ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          What decides an IPL match?
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          Every Indian Premier League match from 2008 to 2026, ball by ball. I built the dataset with Python, answered the
          questions with SQL, and tested two prediction models on seasons they had never seen.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#calculator">Try the win calculator</a>
          </Button>
          <Button asChild variant="outline">
            <a href={CODE} target="_blank" rel="noreferrer">
              <Github /> View code and SQL
            </a>
          </Button>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-10 md:grid-cols-4">
          {stats.map((st) => (
            <div key={st.label}>
              <dt className="sr-only">{st.label}</dt>
              <dd className="text-4xl font-extrabold tabular-nums tracking-tight">{st.value}</dd>
              <dd className="mt-1 text-sm leading-snug text-muted-foreground">{st.label}</dd>
            </div>
          ))}
        </dl>

        <section id="calculator" className="mt-12 rounded-lg border bg-secondary/50 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Live win calculator</h2>
          <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">
            Set the state of a chase and see the chasing team&apos;s chance of winning. It runs my logistic regression model,
            trained on {ipl.live_model.trained_on_states.toLocaleString()} over-by-over chase situations and tuned for the
            current high-scoring era.
          </p>
          <div className="mt-8">
            <WinCalculator model={ipl.live_model} />
          </div>
        </section>

        <Block
          title="Scores have jumped since 2023"
          intro={`The Impact Player rule lets teams swap in an extra batter or bowler. Since it arrived in 2023, the average first-innings score has risen from ${Math.round(
            seasons[firstImpact - 1].avg_first_innings
          )} to ${Math.round(latest.avg_first_innings)}, and ${Math.round(latest.pct_200_plus)}% of first innings in ${latest.season} passed 200.`}
        >
          <LineChart
            title="Average first-innings score by season"
            labels={labels}
            series={[{ name: "Average first-innings score", values: seasons.map((r) => r.avg_first_innings), tone: "primary" }]}
            min={140}
            max={200}
            step={20}
            highlightFrom={firstImpact}
            highlightLabel="Impact Player rule"
          />
        </Block>

        <Block
          title="Captains love to chase. It helps, but less than they think."
          intro="Most toss winners now choose to field first. Chasing sides do win more often than not, but the gap is small, and the toss itself is close to a coin flip."
        >
          <LineChart
            title="Toss winners choosing to field versus chasing win rate, by season"
            labels={labels}
            series={[
              { name: "Toss winners who chose to field", values: seasons.map((r) => r.chose_to_field_pct), tone: "muted" },
              { name: "Matches won by the chasing side", values: seasons.map((r) => r.chasing_win_pct), tone: "primary" },
            ]}
            min={30}
            max={90}
            step={20}
            unit="%"
          />
        </Block>

        <Block
          title="Where the extra runs come from"
          intro="Runs per over in each phase of the innings. The powerplay changed the most: teams now attack from the first ball."
        >
          <div className="grid gap-8 md:grid-cols-2">
            {["2008-2022", "2023 onwards"].map((era) => (
              <div key={era}>
                <h3 className="mb-4 font-bold">{era}</h3>
                <BarRows
                  unit=""
                  max={12}
                  rows={ipl.phases
                    .filter((p) => p.era === era)
                    .map((p) => ({ label: phaseName[p.phase], value: p.run_rate, tone: era === "2008-2022" ? ("muted" as const) : ("primary" as const) }))}
                />
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="Some grounds favour the chasing side"
          intro="Chasing win rate at grounds with at least 30 completed matches. The dashed line marks 50%."
        >
          <BarRows
            max={80}
            reference={50}
            rows={ipl.venues.map((v) => ({
              label: v.venue,
              note: `${v.matches} matches`,
              value: v.chasing_win_pct,
              tone: v.chasing_win_pct > 55 ? ("primary" as const) : ("muted" as const),
            }))}
          />
        </Block>

        <Block
          title="Can you predict the winner?"
          intro={`All models were trained on 2008–2022 and tested on ${ipl.test_seasons}, so they never saw the results they were judged on. Before the first ball, nothing beats a coin flip by much. Once a chase is under way, the live model gets it right most of the time.`}
        >
          <BarRows
            max={100}
            reference={50}
            rows={[
              ...Object.entries(ipl.prematch).map(([name, r]) => ({
                label: name,
                value: Math.round(r.accuracy * 1000) / 10,
                tone: (name.includes("regression") || name.includes("boosting") ? "primary" : "muted") as "primary" | "muted",
              })),
              ...Object.entries(live).map(([stage, r]) => ({
                label: `Live model, ${stage.toLowerCase()}`,
                value: Math.round(r.accuracy * 1000) / 10,
                tone: "accent" as const,
              })),
            ]}
          />
          <p className="mt-6 max-w-[62ch] leading-relaxed text-muted-foreground">
            The live model, trained only on the old era, underrated chasing teams after 2023. Retraining on seasons up to 2024
            with an Impact Player era flag lifted accuracy on {retrain.test_seasons} from{" "}
            {Math.round(retrain.trained_to_2022.accuracy * 100)}% to{" "}
            {Math.round(retrain.trained_to_2024_with_era_flag.accuracy * 100)}%. When the rules of the game change, the
            model has to be retrained too.
          </p>
        </Block>

        <Block title="Franchise records" intro="Win rate for franchises with at least 50 completed matches, 2008–2026.">
          <BarRows
            max={70}
            reference={50}
            rows={ipl.teams.map((t) => ({ label: t.team, note: `${t.matches} matches`, value: t.win_pct, tone: "primary" as const }))}
          />
        </Block>

        <section className="border-t pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">How it was built</h2>
          <ul className="mt-5 max-w-[66ch] list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
            <li>Parsed 1,243 Cricsheet match files (JSON) into three clean tables with Python, merging renamed teams and grounds.</li>
            <li>Answered six questions in SQL (SQLite): toss impact, chasing by season, scoring trends, phase run rates, grounds and franchise records.</li>
            <li>Built every pre-match feature only from earlier matches, so the model never sees the future.</li>
            <li>Compared logistic regression and gradient boosting against four simple baselines, using accuracy, log loss, Brier score and AUC.</li>
            <li>Checked calibration and retrained the live model when the Impact Player era made it underrate chasers.</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Data: Cricsheet ball-by-ball records via the IPL-DATASET repository (MIT licence). Tools: Python, pandas,
            scikit-learn, SQL.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <a href={CODE} target="_blank" rel="noreferrer">
              <Github /> View the code on GitHub
            </a>
          </Button>
        </section>
      </main>
    </>
  );
}
