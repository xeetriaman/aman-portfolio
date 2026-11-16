import type { Metadata } from "next";
import { Github } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BarRows } from "@/components/charts/bar-rows";
import { ForecastExplorer } from "@/components/charts/forecast-explorer";
import { LineChart } from "@/components/charts/line-chart";
import { StatRow, type Stat } from "@/components/stat-row";
import data from "@/data/nsw-retail.json";

export const metadata: Metadata = {
  title: "NSW Retail Sales Forecast, 2010–2025 | Aman Chhetri",
  description:
    "ABS monthly retail turnover for NSW by store type: growth, the Christmas peak, the 2021 lockdown, and a Holt-Winters forecast backtested over three years against a simple baseline.",
  openGraph: { title: "NSW Retail Sales Forecast, 2010–2025", description: "ABS monthly retail turnover for NSW by store type: growth, the Christmas peak, the 2021 lockdown, and a Holt-Winters forecast backtested over three years against a simple baseline.", type: "article" },
};

const CODE = "https://github.com/xeetriaman/data-projects/tree/main/nsw-retail-forecast";
const FY = (year: number) => `${year - 1}–${String(year).slice(2)}`;

function Block({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-12">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function NswRetailPage() {
  const { metrics, years } = data;
  const latest = years[years.length - 1];
  const total = metrics.by_industry["Total retail"];
  const storeTypes = Object.keys(metrics.by_industry).length - 1;
  const testYears = Object.entries(metrics.by_test_year);
  const dept = data.christmas.find((c) => c.industry === "Department stores")!;

  const stats: Stat[] = [
    { value: latest.turnover_bn, prefix: "$", suffix: "bn", decimals: 1, label: `NSW retail turnover in ${FY(latest.year)}` },
    { value: total.holt_winters, suffix: "%", decimals: 2, label: "forecast error for total retail, a year ahead" },
    { value: metrics.groups_where_holt_winters_wins, suffix: ` of ${storeTypes}`, label: "store types where the model beat the baseline" },
    { value: dept.december_lift_pct, suffix: "%", decimals: 1, label: "December lift for department stores over an average month" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="container pb-20 pt-12 sm:pt-16">
        <a href="/#projects" className="text-sm font-semibold text-primary hover:underline">
          Back to projects
        </a>
        <h1 className="mt-4 max-w-[22ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          Can NSW retail sales be forecast a year ahead?
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          Fifteen years of ABS monthly turnover for NSW shops, split by store type. I asked three questions in SQL, then tested
          a Holt-Winters forecast over three financial years against the rule a shop manager would use: same month last year.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#explore">Compare the forecasts</a>
          </Button>
          <Button asChild variant="outline">
            <a href={CODE} target="_blank" rel="noreferrer">
              <Github /> View code and SQL
            </a>
          </Button>
        </div>

        <StatRow stats={stats} />

        <section id="explore" className="mt-12 scroll-mt-24 rounded-lg border bg-secondary/50 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Forecast against reality, 2024–25</h2>
          <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">
            Both forecasts were made in June 2024, before any of these months happened. Pick a store type to see how close each
            one came. Errors are averaged over all three test years.
          </p>
          <div className="mt-8">
            <ForecastExplorer forecasts={data.forecasts} errors={metrics.by_industry} />
          </div>
        </section>

        <Block
          title="Growth has slowed to a crawl"
          intro={`NSW shops took $${latest.turnover_bn.toFixed(1)} billion in ${FY(latest.year)}, up ${latest.growth_pct}% on the year before, after an 11.0% jump in 2022–23 as spending bounced back from lockdowns.`}
        >
          <LineChart
            title="NSW retail turnover by financial year, in billions of dollars"
            labels={years.map((y) => FY(y.year))}
            series={[{ name: "Turnover", values: years.map((y) => y.turnover_bn), tone: "primary" }]}
            min={100}
            max={140}
            step={10}
            unit="bn"
            everyLabel
          />
        </Block>

        <Block
          title="Christmas matters most to department stores"
          intro="December 2024 turnover against an average month that year. Gift shopping drives department stores and clothing; food and cafes barely move."
        >
          <BarRows
            max={80}
            rows={data.christmas.map((c) => ({
              label: c.industry,
              value: c.december_lift_pct,
              tone: c.industry === "Total retail" ? ("accent" as const) : ("primary" as const),
            }))}
          />
        </Block>

        <Block
          title="Lockdown moved spending, it did not stop it"
          intro="August 2021, during Sydney's Delta lockdown, against August 2019. Department stores lost half their takings while food and other retailing grew, so total retail fell only 3.8%."
        >
          <div className="grid gap-10 md:grid-cols-2">
            {[
              { title: "Lost the most", rows: data.lockdown.filter((r) => r.change_pct < 0), tone: "muted" as const },
              { title: "Held up or grew", rows: data.lockdown.filter((r) => r.change_pct >= 0), tone: "primary" as const },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-bold">{group.title}</h3>
                <BarRows
                  max={60}
                  rows={group.rows.map((r) => ({
                    label: r.industry,
                    value: Math.abs(r.change_pct),
                    note: r.change_pct < 0 ? "down" : "up",
                    tone: group.tone,
                  }))}
                />
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="The model wins when last year was unusual"
          intro="Average forecast error by test year, lower is better. In 2022–23 copying the lockdown-hit year before was badly wrong. In a normal year the simple baseline is almost as good."
        >
          <div className="grid gap-10 md:grid-cols-3">
            {testYears.map(([year, e]) => (
              <div key={year}>
                <h3 className="mb-4 font-bold">{FY(Number(year.slice(2)))}</h3>
                <BarRows
                  max={15}
                  rows={[
                    { label: "Holt-Winters", value: e.holt_winters, tone: "accent" as const },
                    { label: "Last year", value: e.seasonal_naive, tone: "muted" as const },
                  ]}
                />
              </div>
            ))}
          </div>
        </Block>

        <section className="border-t pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">How it was built</h2>
          <ul className="mt-5 max-w-[66ch] list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
            <li>Downloaded monthly NSW turnover for total retail and six store types from the ABS Data API, January 2010 to June 2025.</li>
            <li>Answered three questions in SQL (SQLite): yearly growth with window functions, the December peak, and the lockdown change.</li>
            <li>
              Backtested over three financial years: each forecast trains only on months before its test year, so no future data
              leaks in.
            </li>
            <li>Holt-Winters with a damped trend and multiplicative yearly seasonality, scored by mean absolute percentage error.</li>
            <li>Unit tests check the error measure, the baseline, and that test months always come after training months.</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Data: Australian Bureau of Statistics, Retail Trade, Australia (CC BY 4.0). Current prices, original series, so part of
            the growth is inflation. Tools: Python, pandas, statsmodels, SQL, pytest.
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
