import type { Metadata } from "next";
import { SearchResults } from "@/components/post/SearchResults";

export const metadata: Metadata = {
  title: "Search — AgentPostmortem",
  description: "Search AI agent failure cases by keyword.",
};

interface PageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: PageProps) {
  const initialQuery = (searchParams.q ?? "").trim();
  return <SearchResults initialQuery={initialQuery} />;
}
