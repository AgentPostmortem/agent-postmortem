import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const consumeSharedRateLimit = vi.fn(async () => ({
  allowed: true,
  remaining: 4,
  resetAt: new Date().toISOString(),
  currentCount: 1,
}));
const send = vi.fn(async () => ({ data: { id: "mail-1" }, error: null }));
const logEvent = vi.fn();

vi.mock("@/lib/utils/hash", () => ({
  hashIp: vi.fn(() => "hashed-ip"),
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

vi.mock("@/lib/rate-limit/shared", () => ({
  consumeSharedRateLimit,
}));

vi.mock("@/lib/observability/events", () => ({
  logEvent,
}));

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send } })),
}));

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/pilot-lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const valid = {
  name: "Ada Lovelace",
  email: "ada@company.com",
  company: "company.com",
  track: "support",
  workflow: "Triage sixty Zendesk tickets every morning and refund damaged orders.",
};

describe("POST /api/pilot-lead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consumeSharedRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetAt: new Date().toISOString(),
      currentCount: 1,
    });
    send.mockResolvedValue({ data: { id: "mail-1" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
  });

  it("accepts a valid application and notifies the owner", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest(valid));

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    const args = send.mock.calls[0][0] as Record<string, unknown>;
    expect(args.to).toBe("hello@agentpostmortem.com");
    expect(args.reply_to).toBe("ada@company.com");
    expect(args.subject).toContain("Ada Lovelace");
  });

  it("returns every field error at once", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      createRequest({ name: "", email: "nope", track: "support", workflow: "short" }),
    );
    const data = (await response.json()) as {
      errors: Record<string, string>;
      error: string;
    };

    expect(response.status).toBe(400);
    expect(data.errors.name).toBeTruthy();
    expect(data.errors.email).toBeTruthy();
    expect(data.errors.workflow).toBeTruthy();
    expect(data.error).toBe(data.errors.name);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects an invalid track value", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({ ...valid, track: "moon" }));
    const data = (await response.json()) as { errors: Record<string, string> };

    expect(response.status).toBe(400);
    expect(data.errors.track).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });

  it("answers honeypot submissions with fake success and sends nothing", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({ ...valid, website: "spam-bot" }));
    const data = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 429 and skips email when rate limited", async () => {
    consumeSharedRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date().toISOString(),
      currentCount: 5,
    });

    const { POST } = await import("./route");
    const response = await POST(createRequest(valid));

    expect(response.status).toBe(429);
    expect(send).not.toHaveBeenCalled();
  });
});
