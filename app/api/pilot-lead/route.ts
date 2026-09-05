import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { hashIp, getClientIp } from "@/lib/utils/hash";
import { logEvent } from "@/lib/observability/events";
import { consumeSharedRateLimit } from "@/lib/rate-limit/shared";
import {
  firstPilotError,
  validatePilot,
  type PilotErrors,
} from "@/lib/pilot/validation";

const WINDOW_SECONDS = 60 * 60;
const MAX_REQUESTS = 5;

const TRACK_LABELS = {
  support: "Support triage",
  portal: "Portal ops",
  unsure: "Not sure yet",
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function invalid(errors: PilotErrors) {
  return NextResponse.json(
    { errors, error: firstPilotError(errors) },
    { status: 400 },
  );
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill it, humans never see it. Answer success without
  // doing anything so the bot learns nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    logEvent({ event: "pilot-lead.honeypot", level: "warn" });
    return NextResponse.json({
      ok: true,
      message: "Application received. Expect a reply within a day.",
    });
  }

  const ipHash = hashIp(getClientIp(req.headers));

  let rateLimit;
  try {
    rateLimit = await consumeSharedRateLimit(
      `pilot-lead:${ipHash}`,
      WINDOW_SECONDS,
      MAX_REQUESTS,
    );
  } catch (err) {
    console.error("[pilot-lead] rate limit check failed:", err);
    return NextResponse.json(
      { error: "Could not process the application. Try again later." },
      { status: 500 },
    );
  }

  if (!rateLimit.allowed) {
    logEvent({ event: "pilot-lead.rate_limited", level: "warn", ipHash });
    return NextResponse.json(
      { error: "Too many applications from this address. Try again later." },
      { status: 429 },
    );
  }

  const result = validatePilot(body);
  if (!result.ok) return invalid(result.errors);

  const { name, email, company, track, workflow } = result.data;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[pilot-lead] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Could not process the application. Try again later." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@agentpostmortem.com",
    to: "hello@agentpostmortem.com",
    replyTo: email,
    subject: `Pilot application: ${name}`,
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : "",
      `<p><strong>Track:</strong> ${TRACK_LABELS[track]}</p>`,
      `<p><strong>Workflow:</strong></p>`,
      `<p>${escapeHtml(workflow).replace(/\n/g, "<br>")}</p>`,
    ].join("\n"),
  });

  if (error) {
    console.error("[pilot-lead] notify failed:", error);
    return NextResponse.json(
      { error: "Could not process the application. Try again later." },
      { status: 500 },
    );
  }

  logEvent({ event: "pilot-lead.received", level: "info", ipHash });
  return NextResponse.json({
    ok: true,
    message: "Application received. Expect a reply within a day.",
  });
}
