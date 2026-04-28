import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitSchema } from "@/lib/schemas/submit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEditTokenEmail } from "@/lib/resend/send";
import { hashIp, getClientIp } from "@/lib/utils/hash";
import { redactPii } from "@/lib/utils/pii";
import { randomBytes, createHash } from "crypto";

// Rate limit: 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 3;

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ipHash);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_SUBMISSIONS) return true;
  entry.count++;
  return false;
}

const bodySchema = submitSchema.extend({
  screenshotUrls: z.array(z.string().url()).max(5).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions. You can submit up to 3 cases per hour." },
        { status: 429 }
      );
    }

    const body: unknown = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createSupabaseAdminClient();

    // Resolve agent_id from slug
    const { data: agent, error: agentErr } = await supabase
      .from("agents")
      .select("id")
      .eq("slug", data.agentSlug)
      .single();

    if (agentErr || !agent) {
      return NextResponse.json({ error: "Unknown agent." }, { status: 400 });
    }

    // Resolve tag IDs
    const { data: tags, error: tagsErr } = await supabase
      .from("tags")
      .select("id, slug")
      .in("slug", data.tags);

    if (tagsErr) {
      return NextResponse.json({ error: "Failed to resolve tags." }, { status: 500 });
    }

    // Redact PII from user-submitted text
    const cleanTitle = redactPii(data.title);
    const cleanOutcome = redactPii(data.outcome);
    const cleanPrompt = data.prompt ? redactPii(data.prompt) : null;
    const cleanHandle = data.authorHandle ? redactPii(data.authorHandle) : null;

    // Generate edit token — raw token sent to user, hash stored in DB
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    // Insert post (status = pending, goes to moderation queue)
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .insert({
        agent_id: agent.id,
        title: cleanTitle,
        prompt: cleanPrompt,
        outcome: cleanOutcome,
        damage_level: data.damageLevel,
        estimated_cost_usd: data.estimatedCostUsd ?? null,
        screenshot_urls: data.screenshotUrls ?? [],
        is_anonymous: data.isAnonymous,
        submitter_handle: cleanHandle,
        submitter_email: data.email ?? null,
        edit_token_hash: tokenHash,
        ip_hash: ipHash,
        status: "pending",
        vote_score: 0,
      })
      .select("id, case_number")
      .single();

    if (postErr || !post) {
      console.error("[posts] insert error:", postErr);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    // Insert post_tags junction rows
    if (tags && tags.length > 0) {
      const { error: tagLinkErr } = await supabase
        .from("post_tags")
        .insert(tags.map((t) => ({ post_id: post.id, tag_id: t.id })));

      if (tagLinkErr) {
        console.error("[posts] tag link error:", tagLinkErr);
      }
    }

    // Send edit token email if provided
    if (data.email) {
      try {
        await sendEditTokenEmail({
          to: data.email,
          caseNumber: post.case_number,
          editToken: rawToken,
          caseTitle: cleanTitle,
        });
      } catch (emailErr) {
        // Non-fatal — post is saved, email just failed
        console.error("[posts] email error:", emailErr);
      }
    }

    return NextResponse.json(
      { caseNumber: post.case_number, message: "Submission received. It will appear after review." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[posts] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
