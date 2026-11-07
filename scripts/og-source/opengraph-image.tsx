export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.hero.oneLiner.replace(/\*/g, "")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  // Dot grid motif, drawn as absolutely positioned dots.
  const dots = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 26; c++)
      dots.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: 60 + c * 42,
            top: 420 + r * 18,
            width: 5,
            height: 5,
            borderRadius: 5,
            background: r === 4 && c === 25 ? "#FF4D1A" : "rgba(14,14,14,0.22)",
          }}
        />,
      );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F4F2EE",
          color: "#0E0E0E",
          display: "flex",
          flexDirection: "column",
          padding: "56px 60px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#6B6B6B", letterSpacing: 1 }}>
          <span>EG</span>
          <span>FOUNDER · UC BERKELEY HAAS + DATA SCIENCE</span>
        </div>
        <div style={{ fontSize: 168, fontWeight: 700, letterSpacing: -8, marginTop: 40, lineHeight: 1 }}>EASON GAN</div>
        <div style={{ fontSize: 40, marginTop: 24, letterSpacing: -1, display: "flex" }}>
          I build products people show up for.
        </div>
        <div style={{ fontSize: 30, marginTop: 8, color: "#6B6B6B", display: "flex" }}>25,000+ users, zero ad spend.</div>
        {dots}
      </div>
    ),
    size,
  );
}
