export const dynamic = "force-static";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -2,
          borderRadius: 14,
          position: "relative",
        }}
      >
        EG
        <div style={{ position: "absolute", right: 10, bottom: 10, width: 8, height: 8, borderRadius: 8, background: "#FF4D1A" }} />
      </div>
    ),
    size,
  );
}
