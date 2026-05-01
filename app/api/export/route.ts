import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function escapeCell(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "case_number, title, outcome, damage_level, estimated_cost_usd, vote_score, created_at, is_anonymous, submitter_handle, agents(name, company), post_tags(tags(slug))",
    )
    .eq("status", "approved")
    .order("vote_score", { ascending: false })
    .limit(1000);

  if (error || !data) {
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }

  const headers = [
    "case_number",
    "title",
    "agent",
    "company",
    "damage_level",
    "estimated_cost_usd",
    "vote_score",
    "tags",
    "author",
    "created_at",
    "outcome",
  ];

  const rows = (
    data as Array<{
      case_number: string;
      title: string;
      outcome: string;
      damage_level: number;
      estimated_cost_usd: number | null;
      vote_score: number;
      created_at: string;
      is_anonymous: boolean;
      submitter_handle: string | null;
      agents: { name: string; company: string } | null;
      post_tags: Array<{ tags: { slug: string } | null }>;
    }>
  ).map((row) => {
    const tags = (row.post_tags ?? [])
      .map((pt) => pt.tags?.slug)
      .filter(Boolean)
      .join("|");
    const author =
      row.is_anonymous || !row.submitter_handle
        ? "anonymous"
        : row.submitter_handle;

    return [
      escapeCell(row.case_number),
      escapeCell(row.title),
      escapeCell(row.agents?.name),
      escapeCell(row.agents?.company),
      escapeCell(row.damage_level),
      escapeCell(row.estimated_cost_usd),
      escapeCell(row.vote_score),
      escapeCell(tags),
      escapeCell(author),
      escapeCell(row.created_at),
      escapeCell(row.outcome),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agentpostmortem-cases-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
