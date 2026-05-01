import { NextRequest, NextResponse } from "next/server";
import { fetchSearchPosts } from "@/lib/db/posts";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ posts: [] });
  }
  const posts = await fetchSearchPosts(q);
  return NextResponse.json({ posts });
}
