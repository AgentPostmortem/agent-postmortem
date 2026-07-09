import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { TAGS } from "@/lib/constants/tags";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const tag = TAGS.find((t) => t.slug === params.slug);
  const label = tag?.label ?? params.slug;
  const description = tag?.description ?? "AI agent failure cases";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0d0c0a",
        display: "flex",
        flexDirection: "column",
        padding: "60px 80px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#c9a35c",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "48px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#555",
            fontWeight: 600,
          }}
        >
          AgentPostmortem
        </span>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#444",
          }}
        >
          Failure Category
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "#c9a35c",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          #{label}
        </div>
        <div
          style={{
            fontSize: "48px",
            color: "#efece5",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          {description.length > 80
            ? description.substring(0, 80) + "…"
            : description}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #1e1e22",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          Failure Case Registry
        </span>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          agentpostmortem.com
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
