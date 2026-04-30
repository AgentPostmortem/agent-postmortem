import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function checkAdminAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return auth === expected;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      case_number,
      title,
      outcome,
      prompt,
      damage_level,
      estimated_cost_usd,
      is_anonymous,
      submitter_handle,
      submitter_email,
      vote_score,
      status,
      created_at,
      agents ( id, name, slug ),
      post_tags ( tag_id, tags ( id, slug, label ) )
    `,
    )
    .eq("status", status as "pending" | "approved" | "rejected")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/posts] fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 },
    );
  }

  // Counts for all tabs
  const { data: counts } = await supabase.from("posts").select("status");

  const tabCounts = { pending: 0, approved: 0, rejected: 0 };
  for (const row of counts ?? []) {
    if (row.status in tabCounts) {
      tabCounts[row.status as keyof typeof tabCounts]++;
    }
  }

  return NextResponse.json({ posts: posts ?? [], counts: tabCounts });
}
