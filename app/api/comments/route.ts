import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { consumeSharedRateLimit } from "@/lib/rate-limit/shared";

function hashIp(ip: string): string {
  const pepper = process.env.IP_HASH_PEPPER ?? "default-pepper";
  return createHash("sha256")
    .update(ip + pepper)
    .digest("hex");
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ comments: [] });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, body, is_anonymous, author_handle, created_at")
    .eq("post_id", postId)
    .eq("status", "visible")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ comments: [] });
  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { post_id, body: text, is_anonymous, author_handle } = body;

    if (!post_id || !text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const trimmed = text.trim();
    if (trimmed.length < 3 || trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 3–2000 characters" },
        { status: 400 },
      );
    }

    const ip = getIp(req);
    const ip_hash = hashIp(ip);

    const rateLimit = await consumeSharedRateLimit(
      `comment:${ip_hash}`,
      3600,
      5,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many comments. Try again later." },
        { status: 429 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        body: trimmed,
        is_anonymous: is_anonymous ?? true,
        author_handle: is_anonymous ? null : (author_handle ?? null),
        ip_hash,
        status: "visible",
      })
      .select("id, body, is_anonymous, author_handle, created_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ comment: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 },
    );
  }
}
