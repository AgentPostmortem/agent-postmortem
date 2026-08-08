import { afterEach, describe, expect, it } from "vitest";
import { getR2PublicBaseUrl, getSiteUrl, isOwnedScreenshotUrl } from "./urls";

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
    delete (process.env as Record<string, string | undefined>)
      .NEXT_PUBLIC_SITE_URL;
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

describe("isOwnedScreenshotUrl", () => {
  const originalEnv = { ...process.env };
  const uuid = "8f14e45f-ceea-467e-b7d1-3cfa78f5c15e";

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("accepts a well-formed key under our own R2 base URL", () => {
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    expect(
      isOwnedScreenshotUrl(`https://cdn.example.com/screenshots/${uuid}.png`),
    ).toBe(true);
  });

  it("rejects a URL on a different host", () => {
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    expect(
      isOwnedScreenshotUrl(`https://evil.example.com/screenshots/${uuid}.png`),
    ).toBe(false);
  });

  it("rejects a malformed key on our own host", () => {
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    expect(
      isOwnedScreenshotUrl("https://cdn.example.com/screenshots/../../etc/passwd"),
    ).toBe(false);
    expect(
      isOwnedScreenshotUrl("https://cdn.example.com/uploads/not-a-screenshot.png"),
    ).toBe(false);
  });

  it("rejects everything when the R2 public URL isn't configured", () => {
    delete (process.env as Record<string, string | undefined>).R2_PUBLIC_URL;
    delete (process.env as Record<string, string | undefined>)
      .NEXT_PUBLIC_R2_PUBLIC_URL;
    expect(
      isOwnedScreenshotUrl(`https://cdn.example.com/screenshots/${uuid}.png`),
    ).toBe(false);
  });
});
