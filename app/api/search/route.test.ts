import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchSearchPosts = vi.fn();

vi.mock("@/lib/db/posts", () => ({
  fetchSearchPosts,
}));

function createRequest(query: string) {
  return new NextRequest(`http://localhost/api/search?${query}`);
}

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns an empty result without querying for a too-short query", async () => {
    const { GET } = await import("./route");
    const response = await GET(createRequest("q=a"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ posts: [] });
    expect(fetchSearchPosts).not.toHaveBeenCalled();
  });

  it("returns an empty result for a missing query", async () => {
    const { GET } = await import("./route");
    const response = await GET(createRequest(""));

    await expect(response.json()).resolves.toEqual({ posts: [] });
    expect(fetchSearchPosts).not.toHaveBeenCalled();
  });

  it("searches and returns posts for a normal query", async () => {
    fetchSearchPosts.mockResolvedValue([
      { id: "post-1", title: "Agent deleted a database" },
    ]);

    const { GET } = await import("./route");
    const response = await GET(createRequest("q=database"));

    expect(response.status).toBe(200);
    expect(fetchSearchPosts).toHaveBeenCalledWith("database", {
      agentSlug: undefined,
      minSeverity: undefined,
      maxSeverity: undefined,
    });
    await expect(response.json()).resolves.toEqual({
      posts: [{ id: "post-1", title: "Agent deleted a database" }],
    });
  });

  it("passes through agent and severity filters", async () => {
    fetchSearchPosts.mockResolvedValue([]);

    const { GET } = await import("./route");
    await GET(
      createRequest("q=outage&agent=claude&minSeverity=2&maxSeverity=4"),
    );

    expect(fetchSearchPosts).toHaveBeenCalledWith("outage", {
      agentSlug: "claude",
      minSeverity: 2,
      maxSeverity: 4,
    });
  });
});
