import { describe, expect, it } from "vitest";
import { incidentDate, incidentMonth } from "./incident-date";

describe("incidentDate", () => {
  it("prefers the source publication date on a database row", () => {
    expect(
      incidentDate({
        created_at: "2026-07-01T00:00:00Z",
        source_published_at: "2023-03-14T00:00:00Z",
      }),
    ).toBe("2023-03-14T00:00:00Z");
  });

  it("falls back to created_at when the source date is null", () => {
    expect(
      incidentDate({
        created_at: "2026-07-01T00:00:00Z",
        source_published_at: null,
      }),
    ).toBe("2026-07-01T00:00:00Z");
  });

  it("prefers the source publication date on a mapped Post", () => {
    expect(
      incidentDate({
        createdAt: "2026-07-01T00:00:00Z",
        sourcePublishedAt: "2016-11-02T00:00:00Z",
      }),
    ).toBe("2016-11-02T00:00:00Z");
  });

  it("falls back to createdAt when a mapped Post has no source date", () => {
    expect(
      incidentDate({
        createdAt: "2026-07-01T00:00:00Z",
        sourcePublishedAt: undefined,
      }),
    ).toBe("2026-07-01T00:00:00Z");
  });

  it("returns null when no date at all is known", () => {
    expect(incidentDate({})).toBeNull();
  });
});

describe("incidentMonth", () => {
  it("buckets by the source publication month", () => {
    expect(
      incidentMonth({
        created_at: "2026-07-01T00:00:00Z",
        source_published_at: "2023-03-14T00:00:00Z",
      }),
    ).toBe("2023-03");
  });

  it("buckets by created_at when the source date is missing", () => {
    expect(incidentMonth({ created_at: "2026-07-01T00:00:00Z" })).toBe(
      "2026-07",
    );
  });

  it("returns null when no date is known", () => {
    expect(incidentMonth({})).toBeNull();
  });
});
