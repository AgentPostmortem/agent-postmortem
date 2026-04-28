import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPresignedUploadUrl } from "@/lib/r2/upload";
import { hashIp, getClientIp } from "@/lib/utils/hash";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const schema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().refine((t) => ALLOWED_TYPES.includes(t), {
    message: "Only JPEG, PNG, WEBP, and GIF images are allowed.",
  }),
  size: z.number().max(MAX_SIZE_BYTES, "File must be under 5 MB.").optional(),
});

// Simple in-memory rate limit: max 10 presign requests per IP per 10 min
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ipHash);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    if (isRateLimited(ipHash)) {
      return NextResponse.json({ error: "Too many upload requests. Try again later." }, { status: 429 });
    }

    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { filename, contentType } = parsed.data;
    const result = await getPresignedUploadUrl(filename, contentType, "screenshots");

    return NextResponse.json({ url: result.uploadUrl, publicUrl: result.publicUrl, key: result.key });
  } catch (err) {
    console.error("[presign] error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL." }, { status: 500 });
  }
}
