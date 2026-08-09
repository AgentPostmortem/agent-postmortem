import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEditTokenEmail } from "@/lib/resend/send";
import { randomBytes } from "crypto";
import { hashEditToken } from "@/lib/utils/hash";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, title, submitter_email, case_number")
    .eq("id", params.id)
    .single();

  if (!post?.submitter_email) {
    return NextResponse.json({ error: "No email on file." }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashEditToken(token);
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await supabase
    .from("posts")
    .update({ edit_token_hash: tokenHash, edit_token_expires_at: expiresAt })
    .eq("id", params.id);

  await sendEditTokenEmail({
    to: post.submitter_email,
    editToken: token,
    caseTitle: post.title,
    caseNumber: post.case_number ?? null,
  });

  return NextResponse.json({ ok: true });
}
