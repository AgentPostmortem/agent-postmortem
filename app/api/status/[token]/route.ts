import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashEditToken } from "@/lib/utils/hash";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } },
): Promise<NextResponse> {
  const tokenHash = hashEditToken(params.token);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("posts")
    .select("case_number, title, status, created_at, agents(name)")
    .eq("edit_token_hash", tokenHash)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({
    caseNumber: data.case_number,
    title: data.title,
    status: data.status,
    createdAt: data.created_at,
    agentName:
      (data.agents as unknown as { name: string } | null)?.name ?? "Unknown",
  });
}
