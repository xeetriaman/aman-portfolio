import { ogSize, projectCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "IPL Match Analytics, 2008–2026";

export default function Image() {
  return projectCard({ title: "IPL Match Analytics, 2008–2026", question: "What decides a T20 match?", stat: "1,243", statLabel: "IPL matches analysed ball by ball" });
}
