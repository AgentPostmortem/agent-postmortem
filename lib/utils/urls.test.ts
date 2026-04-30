import { afterEach, describe, expect, it } from "vitest";
import { getR2PublicBaseUrl, getSiteUrl } from "./urls";

describe("url helpers", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com///";
    process.env.NEXT_PUBLIC_APP_URL = "https://fallback.example.com";

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to NEXT_PUBLIC_APP_URL when the public site URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://fallback.example.com/";

    expect(getSiteUrl()).toBe("https://fallback.example.com");
  });

  it("supports both R2 public URL env names", () => {
    process.env.R2_PUBLIC_URL = "https://r2.example.com/";
    expect(getR2PublicBaseUrl()).toBe("https://r2.example.com");

    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = "https://public.example.com//";
    expect(getR2PublicBaseUrl()).toBe("https://public.example.com");
  });
});
