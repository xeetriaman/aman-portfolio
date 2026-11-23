import type { Metadata } from "next";
import { Github } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BarRows } from "@/components/charts/bar-rows";
import { IndustryGapExplorer } from "@/components/charts/industry-gap-explorer";
import { StatRow, type Stat } from "@/components/stat-row";
import data from "@/data/promotion-gap.json";

const DESCRIPTION =
  "WGEA 2024–25 data for 8,115 Australian employers: how often women and men are promoted into management and resign, pooled and compared within the same employer.";

export const metadata: Metadata = {
  title: "Women's Promotion Gap in Australian Workplaces, 2024–25 | Aman Chhetri",
  description: DESCRIPTION,
  openGraph: { title: "Women's Promotion Gap in Australian Workplaces, 2024–25", description: DESCRIPTION, type: "article" },
};

const CODE = "https://github.com/xeetriaman/data-projects/tree/main/women-promotion-gap";

function Block({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-12">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Colour an industry by whether its same-employer interval sits wholly below, wholly above, or across 1. */
function tone([low, high]: number[]) {
  if (high < 1) return "accent" as const;
  if (low > 1) return "primary" as const;
  return "muted" as const;
}

export default function PromotionGapPage() {
  const { overall, industries, ratios } = data;
  const share = overall.share;
  const finance = industries.find((i) => i.industry === "Financial and Insurance Services")!;
  const fullTime = (gender: string) => data.by_hours.find((h) => h.employment_status === "Full-time" && h.gender === gender)!;

  const stats: Stat[] = [
    { value: share.managers, suffix: "%", decimals: 1, label: `of managers are women, against ${share.non_managers}% of non-managers` },
    { value: overall.promotion.pooled, decimals: 2, label: "women promoted for every man, pooled across all employers" },
    { value: overall.promotion.same_employer, decimals: 3, label: "women for every man at the same employer" },
    { value: finance.promotion.same_employer, decimals: 2, label: "women for every man at the same employer in finance and insurance" },
  ];

  const compare = (kind: "promotion_to_manager" | "resignation") => [
    { label: "Pooled", value: ratios[kind].crude, tone: "muted" as const },
    { label: "Same industry", value: ratios[kind].same_industry, tone: "primary" as const },
    { label: "Same employer", value: ratios[kind].same_employer, tone: "accent" as const },
  ];

  return (
    <>
      <SiteHeader />
      <main className="container pb-20 pt-12 sm:pt-16">
        <a href="/#projects" className="text-sm font-semibold text-primary hover:underline">
          Back to projects
        </a>
        <h1 className="mt-4 max-w-[22ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          Are women promoted into management as often as men?
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          The Workplace Gender Equality Agency&apos;s 2024–25 data covers {data.employers.toLocaleString()} Australian employers and{" "}
          {(data.employees / 1e6).toFixed(2)} million staff. I compared how often women and men move into management and how
          often they resign, first across everyone, then only against men at the same employer.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#explore">Explore by industry</a>
          </Button>
          <Button asChild variant="outline">
            <a href={CODE} target="_blank" rel="noreferrer">
              <Github /> View code and SQL
            </a>
          </Button>
        </div>

        <StatRow stats={stats} />

        <section id="explore" className="mt-12 scroll-mt-24 rounded-lg border bg-secondary/50 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Pick an industry</h2>
          <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">
            A ratio of 1.00 means women and men were promoted at the same rate; 0.80 means women were promoted at four-fifths
            the rate of men. The same-employer figure only compares people who work for the same organisation.
          </p>
          <div className="mt-8">
            <IndustryGapExplorer rows={[overall, ...industries]} />
          </div>
        </section>

        <Block
          title="Women thin out on the way up"
          intro={`Across all employers women are ${share.non_managers}% of non-managers, ${share.promotions_to_manager}% of people promoted into management during the year, and ${share.managers}% of managers.`}
        >
          <BarRows
            max={100}
            rows={[
              { label: "Non-managers", value: share.non_managers, tone: "muted" },
              { label: "Promoted into management", value: share.promotions_to_manager, tone: "primary" },
              { label: "Managers", value: share.managers, tone: "accent" },
            ]}
          />
        </Block>

        <Block
          title="Comparing like with like shrinks the gap"
          intro="Most of the pooled gap comes from where women work. Health care and education employ many women and promote few non-managers into management for anyone. Inside the same employer the promotion gap is too small to tell apart from none, and the resignation gap nearly disappears."
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-bold">Promotion into management, women to men</h3>
              <BarRows max={1.4} unit="" decimals={3} reference={1} rows={compare("promotion_to_manager")} />
            </div>
            <div>
              <h3 className="mb-4 font-bold">Resignation, women to men</h3>
              <BarRows max={1.4} unit="" decimals={3} reference={1} rows={compare("resignation")} />
            </div>
          </div>
        </Block>

        <Block
          title="Where a gap remains inside the same workplace"
          intro="Same-employer promotion ratio for each industry; the dashed line is no gap. Marigold bars have a 95% interval wholly below 1, blue bars wholly above 1, and grey bars cannot be told apart from no gap."
        >
          <BarRows
            max={1.8}
            unit=""
            decimals={2}
            reference={1}
            rows={industries.map((i) => ({ label: i.industry, value: i.promotion.same_employer, tone: tone(i.promotion.ci95) }))}
          />
        </Block>

        <section className="border-t pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">How it was built</h2>
          <ul className="mt-5 max-w-[66ch] list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
            <li>
              Joined two files from the WGEA public data release, workforce headcount and promotions and resignations, into one
              table per employer, level, employment status and gender.
            </li>
            <li>Answered three questions in SQL (SQLite): women&apos;s share at each level, promotion by hours, and resignation gaps ranked with window functions.</li>
            <li>
              Divided promotions into management by the number of non-managers, the pool they come from, so an industry does not
              look better just because it employs more women.
            </li>
            <li>
              Compared women with men inside each employer and industry using the Mantel-Haenszel ratio, with 95% intervals from
              resampling whole employers 1,000 times.
            </li>
            <li>Unit tests check the ratio on hand-worked examples and that adjustment removes a gap caused only by where people work.</li>
          </ul>
          <p className="mt-6 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
            Limits: WGEA covers employers with 100 or more staff and reports women and men only. Promotions are recorded under
            the hours of the new role, which is why full-time women appear to be promoted at {fullTime("Women").per_100} per 100
            against {fullTime("Men").per_100} for full-time men, so the main results do not split by hours. This shows whether a
            gap exists, not why.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Data: Workplace Gender Equality Agency, WGEA Dataset 2025 (1 April 2024 to 31 March 2025), data.gov.au (CC BY 4.0).
            Tools: Python, pandas, NumPy, SQL, pytest.
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
