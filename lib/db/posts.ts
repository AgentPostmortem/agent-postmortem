import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/types";

export type FeedTab = "hot" | "new" | "week" | "hof";

function rowToPost(row: Record<string, unknown>): Post {
  const agent = row.agents as Record<string, unknown> | null;
  const postTags = row.post_tags as Array<{ tags: { slug: string } }> | null;

  return {
    id: row.id as string,
    caseNumber: row.case_number as string,
    title: row.title as string,
    agentSlug: (agent?.slug as string) ?? "other",
    agentName: (agent?.name as string) ?? "Unknown",
    outcome: row.outcome as string,
    prompt: (row.prompt as string | null) ?? undefined,
    damageLevel: row.damage_level as 1 | 2 | 3 | 4 | 5,
    estimatedCostUsd: (row.estimated_cost_usd as number | null) ?? null,
    tags: postTags?.map((pt) => pt.tags.slug) ?? [],
    voteScore: (row.vote_score as number) ?? 0,
    createdAt: row.created_at as string,
    isAnonymous: (row.is_anonymous as boolean) ?? true,
    authorHandle: (row.submitter_handle as string | null) ?? undefined,
    screenshots: (row.screenshot_urls as string[] | null) ?? [],
  };
}

const PAGE_SIZE = 20;

export async function fetchFeedPosts(
  tab: FeedTab,
  page = 1,
  agentSlug?: string,
  severity?: number,
): Promise<{ posts: Post[]; total: number }> {
  try {
    const supabase = createSupabaseServerClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("posts")
      .select(
        `*, agents!inner(slug, name, company), post_tags(tags(slug, label))`,
        { count: "exact" },
      )
      .eq("status", "approved")
      .range(from, to);

    if (agentSlug) query = query.eq("agents.slug", agentSlug);
    if (severity != null) query = query.eq("damage_level", severity);

    if (tab === "new") {
      query = query.order("created_at", { ascending: false });
    } else if (tab === "week") {
      const weekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      query = query
        .gte("created_at", weekAgo)
        .order("vote_score", { ascending: false });
    } else if (tab === "hof") {
      query = query.order("vote_score", { ascending: false });
    } else {
      query = query
        .order("vote_score", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    if (error || !data) return { posts: [], total: 0 };
    return {
      posts: data.map((row) => rowToPost(row as Record<string, unknown>)),
      total: count ?? 0,
    };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function fetchPostByCase(
  caseNumber: string,
): Promise<Post | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`*, agents(slug, name, company), post_tags(tags(slug, label))`)
      .eq("case_number", caseNumber.toUpperCase())
      .eq("status", "approved")
      .single();

    if (error || !data) return null;
    return rowToPost(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function fetchPostsByAgent(
  slug: string,
  limit = 20,
): Promise<Post[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, agents!inner(slug, name, company), post_tags(tags(slug, label))`,
      )
      .eq("agents.slug", slug)
      .eq("status", "approved")
      .order("vote_score", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => rowToPost(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function fetchPostsByTag(
  tagSlug: string,
  limit = 20,
): Promise<Post[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, agents(slug, name, company), post_tags!inner(tags!inner(slug, label))`,
      )
      .eq("post_tags.tags.slug", tagSlug)
      .eq("status", "approved")
      .order("vote_score", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => rowToPost(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function fetchSiteStats(): Promise<{
  totalPosts: number;
  totalAgents: number;
  totalDamage: number;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("estimated_cost_usd, agent_id")
      .eq("status", "approved");

    if (!data) return { totalPosts: 0, totalAgents: 0, totalDamage: 0 };

    const rows = data as Array<{
      estimated_cost_usd: number | null;
      agent_id: string;
    }>;
    const totalDamage = rows.reduce(
      (sum, p) => sum + (p.estimated_cost_usd ?? 0),
      0,
    );
    const uniqueAgents = new Set(rows.map((p) => p.agent_id)).size;

    return { totalPosts: data.length, totalAgents: uniqueAgents, totalDamage };
  } catch {
    return { totalPosts: 0, totalAgents: 0, totalDamage: 0 };
  }
}

export async function fetchRelatedPosts(
  caseNumber: string,
  agentSlug: string,
  tags: string[],
  limit = 3,
): Promise<Post[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`*, agents(slug, name, company), post_tags(tags(slug, label))`)
      .eq("status", "approved")
      .neq("case_number", caseNumber)
      .eq("agents.slug", agentSlug)
      .order("vote_score", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      // fallback: get any recent posts
      const { data: fallback } = await supabase
        .from("posts")
        .select(`*, agents(slug, name, company), post_tags(tags(slug, label))`)
        .eq("status", "approved")
        .neq("case_number", caseNumber)
        .order("vote_score", { ascending: false })
        .limit(limit);
      return (fallback ?? []).map((row) =>
        rowToPost(row as Record<string, unknown>),
      );
    }
    return data.map((row) => rowToPost(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function fetchSearchPosts(
  query: string,
  limit = 20,
): Promise<Post[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`*, agents(slug, name, company), post_tags(tags(slug, label))`)
      .eq("status", "approved")
      .or(
        `title.ilike.%${query}%,outcome.ilike.%${query}%,case_number.ilike.%${query}%`,
      )
      .order("vote_score", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => rowToPost(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function fetchAgentCaseCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("agents!inner(slug)")
      .eq("status", "approved");

    const counts: Record<string, number> = {};
    for (const row of (data ?? []) as Array<{
      agents: { slug: string } | null;
    }>) {
      const slug = row.agents?.slug;
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export async function fetchTagCaseCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("post_tags")
      .select("tags!inner(slug), posts!inner(status)")
      .eq("posts.status", "approved");

    const counts: Record<string, number> = {};
    for (const row of (data ?? []) as Array<{
      tags: { slug: string } | null;
    }>) {
      const slug = row.tags?.slug;
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}
