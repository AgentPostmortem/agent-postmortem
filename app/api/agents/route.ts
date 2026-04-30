import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("agents")
    .select("slug, name, company")
    .order("name");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch agents." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
