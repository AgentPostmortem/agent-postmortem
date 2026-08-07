import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/utils/urls";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();
  const supabase = createSupabaseAdminClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("case_number, title, outcome, created_at, agents(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (posts ?? [])
    .map((p) => {
      const agent = p.agents as unknown as { name: string } | null;
      const url = `${siteUrl}/case/${p.case_number}`;
      const title = p.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const desc = (p.outcome ?? "")
        .slice(0, 200)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const agentName = (agent?.name ?? "Unknown Agent")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <category>${agentName}</category>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AgentPostmortem</title>
    <link>${siteUrl}</link>
    <description>A public ledger of AI agent failures. Real cases, real damages.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
