import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEditTokenEmail = vi.fn();
const hashIp = vi.fn(() => "hashed-ip");
const getClientIp = vi.fn(() => "127.0.0.1");
const from = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

vi.mock("@/lib/resend/send", () => ({
  sendEditTokenEmail,
}));

vi.mock("@/lib/utils/hash", () => ({
  hashIp,
  getClientIp,
}));

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/posts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("rejects unknown tags instead of silently dropping them", async () => {
    from.mockImplementation((table: string) => {
      if (table === "agents") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: "agent-1" }, error: null }),
            }),
          }),
        };
      }

      if (table === "tags") {
        return {
          select: () => ({
            in: async () => ({
              data: [{ id: "tag-1", slug: "hallucination" }],
              error: null,
            }),
          }),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        agentSlug: "claude",
        title: "Agent deleted a customer record during a routine sync",
        outcome:
          "The assistant misunderstood the task, deleted a live customer record, and forced the team into a manual restore that took several hours to unwind safely.",
        damageLevel: 3,
        estimatedCostUsd: 5000,
        tags: ["hallucination", "missing-tag"],
        isAnonymous: true,
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "One or more selected tags are invalid.",
    });
  });

  it("does not persist submitter emails and reports edit-link delivery", async () => {
    const insertSpy = vi.fn().mockReturnValue({
      select: () => ({
        single: async () => ({ data: { id: "post-1" }, error: null }),
      }),
    });
    const linkInsertSpy = vi.fn().mockResolvedValue({ error: null });

    from.mockImplementation((table: string) => {
      if (table === "agents") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: "agent-1" }, error: null }),
            }),
          }),
        };
      }

      if (table === "tags") {
        return {
          select: () => ({
            in: async () => ({
              data: [{ id: "tag-1", slug: "hallucination" }],
              error: null,
            }),
          }),
        };
      }

      if (table === "posts") {
        return {
          insert: insertSpy,
        };
      }

      if (table === "post_tags") {
        return {
          insert: linkInsertSpy,
        };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    sendEditTokenEmail.mockResolvedValue(undefined);

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        agentSlug: "claude",
        title: "Agent deleted a customer record during a routine sync",
        outcome:
          "The assistant misunderstood the task, deleted a live customer record, and forced the team into a manual restore that took several hours to unwind safely.",
        damageLevel: 3,
        estimatedCostUsd: 5000,
        tags: ["hallucination"],
        isAnonymous: false,
        authorHandle: "ops-team",
        email: "submitter@example.com",
      }),
    );

    expect(response.status).toBe(201);
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        submitter_email: null,
      }),
    );
    expect(sendEditTokenEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        caseNumber: null,
        to: "submitter@example.com",
      }),
    );
    await expect(response.json()).resolves.toMatchObject({
      editLinkSent: true,
    });
  });
});
