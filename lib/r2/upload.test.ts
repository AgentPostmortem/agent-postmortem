import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { putObjectCommand, getSignedUrl } = vi.hoisted(() => ({
  putObjectCommand: vi.fn((input: unknown) => ({ input })),
  getSignedUrl: vi.fn(async () => "https://upload.example/signed"),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(() => ({})),
  PutObjectCommand: putObjectCommand,
  GetObjectCommand: vi.fn((input: unknown) => ({ input })),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl,
}));

import { getPresignedUploadUrl } from "./upload";

describe("getPresignedUploadUrl", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.R2_ACCOUNT_ID = "test-account";
    process.env.R2_ACCESS_KEY_ID = "test-key";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret";
    process.env.R2_BUCKET_NAME = "test-bucket";
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    putObjectCommand.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it.each([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
    ["image/gif", "gif"],
  ])("maps %s to a .%s key", async (contentType, ext) => {
    const { key } = await getPresignedUploadUrl("whatever.html", contentType);

    expect(key).toMatch(new RegExp(`^screenshots/[^/]+\\.${ext}$`));
  });

  it("ignores a hostile filename with a disallowed extension", async () => {
    const { key } = await getPresignedUploadUrl("payload.html", "image/png");

    expect(key.endsWith(".html")).toBe(false);
    expect(key.endsWith(".png")).toBe(true);
  });

  it("falls back to .bin for an unrecognized content type", async () => {
    const { key } = await getPresignedUploadUrl(
      "file",
      "application/octet-stream",
    );

    expect(key).toMatch(/^screenshots\/[^/]+\.bin$/);
  });

  it("passes the sanitized original filename as object metadata, not the key", async () => {
    await getPresignedUploadUrl("my photo #1!.png", "image/png");

    const command = putObjectCommand.mock.calls[0][0] as {
      Metadata?: Record<string, string>;
    };
    expect(command.Metadata?.["original-filename"]).toBe("my_photo__1_.png");
  });
});
