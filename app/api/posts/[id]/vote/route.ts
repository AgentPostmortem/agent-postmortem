import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashIp, getClientIp } from "@/lib/utils/hash";
import { logEvent } from "@/lib/observability/events";
import { consumeSharedRateLimit } from "@/lib/rate-limit/shared";

const schema = z.object({
  direction: z.enum(["up", "down"]).nullable(),
});

const WINDOW_SECONDS = 10 * 60;
const MAX_VOTES = 60;

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    const rateLimit = await consumeSharedRateLimit(
      `votes:${ipHash}`,
      WINDOW_SECONDS,
      MAX_VOTES,
    );

    if (!rateLimit.allowed) {
      logEvent({
        event: "vote.rate_limited",
        level: "warn",
        ipHash,
        postId: params.id,
      });
      return NextResponse.json(
        { error: "Too many votes. Slow down." },
        { status: 429 },
      );
    }

    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid direction." },
        { status: 400 },
      );
    }

    const { direction } = parsed.data;
    const postId = params.id;
    const supabase = createSupabaseAdminClient();

    // Confirm post exists and is published
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("id, vote_score")
      .eq("id", postId)
      .eq("status", "approved")
      .single();

    if (postErr || !post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // Check existing vote from this IP
    const { data: existing } = await supabase
      .from("votes")
      .select("id, direction")
      .eq("post_id", postId)
      .eq("ip_hash", ipHash)
      .maybeSingle();

    if (direction === null) {
      if (existing) {
        await supabase.from("votes").delete().eq("id", existing.id);
      }
    } else if (existing) {
      if (existing.direction === direction) {
        await supabase.from("votes").delete().eq("id", existing.id);
      } else {
        await supabase
          .from("votes")
          .update({ direction })
          .eq("id", existing.id);
      }
    } else {
      await supabase
        .from("votes")
        .insert({ post_id: postId, ip_hash: ipHash, direction });
    }

    const { data: updatedPost, error: updatedPostErr } = await supabase
      .from("posts")
      .select("vote_score")
      .eq("id", postId)
      .single();

    if (updatedPostErr || !updatedPost) {
      console.error("[vote] score refresh error:", updatedPostErr);
      logEvent({
        event: "vote.refresh_failed",
        level: "error",
        ipHash,
        postId,
        error: updatedPostErr?.message ?? "unknown",
      });
      return NextResponse.json(
        { error: "Failed to refresh vote score." },
        { status: 500 },
      );
    }

    logEvent({
      event: "vote.recorded",
      ipHash,
      postId,
      direction,
      score: updatedPost.vote_score,
    });

    return NextResponse.json({ score: updatedPost.vote_score });
  } catch (err) {
    console.error("[vote] unexpected error:", err);
    logEvent({
      event: "vote.unexpected_error",
      level: "error",
      error: err instanceof Error ? err.message : "unknown",
      postId: params.id,
    });
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
