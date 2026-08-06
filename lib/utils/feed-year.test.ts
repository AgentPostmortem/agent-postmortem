import { describe, expect, it } from "vitest";
import {
  ALL_YEARS,
  bucketByYear,
  incidentYear,
  latestYear,
  resolveYear,
  totalAcrossYears,
  yearRange,
} from "./feed-year";

const rows = [
  { source_published_at: "2026-08-02T00:00:00Z", created_at: "2026-08-05" },
  { source_published_at: "2026-01-09T00:00:00Z", created_at: "2026-08-05" },
  { source_published_at: "2023-03-14T00:00:00Z", created_at: "2026-08-05" },
  // No source date: the record date decides the bucket.
  { source_published_at: null, created_at: "2024-11-02T00:00:00Z" },
  // No date at all: skipped, not guessed.
  { source_published_at: null, created_at: null },
];

describe("incidentYear", () => {
  it("prefers the source publication year over the record year", () => {
    expect(
      incidentYear({
        source_published_at: "2023-03-14T00:00:00Z",
        created_at: "2026-08-05T00:00:00Z",
      }),
    ).toBe("2023");
  });

  it("falls back to the record year when the source date is unknown", () => {
    expect(
      incidentYear({ source_published_at: null, created_at: "2024-11-02" }),
    ).toBe("2024");
  });

  it("reads camelCase Post fields too", () => {
    expect(incidentYear({ sourcePublishedAt: "2021-06-01" })).toBe("2021");
  });

  it("returns null when no date is known", () => {
    expect(incidentYear({ source_published_at: null, created_at: null })).toBe(
      null,
    );
  });
});

describe("bucketByYear", () => {
  it("counts per year, newest first, skipping undated rows", () => {
    expect(bucketByYear(rows)).toEqual([
      { year: "2026", count: 2 },
      { year: "2024", count: 1 },
      { year: "2023", count: 1 },
    ]);
  });

  it("returns an empty list for no rows", () => {
    expect(bucketByYear([])).toEqual([]);
  });
});

describe("latestYear", () => {
  it("returns the newest year with cases", () => {
    expect(latestYear(bucketByYear(rows))).toBe("2026");
  });

  it("returns null when there is no data", () => {
    expect(latestYear([])).toBe(null);
  });
});

describe("resolveYear", () => {
  const buckets = bucketByYear(rows);

  it("defaults to the newest year when no param is given", () => {
    expect(resolveYear(undefined, buckets)).toBe("2026");
    expect(resolveYear("", buckets)).toBe("2026");
  });

  it("returns null (whole archive) for the all-years sentinel", () => {
    expect(resolveYear(ALL_YEARS, buckets)).toBe(null);
  });

  it("honours a year we hold cases for", () => {
    expect(resolveYear("2023", buckets)).toBe("2023");
  });

  it("falls back to the archive for junk or empty years", () => {
    expect(resolveYear("1999", buckets)).toBe(null);
    expect(resolveYear("not-a-year", buckets)).toBe(null);
  });

  it("defaults to the archive when there is no data at all", () => {
    expect(resolveYear(undefined, [])).toBe(null);
  });
});

describe("yearRange", () => {
  it("produces a half-open range covering exactly that year", () => {
    expect(yearRange("2026")).toEqual({
      start: "2026-01-01T00:00:00.000Z",
      end: "2027-01-01T00:00:00.000Z",
    });
  });

  it("rolls the end boundary over the century", () => {
    expect(yearRange("2099").end).toBe("2100-01-01T00:00:00.000Z");
  });
});

describe("totalAcrossYears", () => {
  it("sums every bucket", () => {
    expect(totalAcrossYears(bucketByYear(rows))).toBe(4);
  });

  it("is zero for no buckets", () => {
    expect(totalAcrossYears([])).toBe(0);
  });
});
