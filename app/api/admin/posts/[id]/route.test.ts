import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const from = vi.fn();
const sendApprovalEmail = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

vi.mock("@/lib/resend/send", () => ({
  sendApprovalEmail: (...args: unknown[]) => sendApprovalEmail(...args),
}));

interface PostsTableOptions {
  /** Case number already on the post being approved, if any. */
  existingCaseNumber?: string | null;
  /** Every case number on file, including retired and rejected ones. */
  storedCaseNumbers: string[];
  /**
   * Case numbers the unique index will reject on write. They become visible
   * to reads only after the first one, mimicking a concurrent approval that
   * lands between our read and our write.
   */
  taken?: Set<string>;
}

const attemptedCaseNumbers: string[] = [];

function mockPostsTable(options: PostsTableOptions) {
  const taken = options.taken ?? new Set<string>();
  let reads = 0;

  from.mockImplementation((table: string) => {
    if (table !== "posts") throw new Error(`Unexpected table ${table}`);

    return {
      select: (columns: string) => ({
        // Lookup of the post's current case number.
        eq: () => ({
          single: async () => ({
            data: { case_number: options.existingCaseNumber ?? null },
            error: null,
          }),
        }),
        // Listing of all case numbers on file.
        not: async () => {
          reads += 1;
          const visible =
            reads === 1
              ? options.storedCaseNumbers
              : [...options.storedCaseNumbers, ...Array.from(taken)];
          return {
            data: visible.map((case_number) => ({ case_number })),
            error: null,
          };
        },
        columns,
      }),
      update: (payload: { status: string; case_number?: string }) => ({
        eq: () => ({
          select: () => ({
            single: async () => {
              const caseNumber = payload.case_number ?? null;
              if (caseNumber) attemptedCaseNumbers.push(caseNumber);
              if (caseNumber && taken.has(caseNumber)) {
                return { data: null, error: { code: "23505" } };
              }
              if (caseNumber) taken.add(caseNumber);
              return {
                data: {
                  id: "post-1",
                  status: payload.status,
                  case_number: caseNumber ?? options.existingCaseNumber ?? null,
                  submitter_email: null,
                  title: "A case",
                },
                error: null,
              };
            },
          }),
        }),
      }),
    };
  });
}

function patchRequest(status: string) {
  return new NextRequest("http://localhost/api/admin/posts/post-1", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-password": "secret",
    },
    body: JSON.stringify({ status }),
  });
}

describe("PATCH /api/admin/posts/[id]", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    attemptedCaseNumbers.length = 0;
    process.env.ADMIN_PASSWORD = "secret";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword;
  });

  it("rejects requests without the admin password", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new NextRequest("http://localhost/api/admin/posts/post-1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      }),
      { params: { id: "post-1" } },
    );

    expect(response.status).toBe(401);
  });

  it("assigns the next case number above the highest on file", async () => {
    mockPostsTable({ storedCaseNumbers: ["APM-0001", "APM-0043"] });

    const { PATCH } = await import("./route");
    const response = await PATCH(patchRequest("approved"), {
      params: { id: "post-1" },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      case_number: "APM-0044",
    });
  });

  it("never reuses a retired case number", async () => {
    // 43 approved cases, but APM-0009..APM-0036 were retired. A count based
    // scheme would mint APM-0044, which already exists.
    const stored = [
      ...Array.from(
        { length: 8 },
        (_, i) => `APM-${(i + 1).toString().padStart(4, "0")}`,
      ),
      ...Array.from(
        { length: 35 },
        (_, i) => `APM-${(i + 37).toString().padStart(4, "0")}`,
      ),
    ];
    mockPostsTable({ storedCaseNumbers: stored });

    const { PATCH } = await import("./route");
    const response = await PATCH(patchRequest("approved"), {
      params: { id: "post-1" },
    });

    const body = (await response.json()) as { case_number: string };
    expect(stored).toContain("APM-0044");
    expect(stored).not.toContain(body.case_number);
    expect(body.case_number).toBe("APM-0072");
  });

  it("retries when a concurrent approval takes the number first", async () => {
    mockPostsTable({
      storedCaseNumbers: ["APM-0043"],
      taken: new Set(["APM-0044"]),
    });

    const { PATCH } = await import("./route");
    const response = await PATCH(patchRequest("approved"), {
      params: { id: "post-1" },
    });

    expect(response.status).toBe(200);
    expect(attemptedCaseNumbers).toEqual(["APM-0044", "APM-0045"]);
    await expect(response.json()).resolves.toMatchObject({
      case_number: "APM-0045",
    });
  });

  it("leaves an existing case number alone", async () => {
    mockPostsTable({
      existingCaseNumber: "APM-0005",
      storedCaseNumbers: ["APM-0005", "APM-0043"],
    });

    const { PATCH } = await import("./route");
    const response = await PATCH(patchRequest("approved"), {
      params: { id: "post-1" },
    });

    expect(response.status).toBe(200);
    expect(attemptedCaseNumbers).toEqual([]);
  });

  it("does not assign a case number on rejection", async () => {
    mockPostsTable({ storedCaseNumbers: ["APM-0043"] });

    const { PATCH } = await import("./route");
    const response = await PATCH(patchRequest("rejected"), {
      params: { id: "post-1" },
    });

    expect(response.status).toBe(200);
    expect(attemptedCaseNumbers).toEqual([]);
  });
});
