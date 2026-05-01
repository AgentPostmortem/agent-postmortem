"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import type { Post } from "@/types";

export function SearchResults({
  initialQuery,
  initialResults,
}: {
  initialQuery: string;
  initialResults: Post[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>(initialResults);
  const [status, setStatus] = useState<"idle" | "loading" | "done">(
    initialQuery.length >= 2 ? "done" : "idle",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render — we already have server-rendered results
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        setResults(json.posts ?? []);
        setStatus("done");
      } catch {
        setStatus("done");
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Update URL without navigation when query changes
  useEffect(() => {
    if (isFirstRender.current) return;
    const url =
      query.length >= 2 ? `/search?q=${encodeURIComponent(query)}` : "/search";
    window.history.replaceState(null, "", url);
  }, [query]);

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

      {/* Search input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="deleted production database, hallucination, Claude…"
          autoFocus
          className="w-full rounded border border-border-default bg-bg-surface px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
        />
      </div>

      {/* Results */}
      {query.length < 2 ? (
        <div className="rounded border border-dashed border-border-default py-16 text-center">
          <p className="text-sm text-text-tertiary">
            Start typing to search cases…
          </p>
        </div>
      ) : status === "loading" ? (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-text-tertiary">Searching…</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
            {query}&rdquo;
          </div>
          <div className="space-y-2">
            {results.map((post) => (
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
      )}
    </div>
  );
}
