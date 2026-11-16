import type { Metadata } from "next";
import { Github } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BarRows } from "@/components/charts/bar-rows";
import { LineChart } from "@/components/charts/line-chart";
import { PriceGame } from "@/components/charts/price-game";
import { SuburbExplorer } from "@/components/charts/suburb-explorer";
import { StatRow, type Stat } from "@/components/stat-row";
import data from "@/data/house-prices.json";

export const metadata: Metadata = {
  title: "Sydney House Price Model, 2018 | Aman Chhetri",
  description:
    "37,910 Sydney house sales from NSW Valuer General records: the 2018 price fall, what land costs by suburb and zoning, and a price model tested on later sales.",
  openGraph: { title: "Sydney House Price Model, 2018", description: "37,910 Sydney house sales from NSW Valuer General records: the 2018 price fall, what land costs by suburb and zoning, and a price model tested on later sales.", type: "article" },
};

const CODE = "https://github.com/xeetriaman/data-projects/tree/main/sydney-house-prices";

function Block({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-12">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function HousePricesPage() {
  const q = data.quarters;
  const fall = Math.round((1 - q[q.length - 1].median_price / q[0].median_price) * 100);
  const models = Object.entries(data.metrics.models);
  const best = data.metrics.models["Gradient boosting"];
  const top = data.extremes.filter((e) => e.band === "Top 10");
  const bottom = data.extremes.filter((e) => e.band !== "Top 10");

  const stats: Stat[] = [
    { value: data.summary.sales, label: `house sales kept from ${data.summary.raw_records.toLocaleString()} raw records` },
    { value: fall, suffix: "%", label: "fall in the median price, January to December 2018" },
    { value: Math.round(top[0].avg_price_per_sqm), prefix: "$", label: `per m² of land in ${top[0].suburb}, the dearest suburb` },
    { value: best.median_abs_pct_error, suffix: "%", decimals: 1, label: "typical error of the best model on later sales" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="container pb-20 pt-12 sm:pt-16">
        <a href="/#projects" className="text-sm font-semibold text-primary hover:underline">
          Back to projects
        </a>
        <h1 className="mt-4 max-w-[20ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          What sets the price of a Sydney house?
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          Every house sale the NSW Valuer General recorded in 2018. I cleaned the records with Python, asked the questions in
          SQL, and tested price models on sales made after the training period, in a market that was falling.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#game">Guess a price</a>
          </Button>
          <Button asChild variant="outline">
            <a href={CODE} target="_blank" rel="noreferrer">
              <Github /> View code and SQL
            </a>
          </Button>
        </div>

        <StatRow stats={stats} />

        <section id="game" className="mt-12 scroll-mt-24 rounded-lg border bg-secondary/50 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Can you beat the model?</h2>
          <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">
            A real house sold between July and December 2018. You get the suburb and land size, the same facts the model had.
          </p>
          <div className="mt-8">
            <PriceGame sales={data.game} />
          </div>
        </section>

        <Block
          title="Prices fell all through 2018"
          intro={`The median house sold for $${(q[0].median_price / 1e6).toFixed(2)}m in the first quarter and $${(
            q[q.length - 1].median_price / 1e6
          ).toFixed(2)}m in the last, a ${fall}% drop in nine months.`}
        >
          <LineChart
            title="Median Sydney house price by quarter, 2018, in thousands of dollars"
            labels={q.map((r) => r.quarter.replace("2018-", ""))}
            series={[{ name: "Median price", values: q.map((r) => r.median_price / 1000), tone: "primary" }]}
            min={850}
            max={1100}
            step={50}
            unit="k"
            everyLabel
          />
        </Block>

        <Block
          title="Look up any suburb"
          intro={`Median house price, land value and block size for the ${data.suburbs.length} suburbs with at least 10 house sales in the data.`}
        >
          <SuburbExplorer suburbs={data.suburbs} sydneyMedian={data.summary.sydney_median} start="Hurstville" />
        </Block>

        <Block
          title="Location is most of the price"
          intro="Average price per square metre of land. The ten dearest suburbs sit around the harbour and the inner east; the cheapest are on the Blue Mountains and south-western fringe."
        >
          <div className="grid gap-10 md:grid-cols-2">
            {[
              { title: "Most expensive land", rows: top, tone: "primary" as const },
              { title: "Least expensive land", rows: bottom, tone: "muted" as const },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-bold">{group.title}</h3>
                <BarRows
                  prefix="$"
                  unit=""
                  max={Math.max(...group.rows.map((r) => r.avg_price_per_sqm)) * 1.15}
                  rows={group.rows.map((r) => ({ label: r.suburb, note: `${r.sales} sales`, value: Math.round(r.avg_price_per_sqm), tone: group.tone }))}
                />
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="Zoning changes what land is worth"
          intro="Average price per square metre by planning zone. Denser zones tend to sit closer to the city and allow more to be built on the same block."
        >
          <BarRows
            prefix="$"
            unit=""
            max={10000}
            rows={data.zoning
              .filter((z) => z.zoning !== "Unknown")
              .map((z) => ({ label: z.zoning, note: `${z.sales.toLocaleString()} sales`, value: Math.round(z.avg_price_per_sqm), tone: "primary" as const }))}
          />
        </Block>

        <Block
          title="The model beats the baseline, but not by much"
          intro={`Trained on ${data.metrics.train_sales.toLocaleString()} sales before July 2018 and tested on ${data.metrics.test_sales.toLocaleString()} later ones. Lower is better. Suburb, land size and zoning cannot see bedrooms, condition or views, which caps any model built on this data.`}
        >
          <BarRows
            max={16}
            rows={models.map(([name, m]) => ({
              label: name,
              note: `${m.within_10_pct}% within 10%`,
              value: m.median_abs_pct_error,
              tone: name.startsWith("Baseline") ? ("muted" as const) : ("primary" as const),
            }))}
          />
          <p className="mt-6 max-w-[62ch] leading-relaxed text-muted-foreground">
            A falling market fools models trained on the past. Gradient boosting over-predicted later sales by{" "}
            {Math.round((best.median_predicted_to_actual - 1) * 100)}% on a typical house. Linear regression, which can extend a
            time trend, was off by only{" "}
            {((data.metrics.models["Linear regression"].median_predicted_to_actual - 1) * 100).toFixed(1)}%.
          </p>
        </Block>

        <section className="border-t pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">How it was built</h2>
          <ul className="mt-5 max-w-[66ch] list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
            <li>
              Kept whole-property, arm&apos;s-length house sales in Greater Sydney with a plausible price and land size, dropping
              units, part shares and duplicates: {data.summary.raw_records.toLocaleString()} records down to{" "}
              {data.summary.sales.toLocaleString()}.
            </li>
            <li>Answered three questions in SQL (SQLite): median price by quarter, dearest and cheapest suburbs, and price by zoning.</li>
            <li>Split by date, not at random, so every model is tested on sales later than anything it learned from.</li>
            <li>Learned each suburb&apos;s price level from training sales only, with unit tests that check no test price leaks in.</li>
            <li>Compared linear regression and gradient boosting against a suburb-median baseline.</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Data: NSW Valuer General Property Sales Information, 2018 settlements (CC BY 4.0). Tools: Python, pandas,
            scikit-learn, SQL, pytest.
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
