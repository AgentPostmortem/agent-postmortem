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
      return NextResponse.json({ error: "Too many votes. Slow down." }, { status: 429 });
    }

    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid direction." }, { status: 400 });
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

    let delta = 0;

    if (direction === null) {
      // Remove vote
      if (existing) {
        await supabase.from("votes").delete().eq("id", existing.id);
        delta = existing.direction === "up" ? -1 : 1;
      }
    } else if (existing) {
      if (existing.direction === direction) {
        // Same direction — remove (toggle off)
        await supabase.from("votes").delete().eq("id", existing.id);
        delta = direction === "up" ? -1 : 1;
      } else {
        // Flip direction
        await supabase
          .from("votes")
          .update({ direction })
          .eq("id", existing.id);
        delta = direction === "up" ? 2 : -2;
      }
    } else {
      // New vote
      await supabase.from("votes").insert({ post_id: postId, ip_hash: ipHash, direction });
      delta = direction === "up" ? 1 : -1;
    }

    // Update denormalized score
    if (delta !== 0) {
      await supabase
        .from("posts")
        .update({ vote_score: (post.vote_score ?? 0) + delta })
        .eq("id", postId);
    }

    return NextResponse.json({ score: (post.vote_score ?? 0) + delta });
  } catch (err) {
    console.error("[vote] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
