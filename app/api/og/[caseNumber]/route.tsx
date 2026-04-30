import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { SEVERITY_LABELS } from "@/lib/constants/severity";

export const runtime = "edge";

interface CaseData {
  caseNumber: string;
  title: string;
  agentName: string;
  company: string;
  damageLevel: number;
  estimatedCostUsd: number | null;
  outcome: string;
  tags: string[];
}

async function fetchCase(caseNumber: string): Promise<CaseData | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/posts?case_number=eq.${encodeURIComponent(caseNumber.toUpperCase())}&status=eq.approved&select=case_number,title,outcome,damage_level,estimated_cost_usd,agents(name,company),post_tags(tags(slug))&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows?.length) return null;
    const row = rows[0];
    return {
      caseNumber: row.case_number,
      title: row.title,
      agentName: row.agents?.name ?? "Unknown",
      company: row.agents?.company ?? "",
      damageLevel: row.damage_level,
      estimatedCostUsd: row.estimated_cost_usd ?? null,
      outcome: row.outcome ?? "",
      tags: (row.post_tags ?? [])
        .map((pt: { tags: { slug: string } | null }) => pt.tags?.slug)
        .filter(Boolean),
    };
  } catch {
    return null;
  }
}

async function loadFont(): Promise<ArrayBuffer> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentpostmortem.com";
  const res = await fetch(`${siteUrl}/fonts/Inter-SemiBold.ttf`);
  return res.arrayBuffer();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { caseNumber: string } },
) {
  const data = await fetchCase(params.caseNumber);
  if (!data) return new Response("Case not found", { status: 404 });

  const severityLabel = SEVERITY_LABELS[data.damageLevel as 1 | 2 | 3 | 4 | 5];
  const filledPips = data.damageLevel;
  const costFormatted = data.estimatedCostUsd
    ? data.estimatedCostUsd >= 1_000_000
      ? `$${(data.estimatedCostUsd / 1_000_000).toFixed(1)}M`
      : data.estimatedCostUsd >= 1_000
        ? `$${(data.estimatedCostUsd / 1_000).toFixed(0)}k`
        : `$${data.estimatedCostUsd}`
    : null;

  const fontData = await loadFont().catch(() => null);
  const fonts = fontData
    ? [{ name: "Inter", data: fontData, style: "normal" as const }]
    : [];

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0a0a0b",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#dc2626",
        }}
      />

      {/* Left rule */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "80px",
          bottom: 0,
          width: "1px",
          backgroundColor: "#1e1e22",
        }}
      />

      {/* Grid watermark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, #111113 59px, #111113 60px), repeating-linear-gradient(90deg, transparent, transparent 119px, #111113 119px, #111113 120px)",
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "56px 100px 48px 120px",
          flex: 1,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#444448",
                fontWeight: 600,
              }}
            >
              AgentPostmortem
            </span>
            <span
              style={{
                fontSize: "20px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#dc2626",
                fontWeight: 700,
              }}
            >
              {data.caseNumber}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "3px",
              backgroundColor: "#111113",
              border: "1px solid #222226",
              borderRadius: "6px",
              padding: "12px 20px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#444448",
                fontWeight: 600,
              }}
            >
              Subject Agent
            </span>
            <span
              style={{ fontSize: "22px", color: "#f0f0f0", fontWeight: 600 }}
            >
              {data.agentName}
            </span>
            <span style={{ fontSize: "12px", color: "#666668" }}>
              {data.company}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "36px",
            lineHeight: 1.25,
            color: "#f0f0f0",
            fontWeight: 600,
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: "900px",
          }}
        >
          {data.title.length > 90
            ? data.title.substring(0, 90) + "…"
            : data.title}
        </div>

        {/* Outcome */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#888",
            marginBottom: "36px",
            maxWidth: "820px",
          }}
        >
          {data.outcome.substring(0, 130)}
          {data.outcome.length > 130 ? "…" : ""}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Severity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#444448",
                fontWeight: 600,
              }}
            >
              Severity — {severityLabel}
            </span>
            <div style={{ display: "flex", gap: "5px" }}>
              {[1, 2, 3, 4, 5].map((pip) => (
                <div
                  key={pip}
                  style={{
                    width: "40px",
                    height: "8px",
                    borderRadius: "3px",
                    backgroundColor: pip <= filledPips ? "#dc2626" : "#1a1a1e",
                    border: `1px solid ${pip <= filledPips ? "#dc2626" : "#2a2a2e"}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cost */}
          {costFormatted && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#444448",
                  fontWeight: 600,
                }}
              >
                Est. Damage
              </span>
              <span
                style={{ fontSize: "32px", color: "#dc2626", fontWeight: 700 }}
              >
                {costFormatted}
              </span>
            </div>
          )}

          {/* Tags */}
          {data.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                maxWidth: "280px",
                justifyContent: "flex-end",
              }}
            >
              {data.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#888",
                    border: "1px solid #2a2a2e",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    backgroundColor: "#111113",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#1e1e22",
          marginLeft: "80px",
        }}
      />
      <div
        style={{
          padding: "14px 100px 14px 120px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#2a2a2e",
            fontWeight: 600,
          }}
        >
          agentpostmortem.com
        </span>
        <span
          style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#2a2a2e" }}
        >
          PUBLIC CASE FILE
        </span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}
