import { ogSize, projectCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Sydney House Price Model, 2018";

export default function Image() {
  return projectCard({ title: "Sydney House Price Model, 2018", question: "What sets the price of a Sydney house?", stat: "37,910", statLabel: "Sydney house sales analysed in Python and SQL" });
}
