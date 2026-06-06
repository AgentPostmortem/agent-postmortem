import { Resend } from "resend";
import { getSiteUrl } from "@/lib/utils/urls";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@agentpostmortem.com";

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

const wrap = (inner: string) =>
  `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:8px;color:#111">${inner}</div>`;

export async function sendNewsletterWelcome(
  to: string,
  unsubToken: string,
): Promise<void> {
  const site = getSiteUrl();
  const unsub = `${site}/unsubscribe/${unsubToken}`;
  const html = wrap(`
    <h2 style="font-family:Georgia,serif;font-weight:normal">AgentPostmortem</h2>
    <p>Thanks for subscribing. You'll get a periodic digest of newly documented
    AI agent failures — real incidents, what went wrong, and the operational lessons.</p>
    <p><a href="${site}" style="color:#b91c1c">Browse the registry →</a></p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <p style="font-size:12px;color:#888">You can <a href="${unsub}" style="color:#888">unsubscribe</a> anytime.</p>
  `);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "You're subscribed to AgentPostmortem",
    html,
  });
  if (error) throw new Error(error.message);
}

export interface DigestCase {
  caseNumber: string;
  title: string;
  outcome: string;
}

export async function sendNewsletterDigest(
  to: string,
  unsubToken: string,
  cases: DigestCase[],
): Promise<void> {
  const site = getSiteUrl();
  const unsub = `${site}/unsubscribe/${unsubToken}`;
  const items = cases
    .map(
      (c) => `
    <div style="margin:0 0 18px;padding:0 0 18px;border-bottom:1px solid #f0f0f0">
      <a href="${site}/case/${c.caseNumber}" style="font-family:Georgia,serif;font-size:16px;color:#111;text-decoration:none">${escapeHtml(c.title)}</a>
      <div style="font-size:11px;color:#999;font-family:monospace;margin-top:2px">${escapeHtml(c.caseNumber)}</div>
      <p style="font-size:13px;color:#444;line-height:1.5;margin:6px 0 0">${escapeHtml(c.outcome.slice(0, 220))}…</p>
    </div>`,
    )
    .join("");
  const html = wrap(`
    <h2 style="font-family:Georgia,serif;font-weight:normal">New agent failures</h2>
    ${items}
    <p><a href="${site}" style="color:#b91c1c">See the full registry →</a></p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <p style="font-size:12px;color:#888"><a href="${unsub}" style="color:#888">Unsubscribe</a></p>
  `);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `AgentPostmortem — ${cases.length} new AI agent failure${cases.length === 1 ? "" : "s"}`,
    html,
  });
  if (error) throw new Error(error.message);
}
