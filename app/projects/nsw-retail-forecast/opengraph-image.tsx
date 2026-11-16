import { ogSize, projectCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NSW Retail Sales Forecast, 2010–2025";

export default function Image() {
  return projectCard({ title: "NSW Retail Sales Forecast, 2010–2025", question: "Can NSW retail sales be forecast a year ahead?", stat: "3.73%", statLabel: "forecast error, against 6.41% for the baseline" });
}
