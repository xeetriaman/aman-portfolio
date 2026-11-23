import { ogSize, projectCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Women's Promotion Gap in Australian Workplaces, 2024–25";

export default function Image() {
  return projectCard({ title: "Women's Promotion Gap in Australian Workplaces, 2024–25", question: "Are women promoted into management as often as men?", stat: "0.975", statLabel: "women promoted for every man at the same employer" });
}
