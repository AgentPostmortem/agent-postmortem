import { NextRequest, NextResponse } from "next/server";
import { fetchSearchPosts } from "@/lib/db/posts";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ posts: [] });
  }

  const agentSlug = params.get("agent") ?? undefined;
  const minSev = params.get("minSeverity");
  const maxSev = params.get("maxSeverity");

  const posts = await fetchSearchPosts(q, {
    agentSlug: agentSlug || undefined,
    minSeverity: minSev ? parseInt(minSev, 10) : undefined,
    maxSeverity: maxSev ? parseInt(maxSev, 10) : undefined,
  });

  return NextResponse.json({ posts });
}
