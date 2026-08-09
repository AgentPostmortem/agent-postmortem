import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redactPii } from "@/lib/utils/pii";
import { hashEditToken } from "@/lib/utils/hash";

interface RouteParams {
  params: { token: string };
}

export async function GET(
  _req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const tokenHash = hashEditToken(params.token);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, case_number, title, outcome, prompt, damage_level, estimated_cost_usd, is_anonymous, submitter_handle, status, agents(slug, name), post_tags(tags(slug, label))",
    )
    .eq("edit_token_hash", tokenHash)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 404 },
    );
  }

  return NextResponse.json({ post: data });
}

const editSchema = z.object({
  title: z.string().min(20).max(200),
  outcome: z.string().min(100).max(10000),
  prompt: z.string().max(2000).optional().nullable(),
  damageLevel: z.number().int().min(1).max(5),
  estimatedCostUsd: z
    .number()
    .int()
    .min(0)
    .max(100_000_000)
    .optional()
    .nullable(),
  tags: z.array(z.string().max(64)).min(1).max(8),
  isAnonymous: z.boolean(),
  authorHandle: z.string().max(64).optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const tokenHash = hashEditToken(params.token);
  const supabase = createSupabaseAdminClient();

  // Verify token resolves to a post
  const { data: existing, error: lookupErr } = await supabase
    .from("posts")
    .select("id, status")
    .eq("edit_token_hash", tokenHash)
    .single();

  if (lookupErr || !existing) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 404 },
    );
  }

  // Only allow editing pending or approved posts (not rejected)
  if (existing.status === "rejected") {
    return NextResponse.json(
      { error: "This case has been rejected and cannot be edited." },
      { status: 403 },
    );
  }

  const body: unknown = await req.json();
  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const d = parsed.data;

  // Resolve tag IDs
  const { data: tags, error: tagsErr } = await supabase
    .from("tags")
    .select("id, slug")
    .in("slug", d.tags);

  if (tagsErr || !tags || tags.length !== new Set(d.tags).size) {
    return NextResponse.json(
      { error: "One or more tags are invalid." },
      { status: 400 },
    );
  }

  // Update post fields
  const { error: updateErr } = await supabase
    .from("posts")
    .update({
      title: redactPii(d.title),
      outcome: redactPii(d.outcome),
      prompt: d.prompt ? redactPii(d.prompt) : null,
      damage_level: d.damageLevel as 1 | 2 | 3 | 4 | 5,
      estimated_cost_usd: d.estimatedCostUsd ?? null,
      is_anonymous: d.isAnonymous,
      submitter_handle: d.authorHandle ? redactPii(d.authorHandle) : null,
      // Re-queue for moderation if it was already approved
      status: existing.status === "approved" ? "pending" : existing.status,
    })
    .eq("id", existing.id);

  if (updateErr) {
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 },
    );
  }

  // Replace tag associations
  await supabase.from("post_tags").delete().eq("post_id", existing.id);
  if (tags.length > 0) {
    await supabase
      .from("post_tags")
      .insert(tags.map((t) => ({ post_id: existing.id, tag_id: t.id })));
  }

  return NextResponse.json({
    success: true,
    requeued: existing.status === "approved",
  });
}
