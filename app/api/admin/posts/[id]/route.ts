import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendApprovalEmail } from "@/lib/resend/send";
import { getSiteUrl } from "@/lib/utils/urls";
import { updateWithFreshCaseNumber } from "@/lib/db/case-number";

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

  // Does this post still need a case number?
  let needsCaseNumber = false;
  if (parsed.data.status === "approved") {
    const { data: existing } = await supabase
      .from("posts")
      .select("case_number")
      .eq("id", params.id)
      .single();
    needsCaseNumber = !existing?.case_number;
  }

  const runUpdate = (payload: {
    status: "approved" | "rejected";
    case_number?: string;
  }) =>
    supabase
      .from("posts")
      .update(payload)
      .eq("id", params.id)
      .select("id, status, case_number, submitter_email, title")
      .single();

  // Case numbers are permanent, so the next one comes from the highest number
  // on file rather than a count of approved posts. Retired numbers are never
  // handed out again, and concurrent approvals retry on unique violations.
  const { data, error } = needsCaseNumber
    ? await updateWithFreshCaseNumber({
        listCaseNumbers: async () => {
          const { data: rows } = await supabase
            .from("posts")
            .select("case_number")
            .not("case_number", "is", null);
          return (rows ?? []).map((row) => row.case_number);
        },
        update: (caseNumber) =>
          runUpdate({ status: parsed.data.status, case_number: caseNumber }),
      })
    : await runUpdate({ status: parsed.data.status });

  if (error || !data) {
    console.error("[admin/posts/id] update error:", error);
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 },
    );
  }

  if (parsed.data.status === "approved" && data.submitter_email) {
    const caseUrl = `${getSiteUrl()}/case/${data.case_number}`;
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
