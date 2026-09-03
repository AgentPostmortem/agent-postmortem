import { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AGENTS } from "@/lib/constants/agents";
import { TAGS } from "@/lib/constants/tags";
import { getSiteUrl } from "@/lib/utils/urls";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const supabase = createSupabaseAdminClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("case_number, created_at, updated_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const postUrls = (posts ?? []).map((p) => ({
    url: `${siteUrl}/case/${p.case_number}`,
    lastModified: new Date(p.updated_at ?? p.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/pilot", changeFrequency: "monthly", priority: 0.9 },
    { path: "/submit", changeFrequency: "yearly", priority: 0.5 },
    { path: "/about", changeFrequency: "yearly", priority: 0.4 },
    { path: "/agent", changeFrequency: "weekly", priority: 0.6 },
    { path: "/tag", changeFrequency: "weekly", priority: 0.6 },
    { path: "/hall-of-fame", changeFrequency: "daily", priority: 0.8 },
    { path: "/stats", changeFrequency: "weekly", priority: 0.6 },
    { path: "/tools", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${siteUrl}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...postUrls,
    ...AGENTS.map((a) => ({
      url: `${siteUrl}/agent/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...TAGS.map((t) => ({
      url: `${siteUrl}/tag/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
