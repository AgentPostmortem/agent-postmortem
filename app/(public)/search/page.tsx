import type { Metadata } from "next";
import { SearchResults } from "@/components/post/SearchResults";
import { fetchSearchPosts } from "@/lib/db/posts";

export const metadata: Metadata = {
  title: "Search — AgentPostmortem",
  description: "Search AI agent failure cases by keyword.",
};

interface PageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const initialQuery = (searchParams.q ?? "").trim();
  const initialResults =
    initialQuery.length >= 2 ? await fetchSearchPosts(initialQuery) : [];

  return (
    <SearchResults
      initialQuery={initialQuery}
      initialResults={initialResults}
    />
  );
}
