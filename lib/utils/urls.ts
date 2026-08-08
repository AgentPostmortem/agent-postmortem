const DEFAULT_SITE_URL = "https://agentpostmortem.com";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;

  if (!configured) {
    return DEFAULT_SITE_URL;
  }

  return stripTrailingSlash(configured);
}

export function getR2PublicBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL;

  return configured ? stripTrailingSlash(configured) : "";
}

const SCREENSHOT_KEY_PATTERN =
  /^screenshots\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$/i;

/**
 * True only for URLs pointing at an object we generated ourselves through
 * the presigned upload flow — same R2 public base URL, key shaped like
 * `screenshots/<uuid>.<ext>`. Anything else (a third party host, or a
 * same-host URL with a made-up key) is rejected.
 */
export function isOwnedScreenshotUrl(url: string): boolean {
  const base = getR2PublicBaseUrl();
  if (!base) return false;
  if (!url.startsWith(`${base}/`)) return false;

  const key = url.slice(base.length + 1);
  return SCREENSHOT_KEY_PATTERN.test(key);
}
