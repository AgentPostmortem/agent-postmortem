import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tags")
    .select("slug, label, description")
    .order("label");

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags." },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}
