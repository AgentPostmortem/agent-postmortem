import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const from = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

describe("GET /api/admin/posts", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.ADMIN_PASSWORD = "secret";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword;
  });

  it("rejects requests without the admin password", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new NextRequest("http://localhost/api/admin/posts?status=pending"),
    );

    expect(response.status).toBe(401);
  });

  it("returns posts and tab counts when authenticated", async () => {
    from.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: (selection?: string) => {
            if (selection === "status") {
              return Promise.resolve({
                data: [{ status: "pending" }, { status: "approved" }],
              });
            }

            return {
              eq: () => ({
                order: async () => ({
                  data: [{ id: "post-1", status: "pending" }],
                  error: null,
                }),
              }),
            };
          },
        };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { GET } = await import("./route");
    const response = await GET(
      new NextRequest("http://localhost/api/admin/posts?status=pending", {
        headers: { "x-admin-password": "secret" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      posts: [{ id: "post-1", status: "pending" }],
      counts: { pending: 1, approved: 1, rejected: 0 },
    });
  });
});
