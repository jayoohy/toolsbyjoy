import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          borderRadius: 6,
          fontFamily: "sans-serif",
          fontWeight: 600,
          letterSpacing: "-0.5px",
        }}
      >
        <span style={{ color: "#ffffff", fontSize: 14 }}>t</span>
        <span style={{ color: "#f97316", fontSize: 14 }}>b</span>
        <span style={{ color: "#ffffff", fontSize: 14 }}>j</span>
      </div>
    ),
    { ...size }
  );
}
