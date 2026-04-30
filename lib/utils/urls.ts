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
