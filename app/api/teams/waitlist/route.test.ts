import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hashIp = vi.fn(() => "hashed-ip");
const getClientIp = vi.fn(() => "127.0.0.1");
const from = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

vi.mock("@/lib/utils/hash", () => ({
  hashIp,
  getClientIp,
}));

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/teams/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/teams/waitlist", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("stores a waitlist request", async () => {
    const insertSpy = vi.fn().mockResolvedValue({ error: null });
    from.mockReturnValue({ insert: insertSpy });

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        email: "team@example.com",
        company: "Acme",
        role: "CTO",
        useCase: "Track AI incidents",
      }),
    );

    expect(response.status).toBe(201);
    expect(insertSpy).toHaveBeenCalledWith({
      email: "team@example.com",
      company: "Acme",
      role: "CTO",
      use_case: "Track AI incidents",
    });
  });

  it("returns a friendly duplicate-email error", async () => {
    from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: { code: "23505" } }),
    });

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        email: "team@example.com",
        company: "Acme",
        role: "CTO",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: "That email is already on the waitlist.",
    });
  });
});
