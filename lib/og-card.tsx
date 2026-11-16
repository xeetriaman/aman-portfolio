import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

type Card = { title: string; question: string; stat: string; statLabel: string };

/** Link-preview image for a project page: title, the question, and one headline number. */
export function projectCard({ title, question, stat, statLabel }: Card) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#fafbfd",
          color: "#10182a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: "#2f5ce0" }}>Data project</div>
          <div style={{ marginTop: 18, fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ marginTop: 22, fontSize: 30, color: "#4b5568" }}>{question}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 800, color: "#2f5ce0", lineHeight: 1 }}>{stat}</div>
            <div style={{ marginTop: 8, fontSize: 26, color: "#4b5568" }}>{statLabel}</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>Aman Chhetri · Interactive dashboard</div>
        </div>
      </div>
    ),
    ogSize
  );
}
