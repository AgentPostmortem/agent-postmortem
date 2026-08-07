import { afterEach, describe, expect, it } from "vitest";
import { getClientIp, hashIp } from "./hash";

describe("hashIp", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("throws when IP_HASH_PEPPER is unset", () => {
    delete (process.env as Record<string, string | undefined>).IP_HASH_PEPPER;

    expect(() => hashIp("1.2.3.4")).toThrow(
      "IP_HASH_PEPPER environment variable is not set",
    );
  });

  it("is deterministic for the same input and pepper", () => {
    process.env.IP_HASH_PEPPER = "test-pepper";

    expect(hashIp("1.2.3.4")).toBe(hashIp("1.2.3.4"));
  });

  it("differs for a different pepper", () => {
    process.env.IP_HASH_PEPPER = "pepper-a";
    const hashA = hashIp("1.2.3.4");

    process.env.IP_HASH_PEPPER = "pepper-b";
    const hashB = hashIp("1.2.3.4");

    expect(hashA).not.toBe(hashB);
  });

  it("trims surrounding whitespace before hashing", () => {
    process.env.IP_HASH_PEPPER = "test-pepper";

    expect(hashIp(" 1.2.3.4 ")).toBe(hashIp("1.2.3.4"));
  });
});

describe("getClientIp", () => {
  it("returns the first entry of a comma-separated x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
    });

    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip when x-forwarded-for is missing", () => {
    const headers = new Headers({ "x-real-ip": "9.8.7.6" });

    expect(getClientIp(headers)).toBe("9.8.7.6");
  });

  it('falls back to "unknown" when neither header is present', () => {
    const headers = new Headers();

    expect(getClientIp(headers)).toBe("unknown");
  });
});
