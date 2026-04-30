import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
  currentCount: number;
}

export async function consumeSharedRateLimit(
  key: string,
  windowSeconds: number,
  maxRequests: number,
): Promise<RateLimitResult> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    throw new Error("Rate limit function returned no data.");
  }

  return {
    allowed: Boolean(row.allowed),
    remaining: Number(row.remaining ?? 0),
    resetAt: String(row.reset_at),
    currentCount: Number(row.current_count ?? 0),
  };
}
