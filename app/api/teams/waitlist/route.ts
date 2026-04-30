import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashIp, getClientIp } from "@/lib/utils/hash";

const schema = z.object({
  email: z.string().email(),
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  useCase: z.string().trim().max(2000).optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ipHash);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ipHash = hashIp(getClientIp(req.headers));

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { error: "Too many waitlist requests. Try again later." },
        { status: 429 },
      );
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("team_waitlist").insert({
      email: parsed.data.email.toLowerCase(),
      company: parsed.data.company,
      role: parsed.data.role,
      use_case: parsed.data.useCase || null,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "That email is already on the waitlist." },
          { status: 409 },
        );
      }

      console.error("[teams/waitlist] insert error:", error);
      return NextResponse.json(
        { error: "Failed to join the waitlist." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[teams/waitlist] unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
