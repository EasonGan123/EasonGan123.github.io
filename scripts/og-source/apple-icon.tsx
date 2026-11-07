export const dynamic = "force-static";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E0E",
          color: "#F4F2EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -5,
          position: "relative",
        }}
      >
        EG
        <div style={{ position: "absolute", right: 30, bottom: 30, width: 18, height: 18, borderRadius: 18, background: "#FF4D1A" }} />
      </div>
    ),
    size,
  );
}
