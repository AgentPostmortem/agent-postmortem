import { Resend } from "resend";
import { getSiteUrl } from "@/lib/utils/urls";

const resend = new Resend(process.env.RESEND_API_KEY);
// Newsletter sends from a friendly, on-brand address (override via env if needed).
const FROM =
  process.env.RESEND_NEWSLETTER_FROM ??
  "AgentPostmortem <cases@agentpostmortem.com>";

function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as Record<string, string>
      )[c],
  );
}

function fmtDate(d?: string): string {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(d));
  } catch {
    return "";
  }
}

const SEVERITY: Record<number, { label: string; color: string }> = {
  1: { label: "MINIMAL", color: "#6b7280" },
  2: { label: "LOW", color: "#6b7280" },
  3: { label: "MODERATE", color: "#b45309" },
  4: { label: "SEVERE", color: "#b91c1c" },
  5: { label: "CRITICAL", color: "#991b1b" },
};

// Shared shell: dark masthead, light body, brand footer with disclaimer.
function shell(inner: string, unsubUrl: string): string {
  const site = getSiteUrl();
  return `
  <div style="background:#f4f4f2;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7e7e3;border-radius:10px;overflow:hidden">
      <div style="background:#0e0e12;padding:20px 28px">
        <a href="${site}" style="text-decoration:none;color:#fff;font-weight:700;font-size:16px;letter-spacing:.3px">
          <span style="display:inline-block;width:8px;height:8px;background:#e5484d;border-radius:2px;margin-right:8px;vertical-align:middle"></span>AgentPostmortem
        </a>
        <div style="color:#8a8a93;font-size:11px;margin-top:4px">A registry of real AI agent failures.</div>
      </div>
      <div style="padding:28px">${inner}</div>
      <div style="border-top:1px solid #eee;padding:18px 28px;background:#fafafa">
        <p style="font-size:11px;line-height:1.6;color:#999;margin:0">
          Independent project — not affiliated with or endorsed by any company named.
          Cases are aggregated from public reports and may be unverified.
        </p>
        <p style="font-size:11px;color:#999;margin:8px 0 0">
          <a href="${unsubUrl}" style="color:#999">Unsubscribe</a> ·
          <a href="${site}" style="color:#999">agentpostmortem.com</a>
        </p>
      </div>
    </div>
  </div>`;
}

export async function sendNewsletterWelcome(
  to: string,
  unsubToken: string,
): Promise<void> {
  const site = getSiteUrl();
  const unsub = `${site}/unsubscribe/${unsubToken}`;
  const inner = `
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:22px;color:#111;margin:0 0 12px">
      You're on the list.
    </h1>
    <p style="font-size:14px;line-height:1.6;color:#444;margin:0 0 16px">
      You'll get a periodic digest of newly documented AI agent failures — real
      incidents, what actually went wrong, and the operational lessons for teams
      shipping AI agents.
    </p>
    <a href="${site}" style="display:inline-block;background:#e5484d;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:6px">
      Browse the registry →
    </a>`;
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "You're subscribed to AgentPostmortem",
    html: shell(inner, unsub),
  });
  if (error) throw new Error(error.message);
}

export interface DigestCase {
  caseNumber: string;
  title: string;
  outcome: string;
  damageLevel?: number;
  agentName?: string;
  date?: string;
}

export async function sendNewsletterDigest(
  to: string,
  unsubToken: string,
  cases: DigestCase[],
): Promise<void> {
  const site = getSiteUrl();
  const unsub = `${site}/unsubscribe/${unsubToken}`;
  const cards = cases
    .map((c) => {
      const sev = SEVERITY[c.damageLevel ?? 0];
      const badge = sev
        ? `<span style="display:inline-block;font-size:9px;font-weight:700;letter-spacing:.5px;color:#fff;background:${sev.color};padding:2px 6px;border-radius:3px">${sev.label}</span>`
        : "";
      const meta = [c.caseNumber, c.agentName, fmtDate(c.date)]
        .filter((x): x is string => Boolean(x))
        .map((x) => escapeHtml(x))
        .join(" · ");
      return `
      <div style="padding:16px 0;border-bottom:1px solid #f0f0f0">
        <div style="margin-bottom:6px">${badge}</div>
        <a href="${site}/case/${escapeHtml(c.caseNumber)}" style="font-family:Georgia,serif;font-size:16px;line-height:1.35;color:#111;text-decoration:none">${escapeHtml(c.title)}</a>
        <div style="font-size:11px;color:#999;font-family:ui-monospace,monospace;margin-top:4px">${meta}</div>
        <p style="font-size:13px;line-height:1.55;color:#555;margin:8px 0 0">${escapeHtml(c.outcome.slice(0, 200))}…</p>
        <a href="${site}/case/${escapeHtml(c.caseNumber)}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#e5484d;text-decoration:none">Read the case →</a>
      </div>`;
    })
    .join("");
  const inner = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;color:#111;margin:0 0 6px">
      ${cases.length} new agent failure${cases.length === 1 ? "" : "s"}
    </h1>
    <p style="font-size:13px;color:#777;margin:0 0 8px">Recently documented incidents from the registry.</p>
    ${cards}
    <div style="text-align:center;margin-top:24px">
      <a href="${site}" style="display:inline-block;background:#0e0e12;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:6px">
        See the full registry →
      </a>
    </div>`;
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `AgentPostmortem — ${cases.length} new AI agent failure${cases.length === 1 ? "" : "s"}`,
    html: shell(inner, unsub),
  });
  if (error) throw new Error(error.message);
}
