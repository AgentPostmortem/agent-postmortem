import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendNewsletterWelcome } from "@/lib/resend/newsletter";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const supabase = createSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();

  let token: string | undefined = existing?.unsubscribe_token;

  if (existing) {
    if (existing.status !== "active") {
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active" })
        .eq("id", existing.id);
    }
  } else {
    const { data: inserted, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email })
      .select("unsubscribe_token")
      .single();
    if (error || !inserted) {
      console.error("[newsletter] insert error:", error);
      return NextResponse.json(
        { error: "Could not subscribe. Try again later." },
        { status: 500 },
      );
    }
    token = inserted.unsubscribe_token;
  }

  // Welcome email is best-effort; subscription already succeeded.
  try {
    if (token) await sendNewsletterWelcome(email, token);
  } catch (e) {
    console.error("[newsletter] welcome email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
