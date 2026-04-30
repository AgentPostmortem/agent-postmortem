import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashIp, getClientIp } from "@/lib/utils/hash";
import { logEvent } from "@/lib/observability/events";
import { consumeSharedRateLimit } from "@/lib/rate-limit/shared";

const schema = z.object({
  email: z.string().email(),
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  useCase: z.string().trim().max(2000).optional(),
});

const WINDOW_SECONDS = 60 * 60;
const MAX_REQUESTS = 5;

export async function POST(req: NextRequest) {
  try {
    const ipHash = hashIp(getClientIp(req.headers));

    const rateLimit = await consumeSharedRateLimit(
      `waitlist:${ipHash}`,
      WINDOW_SECONDS,
      MAX_REQUESTS,
    );

    if (!rateLimit.allowed) {
      logEvent({
        event: "waitlist.rate_limited",
        level: "warn",
        ipHash,
      });
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
        logEvent({
          event: "waitlist.duplicate",
          level: "warn",
          ipHash,
          email: parsed.data.email.toLowerCase(),
        });
        return NextResponse.json(
          { error: "That email is already on the waitlist." },
          { status: 409 },
        );
      }

      console.error("[teams/waitlist] insert error:", error);
      logEvent({
        event: "waitlist.failed",
        level: "error",
        ipHash,
        error: error.message,
      });
      return NextResponse.json(
        { error: "Failed to join the waitlist." },
        { status: 500 },
      );
    }

    logEvent({
      event: "waitlist.created",
      ipHash,
      email: parsed.data.email.toLowerCase(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[teams/waitlist] unexpected error:", error);
    logEvent({
      event: "waitlist.unexpected_error",
      level: "error",
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
