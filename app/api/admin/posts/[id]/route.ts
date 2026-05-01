import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendApprovalEmail } from "@/lib/resend/send";

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

  // Assign case number on approval if not already set
  let caseNumber: string | null = null;
  if (parsed.data.status === "approved") {
    const { data: existing } = await supabase
      .from("posts")
      .select("case_number")
      .eq("id", params.id)
      .single();

    if (!existing?.case_number) {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      const seq = ((count ?? 0) + 1).toString().padStart(4, "0");
      caseNumber = `APM-${seq}`;
    }
  }

  const updatePayload =
    caseNumber !== null
      ? { status: parsed.data.status, case_number: caseNumber }
      : { status: parsed.data.status };

  const { data, error } = await supabase
    .from("posts")
    .update(updatePayload)
    .eq("id", params.id)
    .select("id, status, case_number, submitter_email, title")
    .single();

  if (error || !data) {
    console.error("[admin/posts/id] update error:", error);
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 },
    );
  }

  if (parsed.data.status === "approved" && data.submitter_email) {
    const caseUrl = `https://agentpostmortem.com/case/${data.case_number}`;
    try {
      await sendApprovalEmail({
        to: data.submitter_email,
        caseNumber: data.case_number,
        caseTitle: data.title,
        caseUrl,
      });
    } catch (err) {
      console.error("[admin/posts/id] approval email failed:", err);
      return NextResponse.json(
        { error: "Post approved but approval email failed to send.", data },
        { status: 207 },
      );
    }
  }

  return NextResponse.json(data);
}
