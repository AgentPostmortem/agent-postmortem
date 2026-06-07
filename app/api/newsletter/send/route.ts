import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendNewsletterDigest, type DigestCase } from "@/lib/resend/newsletter";

function checkAdminAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && auth === expected;
}

// POST /api/newsletter/send?count=10
// Sends a digest of the most recently added cases to all active subscribers.
// Trigger manually or from an n8n weekly schedule (with the x-admin-password header).
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const count = Math.min(20, Math.max(1, parseInt(searchParams.get("count") ?? "8")));

  const supabase = createSupabaseAdminClient();

  const { data: cases } = await supabase
    .from("posts")
    .select("case_number, title, outcome, damage_level, created_at, agents(name)")
    .eq("status", "approved")
    .not("case_number", "is", null)
    .order("case_number", { ascending: false })
    .limit(count);

  if (!cases || cases.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no cases" });
  }

  const digestCases: DigestCase[] = cases.map((c) => {
    const agent = c.agents as { name?: string } | { name?: string }[] | null;
    const agentName = Array.isArray(agent) ? agent[0]?.name : agent?.name;
    return {
      caseNumber: c.case_number,
      title: c.title,
      outcome: c.outcome,
      damageLevel: c.damage_level ?? undefined,
      agentName: agentName ?? undefined,
      date: c.created_at ?? undefined,
    };
  });

  const { data: subs } = await supabase
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("status", "active");

  let sent = 0;
  let failed = 0;
  for (const s of subs ?? []) {
    try {
      await sendNewsletterDigest(s.email, s.unsubscribe_token, digestCases);
      sent++;
    } catch (e) {
      failed++;
      console.error("[newsletter] digest send failed:", e);
    }
  }

  return NextResponse.json({ ok: true, sent, failed, cases: cases.length });
}
