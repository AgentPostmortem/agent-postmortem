"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { AGENTS } from "@/lib/constants/agents";
import {
  isSeverityLevel,
  SEVERITY_LABELS,
  type SeverityLevel,
} from "@/lib/constants/severity";
import type { Post } from "@/types";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icons";

interface SearchResponse {
  posts?: Post[];
}

const SEVERITY_LEVELS: SeverityLevel[] = [1, 2, 3, 4, 5];

export function SearchResults({
  initialQuery,
  initialResults,
}: {
  initialQuery: string;
  initialResults: Post[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [agentFilter, setAgentFilter] = useState("");
  const [minSeverity, setMinSeverity] = useState<SeverityLevel>(1);
  const [maxSeverity, setMaxSeverity] = useState<SeverityLevel>(5);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [results, setResults] = useState<Post[]>(initialResults);
  const [status, setStatus] = useState<"idle" | "loading" | "done">(
    initialQuery.length >= 2 ? "done" : "idle",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const hasActiveFilters =
    agentFilter !== "" || minSeverity !== 1 || maxSeverity !== 5;

  function buildUrl(q: string) {
    const p = new URLSearchParams();
    if (q.length >= 2) p.set("q", q);
    if (agentFilter) p.set("agent", agentFilter);
    if (minSeverity !== 1) p.set("minSeverity", String(minSeverity));
    if (maxSeverity !== 5) p.set("maxSeverity", String(maxSeverity));
    const qs = p.toString();
    return qs ? `/search?${qs}` : "/search";
  }

  function buildApiUrl(q: string) {
    const p = new URLSearchParams({ q });
    if (agentFilter) p.set("agent", agentFilter);
    if (minSeverity !== 1) p.set("minSeverity", String(minSeverity));
    if (maxSeverity !== 5) p.set("maxSeverity", String(maxSeverity));
    return `/api/search?${p.toString()}`;
  }

  useEffect(() => {
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
        const res = await fetch(buildApiUrl(query));
        const json = (await res.json()) as SearchResponse;
        setResults(json.posts ?? []);
        setStatus("done");
      } catch {
        setStatus("done");
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, agentFilter, minSeverity, maxSeverity]);

  useEffect(() => {
    if (isFirstRender.current) return;
    window.history.replaceState(null, "", buildUrl(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, agentFilter, minSeverity, maxSeverity]);

  return (
    <div className="shell py-12 sm:py-16">
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
      <div className="mb-3">
        <label className="sr-only" htmlFor="case-search">
          Search cases
        </label>
        <input
          id="case-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="deleted production database, hallucination, Claude…"
          autoFocus
          className="w-full rounded-sm border border-border-default bg-bg-surface px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        />
      </div>

      {/* Filter toggle */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary hover:text-text-secondary"
        >
          <span>
            {filtersOpen ? (
              <ChevronUpIcon size={9} />
            ) : (
              <ChevronDownIcon size={9} />
            )}
          </span>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded bg-accent/20 px-1 py-px text-accent">
              active
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setAgentFilter("");
              setMinSeverity(1);
              setMaxSeverity(5);
            }}
            className="font-mono text-[10px] text-text-tertiary hover:text-accent"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 rounded-sm border border-border-default bg-bg-surface px-5 py-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Agent filter */}
            <div>
              <label
                htmlFor="filter-agent"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary"
              >
                Agent
              </label>
              <select
                id="filter-agent"
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-elevated px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
              >
                <option value="">All agents</option>
                {AGENTS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity range */}
            <div>
              <span
                id="filter-severity-label"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary"
              >
                Severity —{" "}
                {minSeverity === maxSeverity
                  ? SEVERITY_LABELS[minSeverity]
                  : `${SEVERITY_LABELS[minSeverity]} to ${SEVERITY_LABELS[maxSeverity]}`}
              </span>
              <div className="flex items-center gap-3">
                <div
                  role="group"
                  aria-labelledby="filter-severity-label"
                  className="flex gap-1"
                >
                  {SEVERITY_LEVELS.map((lvl) => {
                    const inRange = lvl >= minSeverity && lvl <= maxSeverity;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        aria-pressed={inRange}
                        aria-label={`Severity ${lvl}: ${SEVERITY_LABELS[lvl]}`}
                        onClick={() => {
                          if (lvl < minSeverity) {
                            setMinSeverity(lvl);
                          } else if (lvl > maxSeverity) {
                            setMaxSeverity(lvl);
                          } else if (
                            lvl === minSeverity &&
                            lvl === maxSeverity
                          ) {
                            setMinSeverity(1);
                            setMaxSeverity(5);
                          } else if (lvl === minSeverity) {
                            const nextLevel = lvl + 1;
                            if (isSeverityLevel(nextLevel)) {
                              setMinSeverity(nextLevel);
                            }
                          } else if (lvl === maxSeverity) {
                            const previousLevel = lvl - 1;
                            if (isSeverityLevel(previousLevel)) {
                              setMaxSeverity(previousLevel);
                            }
                          } else {
                            setMinSeverity(lvl);
                            setMaxSeverity(lvl);
                          }
                        }}
                        className={[
                          "flex h-8 w-8 items-center justify-center rounded-sm border font-mono text-xs transition-colors",
                          inRange
                            ? "border-accent bg-accent/10 text-accent-strong"
                            : "border-border-default bg-bg-elevated text-text-tertiary hover:border-border-strong",
                        ].join(" ")}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {query.length < 2 ? (
        <div className="rounded-sm border border-dashed border-border-default py-16 text-center">
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
            {hasActiveFilters && " (filtered)"}
          </div>
          <div className="space-y-2">
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-border-default py-16 text-center">
          <p className="font-serif text-lg text-text-secondary">
            No cases found for &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-2 text-sm text-text-tertiary">
            <Link href="/submit" className="text-accent hover:underline">
              File a report
            </Link>{" "}
            if you witnessed this failure.
          </p>
        </div>
      )}
    </div>
  );
}
