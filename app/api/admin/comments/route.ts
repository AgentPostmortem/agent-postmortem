import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function checkAuth(req: NextRequest): boolean {
  const pwd = req.headers.get("x-admin-password");
  return pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawStatus = req.nextUrl.searchParams.get("status") ?? "visible";
  const status = ["visible", "hidden", "removed"].includes(rawStatus)
    ? (rawStatus as "visible" | "hidden" | "removed")
    : ("visible" as const);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, body, is_anonymous, author_handle, status, created_at, post_id, posts(case_number, title)",
    )
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ comments: [] });
  return NextResponse.json({ comments: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  if (!id || !["visible", "hidden", "removed"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
