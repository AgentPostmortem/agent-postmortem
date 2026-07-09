import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#0d0c0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          background: "#0d0c0a",
          border: "6px solid #c9a35c",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "28px 30px",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 8,
            background: "#c9a35c",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 80,
            height: 6,
            background: "#c9a35c",
            borderRadius: 4,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            width: 50,
            height: 6,
            background: "#c9a35c",
            borderRadius: 4,
            opacity: 0.4,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
