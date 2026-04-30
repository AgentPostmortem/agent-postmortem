/**
 * SERVER ONLY — Supabase service role client.
 *
 * This module uses the SERVICE_ROLE key which bypasses Row Level Security.
 * NEVER import this file in client components or expose it to the browser.
 * Only use in API routes, server actions, and server-side scripts.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
