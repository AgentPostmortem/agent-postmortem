import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function checkAdminAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return auth === expected;
}

const schema = z.object({
  status: z.enum(["approved", "rejected"]),
});

interface RouteParams {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body: unknown = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("posts")
    .update({ status: parsed.data.status })
    .eq("id", params.id)
    .select("id, status, case_number")
    .single();

  if (error || !data) {
    console.error("[admin/posts/id] update error:", error);
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
