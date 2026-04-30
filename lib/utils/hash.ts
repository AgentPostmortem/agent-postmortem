import { createHmac } from "crypto";

/**
 * Hash an IP address using HMAC-SHA256 with a secret pepper.
 *
 * The pepper is loaded from IP_HASH_PEPPER env var and never stored.
 * The resulting hash is used as a pseudonymous identifier for rate limiting
 * and duplicate vote detection — the original IP cannot be recovered.
 *
 * @param ip - Raw IP address string (IPv4 or IPv6)
 * @returns Hex-encoded HMAC-SHA256 hash
 */
export function hashIp(ip: string): string {
  const pepper = process.env.IP_HASH_PEPPER;
  if (!pepper) {
    throw new Error(
      "IP_HASH_PEPPER environment variable is not set. " +
        "Generate one with: openssl rand -hex 32",
    );
  }
  return createHmac("sha256", pepper).update(ip.trim()).digest("hex");
}

/**
 * Extract the client IP from Next.js request headers.
 * Checks x-forwarded-for (Vercel/proxies) then falls back to connection IP.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; first is the client
    return forwarded.split(",")[0].trim();
  }
  return headers.get("x-real-ip") ?? "unknown";
}
