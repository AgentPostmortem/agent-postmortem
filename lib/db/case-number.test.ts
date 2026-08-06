import { describe, expect, it, vi } from "vitest";

import {
  formatCaseNumber,
  isUniqueViolation,
  nextCaseNumber,
  parseCaseNumber,
  updateWithFreshCaseNumber,
} from "./case-number";

describe("parseCaseNumber", () => {
  it("reads the numeric suffix", () => {
    expect(parseCaseNumber("APM-0044")).toBe(44);
    expect(parseCaseNumber("apm-0007")).toBe(7);
    expect(parseCaseNumber("APM-10000")).toBe(10000);
  });

  it("rejects anything that is not a case number", () => {
    expect(parseCaseNumber(null)).toBeNull();
    expect(parseCaseNumber("")).toBeNull();
    expect(parseCaseNumber("APM-")).toBeNull();
    expect(parseCaseNumber("XYZ-0001")).toBeNull();
    expect(parseCaseNumber(44)).toBeNull();
  });
});

describe("formatCaseNumber", () => {
  it("keeps the zero padded APM-XXXX shape", () => {
    expect(formatCaseNumber(1)).toBe("APM-0001");
    expect(formatCaseNumber(44)).toBe("APM-0044");
    expect(formatCaseNumber(12345)).toBe("APM-12345");
  });
});

describe("nextCaseNumber", () => {
  it("increments from the highest existing number", () => {
    expect(nextCaseNumber(["APM-0001", "APM-0002", "APM-0003"])).toBe(
      "APM-0004",
    );
  });

  it("starts at APM-0001 when nothing exists", () => {
    expect(nextCaseNumber([])).toBe("APM-0001");
    expect(nextCaseNumber([null, null])).toBe("APM-0001");
  });

  it("does not reuse retired numbers when the sequence has gaps", () => {
    // 43 live cases but APM-0009..APM-0036 were retired: a count based
    // scheme would mint APM-0044, which is already taken.
    const existing = [
      ...Array.from({ length: 8 }, (_, i) => formatCaseNumber(i + 1)),
      ...Array.from({ length: 35 }, (_, i) => formatCaseNumber(i + 37)),
    ];

    expect(existing).toHaveLength(43);
    expect(existing).toContain("APM-0044");
    expect(nextCaseNumber(existing)).toBe("APM-0072");
  });

  it("ignores unparsable values and ordering", () => {
    expect(nextCaseNumber(["APM-0100", null, "draft", "APM-0007"])).toBe(
      "APM-0101",
    );
  });
});

describe("isUniqueViolation", () => {
  it("detects postgres unique violations", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
    expect(
      isUniqueViolation({
        message:
          'duplicate key value violates unique constraint "posts_case_number_key"',
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation({ code: "23503" })).toBe(false);
    expect(isUniqueViolation(new Error("network down"))).toBe(false);
  });
});

describe("updateWithFreshCaseNumber", () => {
  it("writes the next number on the first try", async () => {
    const update = vi.fn(async (caseNumber: string) => ({
      data: { case_number: caseNumber },
      error: null,
    }));

    const result = await updateWithFreshCaseNumber({
      listCaseNumbers: async () => ["APM-0001", "APM-0043"],
      update,
    });

    expect(result.caseNumber).toBe("APM-0044");
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ case_number: "APM-0044" });
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("sees a concurrently minted number on read and skips past it", async () => {
    // A concurrent approval claims APM-0044 between our read and our write.
    const stored = ["APM-0043"];
    const listCaseNumbers = vi.fn(async () => [...stored]);
    const update = vi.fn(async (caseNumber: string) => {
      if (stored.includes(caseNumber)) {
        return { data: null, error: { code: "23505" } };
      }
      stored.push(caseNumber);
      return { data: { case_number: caseNumber }, error: null };
    });

    stored.push("APM-0044");

    const result = await updateWithFreshCaseNumber({
      listCaseNumbers,
      update,
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(result.caseNumber).toBe("APM-0045");
    expect(result.error).toBeNull();
    expect(listCaseNumbers).toHaveBeenCalledTimes(1);
  });

  it("retries when the collision is only visible at write time", async () => {
    const taken = new Set(["APM-0044"]);
    const seen: string[] = [];
    const update = vi.fn(async (caseNumber: string) => {
      seen.push(caseNumber);
      if (taken.has(caseNumber)) {
        return { data: null, error: { code: "23505" } };
      }
      return { data: { case_number: caseNumber }, error: null };
    });

    // The read misses APM-0044 (stale replica), so the first write collides.
    let call = 0;
    const listCaseNumbers = async () => {
      call += 1;
      return call === 1 ? ["APM-0043"] : ["APM-0044"];
    };

    const result = await updateWithFreshCaseNumber({
      listCaseNumbers,
      update,
    });

    expect(seen).toEqual(["APM-0044", "APM-0045"]);
    expect(result.caseNumber).toBe("APM-0045");
    expect(result.error).toBeNull();
  });

  it("gives up after the bounded retry budget", async () => {
    const update = vi.fn(async () => ({
      data: null,
      error: { code: "23505" },
    }));

    const result = await updateWithFreshCaseNumber({
      listCaseNumbers: async () => ["APM-0043"],
      update,
      attempts: 3,
    });

    expect(update).toHaveBeenCalledTimes(3);
    expect(result.data).toBeNull();
    expect(result.error).toEqual({ code: "23505" });
  });

  it("returns non-collision errors without retrying", async () => {
    const update = vi.fn(async () => ({
      data: null,
      error: { code: "23503", message: "foreign key" },
    }));

    const result = await updateWithFreshCaseNumber({
      listCaseNumbers: async () => [],
      update,
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(result.error).toMatchObject({ code: "23503" });
  });
});
