import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#0c0b0a",
        border: "1.5px solid #f5a524",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "6px 7px",
        gap: 4,
      }}
    >
      <div
        style={{ width: 18, height: 2, background: "#f5a524", borderRadius: 1 }}
      />
      <div
        style={{
          width: 18,
          height: 1.5,
          background: "#f5a524",
          borderRadius: 1,
          opacity: 0.65,
        }}
      />
      <div
        style={{
          width: 11,
          height: 1.5,
          background: "#f5a524",
          borderRadius: 1,
          opacity: 0.4,
        }}
      />
    </div>,
    { ...size },
  );
}
