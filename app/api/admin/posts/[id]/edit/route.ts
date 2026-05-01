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
  title: z.string().min(1).max(300).optional(),
  outcome: z.string().min(1).max(5000).optional(),
  damage_level: z.number().int().min(1).max(5).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body: unknown = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields." }, { status: 400 });
  }
  const supabase = createSupabaseAdminClient();
  const updatePayload: {
    title?: string;
    outcome?: string;
    damage_level?: 1 | 2 | 3 | 4 | 5;
  } = {
    ...(parsed.data.title !== undefined && { title: parsed.data.title }),
    ...(parsed.data.outcome !== undefined && { outcome: parsed.data.outcome }),
    ...(parsed.data.damage_level !== undefined && {
      damage_level: parsed.data.damage_level as 1 | 2 | 3 | 4 | 5,
    }),
  };
  const { error } = await supabase
    .from("posts")
    .update(updatePayload)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
