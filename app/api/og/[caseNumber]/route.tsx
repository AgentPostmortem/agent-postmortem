import { ImageResponse } from "@vercel/og";
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

// In production: fetch from Supabase
function getCaseData(caseNumber: string): CaseData {
  return {
    caseNumber: caseNumber.toUpperCase(),
    title:
      "Agent deleted production database after misreading schema migration",
    agentName: "Devin",
    company: "Cognition AI",
    damageLevel: 5,
    estimatedCostUsd: 85000,
    outcome:
      "Automated agent executed DROP TABLE on live database. Six hours of customer data lost.",
    tags: ["deleted-data", "code-disaster"],
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { caseNumber: string } },
) {
  const data = getCaseData(params.caseNumber);
  const severityLabel = SEVERITY_LABELS[data.damageLevel as 1 | 2 | 3 | 4 | 5];

  // Severity bar color segments
  const filledPips = data.damageLevel;

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0a0a0b",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red top accent stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "#dc2626",
        }}
      />

      {/* Left red vertical rule */}
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: "80px",
          bottom: "0",
          width: "1px",
          backgroundColor: "#222226",
        }}
      />

      {/* Watermark grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, #111113 59px, #111113 60px), repeating-linear-gradient(90deg, transparent, transparent 119px, #111113 119px, #111113 120px)",
          opacity: 0.4,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "52px 100px 52px 120px",
          flex: 1,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "36px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#5a5a5a",
              }}
            >
              AgentPostmortem
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "18px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#dc2626",
                fontWeight: "bold",
              }}
            >
              {data.caseNumber}
            </span>
          </div>

          {/* Agent badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#5a5a5a",
              }}
            >
              Agent
            </span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                color: "#f0f0f0",
              }}
            >
              {data.agentName}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#9a9a9a",
              }}
            >
              {data.company}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            lineHeight: "1.3",
            color: "#f0f0f0",
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: "860px",
          }}
        >
          {data.title}
        </div>

        {/* Outcome snippet */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: "1.5",
            color: "#9a9a9a",
            marginBottom: "32px",
            maxWidth: "800px",
            display: "-webkit-box",
            overflow: "hidden",
          }}
        >
          {data.outcome.substring(0, 120)}
          {data.outcome.length > 120 ? "…" : ""}
        </div>

        {/* Bottom row: severity + cost */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Severity pips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#5a5a5a",
              }}
            >
              Severity — {severityLabel}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((pip) => (
                <div
                  key={pip}
                  style={{
                    width: "36px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: pip <= filledPips ? "#dc2626" : "#1a1a1e",
                    border: `1px solid ${pip <= filledPips ? "#dc2626" : "#222226"}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cost estimate */}
          {data.estimatedCostUsd && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#5a5a5a",
                }}
              >
                Estimated Damages
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "28px",
                  color: "#dc2626",
                  fontWeight: "bold",
                }}
              >
                ${data.estimatedCostUsd.toLocaleString()}
              </span>
            </div>
          )}

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              maxWidth: "300px",
              justifyContent: "flex-end",
            }}
          >
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9a9a9a",
                  border: "1px solid #222226",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  backgroundColor: "#111113",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#222226",
          marginLeft: "80px",
          marginRight: "0",
        }}
      />
      <div
        style={{
          padding: "12px 100px 12px 120px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#333338",
          }}
        >
          agentpostmortem.com
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "#333338",
          }}
        >
          PUBLIC CASE FILE
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
