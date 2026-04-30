import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashIp, getClientIp } from "@/lib/utils/hash";

const schema = z.object({
  direction: z.enum(["up", "down"]).nullable(),
});

// Rate limit: 60 vote actions per IP per 10 min
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_VOTES = 60;

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ipHash);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_VOTES) return true;
  entry.count++;
  return false;
}

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    if (isRateLimited(ipHash)) {
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
      return NextResponse.json(
        { error: "Failed to refresh vote score." },
        { status: 500 },
      );
    }

    return NextResponse.json({ score: updatedPost.vote_score });
  } catch (err) {
    console.error("[vote] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
