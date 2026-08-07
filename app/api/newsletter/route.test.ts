import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hashIp = vi.fn(() => "hashed-ip");
const getClientIp = vi.fn(() => "127.0.0.1");
const consumeSharedRateLimit = vi.fn(async () => ({
  allowed: true,
  remaining: 2,
  resetAt: new Date().toISOString(),
  currentCount: 1,
}));
const from = vi.fn();
const sendNewsletterWelcome = vi.fn(async () => {});

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

vi.mock("@/lib/utils/hash", () => ({
  hashIp,
  getClientIp,
}));

vi.mock("@/lib/rate-limit/shared", () => ({
  consumeSharedRateLimit,
}));

vi.mock("@/lib/observability/events", () => ({
  logEvent: vi.fn(),
}));

vi.mock("@/lib/resend/newsletter", () => ({
  sendNewsletterWelcome,
}));

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockNewSubscriber() {
  from.mockReturnValue({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({
          data: { unsubscribe_token: "token-123" },
          error: null,
        }),
      }),
    }),
  });
}

function mockExistingSubscriber(status: string) {
  const update = vi.fn(() => ({
    eq: async () => ({ error: null }),
  }));
  from.mockReturnValue({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({
          data: { id: "sub-1", status, unsubscribe_token: "token-existing" },
        }),
      }),
    }),
    update,
  });
  return update;
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    consumeSharedRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date().toISOString(),
      currentCount: 1,
    });
  });

  it("subscribes a new email and sends the welcome email", async () => {
    mockNewSubscriber();

    const { POST } = await import("./route");
    const response = await POST(createRequest({ email: "new@example.com" }));

    expect(response.status).toBe(200);
    expect(sendNewsletterWelcome).toHaveBeenCalledWith(
      "new@example.com",
      "token-123",
    );
  });

  it("does not resend the welcome email to an already-active subscriber", async () => {
    mockExistingSubscriber("active");

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({ email: "existing@example.com" }),
    );

    expect(response.status).toBe(200);
    expect(sendNewsletterWelcome).not.toHaveBeenCalled();
  });

  it("resends the welcome email when reactivating an unsubscribed address", async () => {
    mockExistingSubscriber("unsubscribed");

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({ email: "existing@example.com" }),
    );

    expect(response.status).toBe(200);
    expect(sendNewsletterWelcome).toHaveBeenCalledWith(
      "existing@example.com",
      "token-existing",
    );
  });

  it("returns 429 and skips the database and email when rate limited", async () => {
    consumeSharedRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date().toISOString(),
      currentCount: 3,
    });

    const { POST } = await import("./route");
    const response = await POST(createRequest({ email: "spam@example.com" }));

    expect(response.status).toBe(429);
    expect(from).not.toHaveBeenCalled();
    expect(sendNewsletterWelcome).not.toHaveBeenCalled();
  });
});
