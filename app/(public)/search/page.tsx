import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { fetchSearchPosts } from "@/lib/db/posts";

export const metadata: Metadata = {
  title: "Search — AgentPostmortem",
  description: "Search AI agent failure cases by keyword.",
};

interface PageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = (searchParams.q ?? "").trim();
  const posts = query.length >= 2 ? await fetchSearchPosts(query) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Search</span>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-3xl font-normal text-text-primary">
          Search Cases
        </h1>
      </div>

      {/* Search form */}
      <form method="GET" action="/search" className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="deleted production database, hallucination, Claude…"
            autoFocus
            className="flex-1 rounded border border-border-default bg-bg-surface px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
          />
          <button
            type="submit"
            className="rounded border border-accent-red bg-accent-red-soft px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent-red transition-all hover:bg-accent-red hover:text-white"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {query.length >= 2 ? (
        posts.length > 0 ? (
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {posts.length} result{posts.length !== 1 ? "s" : ""} for &ldquo;
              {query}&rdquo;
            </div>
            <div className="space-y-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded border border-dashed border-border-default py-16 text-center">
            <p className="font-serif text-lg text-text-secondary">
              No cases found for &ldquo;{query}&rdquo;.
            </p>
            <p className="mt-2 text-sm text-text-tertiary">
              <Link href="/submit" className="text-accent-red hover:underline">
                File a report
              </Link>{" "}
              if you witnessed this failure.
            </p>
          </div>
        )
      ) : (
        <div className="rounded border border-dashed border-border-default py-16 text-center">
          <p className="text-sm text-text-tertiary">
            Enter at least 2 characters to search.
          </p>
        </div>
      )}
    </div>
  );
}
