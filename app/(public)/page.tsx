import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import {
  fetchFeedPosts,
  fetchSiteStats,
  fetchCommentCountsByPostIds,
  type FeedTab,
} from "@/lib/db/posts";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "AgentPostmortem — AI Failure Case Files",
  description:
    "A public ledger of AI agent failures. Real cases, real damages, documented so the industry can learn.",
};

const TABS: { label: string; value: FeedTab }[] = [
  { label: "Hot", value: "hot" },
  { label: "New", value: "new" },
  { label: "This Week", value: "week" },
  { label: "All-Time", value: "hof" },
];

const AGENT_FILTERS = [
  { label: "All", value: "" },
  { label: "Claude", value: "claude" },
  { label: "OpenAI", value: "openai" },
  { label: "Devin", value: "devin" },
  { label: "Cursor", value: "cursor" },
  { label: "Gemini", value: "gemini" },
];

const SEVERITY_FILTERS = [
  { label: "All", value: "" },
  { label: "Critical (5)", value: "5" },
  { label: "Severe (4)", value: "4" },
  { label: "Moderate (3)", value: "3" },
];

interface PageProps {
  searchParams: {
    tab?: string;
    page?: string;
    agent?: string;
    severity?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const activeTab = (searchParams.tab as FeedTab) ?? "hot";
  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1") || 1);
  const activeAgent = searchParams.agent ?? "";
  const activeSeverity = searchParams.severity ?? "";

  const [{ posts, total }, stats] = await Promise.all([
    fetchFeedPosts(
      activeTab,
      currentPage,
      activeAgent || undefined,
      activeSeverity ? parseInt(activeSeverity) : undefined,
    ),
    fetchSiteStats(),
  ]);

  const commentCounts = await fetchCommentCountsByPostIds(
    posts.map((p) => p.id),
  );

  const totalPages = Math.ceil(total / 20);

  const formattedDamage =
    stats.totalDamage >= 1_000_000
      ? `$${(stats.totalDamage / 1_000_000).toFixed(1)}M`
      : stats.totalDamage >= 1_000
        ? `$${(stats.totalDamage / 1_000).toFixed(0)}k`
        : stats.totalDamage > 0
          ? `$${stats.totalDamage}`
          : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="mb-10 border-b border-border-default pb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="stamp stamp-red">Unrestricted</span>
          <span className="stamp stamp-muted">Public Registry</span>
        </div>

        <h1 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Every AI Agent
          <br />
          <span className="text-text-secondary">Failure,</span>{" "}
          <span className="relative">
            Documented.
            <span className="absolute -bottom-1 left-0 h-px w-full bg-accent-red/50" />
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-text-secondary">
          A structured public ledger for AI agent incidents. Submit anonymously.
          Every case numbered, tagged, and searchable. Built so the next team
          doesn&apos;t make the same mistake.
        </p>

        {/* Stats */}
        {(stats.totalPosts > 0 || formattedDamage) && (
          <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded border border-border-default bg-border-default">
            {[
              {
                value: stats.totalPosts.toLocaleString(),
                label: "Cases Filed",
              },
              {
                value: formattedDamage ?? "—",
                label: "Estimated Damage",
                red: true,
              },
              {
                value: stats.totalAgents.toString(),
                label: "Agents Implicated",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-bg-surface px-3 py-3 sm:px-5 sm:py-3.5"
              >
                <div
                  className={`font-mono text-lg font-semibold tabular-nums sm:text-2xl ${stat.red ? "text-accent-red" : "text-text-primary"}`}
                >
                  {stat.value}
                </div>
                <div className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-text-tertiary sm:text-[9px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search bar */}
        <form method="GET" action="/search" className="mt-6">
          <div className="flex max-w-lg gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search cases… deleted database, hallucination, OpenAI"
              className="flex-1 rounded border border-border-default bg-bg-surface px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
            />
            <button
              type="submit"
              className="rounded border border-border-default bg-bg-elevated px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-red hover:text-accent-red"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded border border-accent-red bg-accent-red-soft px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent-red transition-all hover:bg-accent-red hover:text-white"
          >
            <span>+</span> File a Case Report
          </Link>
          <Link
            href="/about"
            className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
          >
            How it works →
          </Link>
        </div>
      </div>

      {/* Feed layout */}
      <div className="flex gap-8">
        {/* Main feed */}
        <div className="min-w-0 flex-1">
          {/* Tabs */}
          <div className="mb-3 border-b border-border-default">
            <nav className="flex overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <Link
                    key={tab.value}
                    href={
                      tab.value === "hof"
                        ? "/hall-of-fame"
                        : `/?tab=${tab.value}${activeAgent ? `&agent=${activeAgent}` : ""}${activeSeverity ? `&severity=${activeSeverity}` : ""}`
                    }
                    className={[
                      "relative pb-3 pr-5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                      isActive
                        ? "text-text-primary after:absolute after:bottom-0 after:left-0 after:right-5 after:h-0.5 after:bg-accent-red"
                        : "text-text-tertiary hover:text-text-secondary",
                    ].join(" ")}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Filter bar */}
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Agent filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Agent
              </span>
              <div className="flex flex-wrap gap-1">
                {AGENT_FILTERS.map((f) => {
                  const isActive = activeAgent === f.value;
                  const href = `/?tab=${activeTab}${f.value ? `&agent=${f.value}` : ""}${activeSeverity ? `&severity=${activeSeverity}` : ""}`;
                  return (
                    <Link
                      key={f.value || "all-agent"}
                      href={href}
                      className={[
                        "rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors",
                        isActive
                          ? "border-accent-red bg-accent-red-soft text-accent-red"
                          : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
                      ].join(" ")}
                    >
                      {f.label}
                    </Link>
                  );
                })}
                {activeAgent && (
                  <Link
                    href={`/?tab=${activeTab}${activeSeverity ? `&severity=${activeSeverity}` : ""}`}
                    className="rounded border border-border-default px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary transition-colors hover:border-accent-red hover:text-accent-red"
                    title="Clear agent filter"
                  >
                    ×
                  </Link>
                )}
              </div>
            </div>

            {/* Severity filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Severity
              </span>
              <div className="flex flex-wrap gap-1">
                {SEVERITY_FILTERS.map((f) => {
                  const isActive = activeSeverity === f.value;
                  const href = `/?tab=${activeTab}${activeAgent ? `&agent=${activeAgent}` : ""}${f.value ? `&severity=${f.value}` : ""}`;
                  return (
                    <Link
                      key={f.value || "all-severity"}
                      href={href}
                      className={[
                        "rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors",
                        isActive
                          ? "border-accent-red bg-accent-red-soft text-accent-red"
                          : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
                      ].join(" ")}
                    >
                      {f.label}
                    </Link>
                  );
                })}
                {activeSeverity && (
                  <Link
                    href={`/?tab=${activeTab}${activeAgent ? `&agent=${activeAgent}` : ""}`}
                    className="rounded border border-border-default px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary transition-colors hover:border-accent-red hover:text-accent-red"
                    title="Clear severity filter"
                  >
                    ×
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Cards */}
          {posts.length === 0 ? (
            <EmptyFeed />
          ) : (
            <>
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    commentCount={commentCounts[post.id]}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hrefForPage={(p) => {
                    const params = new URLSearchParams();
                    params.set("tab", activeTab);
                    if (p > 1) params.set("page", String(p));
                    if (activeAgent) params.set("agent", activeAgent);
                    if (activeSeverity) params.set("severity", activeSeverity);
                    return `/?${params.toString()}`;
                  }}
                />
              )}
            </>
          )}

          {/* Mobile browse strip — hidden on desktop where sidebar handles this */}
          <div className="mt-8 border-t border-border-default pt-6 lg:hidden">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
              Browse by Agent
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Claude", slug: "claude" },
                { name: "OpenAI", slug: "openai" },
                { name: "Devin", slug: "devin" },
                { name: "Cursor", slug: "cursor" },
                { name: "Gemini", slug: "gemini" },
              ].map(({ name, slug }) => (
                <Link
                  key={slug}
                  href={`/agent/${slug}`}
                  className="rounded border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                >
                  {name}
                </Link>
              ))}
              <Link
                href="/agent"
                className="rounded border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-[11px] text-text-tertiary transition-colors hover:text-accent-red"
              >
                All →
              </Link>
            </div>
            <div className="mb-3 mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
              Browse by Tag
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "hallucination",
                "deleted-data",
                "security-fail",
                "wrong-recipient",
                "expensive-mistake",
              ].map((slug) => (
                <Link
                  key={slug}
                  href={`/tag/${slug}`}
                  className="rounded border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-strong hover:text-accent-red"
                >
                  #{slug}
                </Link>
              ))}
              <Link
                href="/tag"
                className="rounded border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-[11px] text-text-tertiary transition-colors hover:text-accent-red"
              >
                All →
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 space-y-5">
            <SidebarCard title="By Agent">
              {[
                { name: "Claude", slug: "claude" },
                { name: "OpenAI", slug: "openai" },
                { name: "Devin", slug: "devin" },
                { name: "Cursor", slug: "cursor" },
                { name: "Gemini", slug: "gemini" },
              ].map(({ name, slug }) => {
                return (
                  <Link
                    key={slug}
                    href={`/agent/${slug}`}
                    className="flex items-center justify-between py-2 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <span>{name}</span>
                    <span className="text-text-tertiary">→</span>
                  </Link>
                );
              })}
              <Link
                href="/agent"
                className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text-tertiary hover:text-accent-red"
              >
                All agents →
              </Link>
            </SidebarCard>

            <SidebarCard title="Browse Tags">
              {[
                "hallucination",
                "deleted-data",
                "security-fail",
                "wrong-recipient",
                "expensive-mistake",
              ].map((slug) => (
                <Link
                  key={slug}
                  href={`/tag/${slug}`}
                  className="block py-2 font-mono text-xs text-text-secondary transition-colors hover:text-accent-red"
                >
                  #{slug}
                </Link>
              ))}
              <Link
                href="/tag"
                className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text-tertiary hover:text-accent-red"
              >
                All tags →
              </Link>
            </SidebarCard>

            <SidebarCard title="Submit">
              <p className="mb-3 text-xs leading-relaxed text-text-tertiary">
                Witnessed an AI agent go wrong? File an anonymous case report.
              </p>
              <Link
                href="/submit"
                className="block rounded border border-accent-red bg-accent-red-soft px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-accent-red-muted transition-all hover:bg-accent-red hover:text-white"
              >
                + File Report
              </Link>
            </SidebarCard>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-border-default bg-bg-surface p-4">
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="rounded border border-dashed border-border-default py-16 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded border border-border-strong">
        <span className="font-mono text-text-tertiary">✕</span>
      </div>
      <p className="font-serif text-lg text-text-secondary">
        No cases on file yet.
      </p>
      <p className="mt-2 text-sm text-text-tertiary">
        Connect Supabase or{" "}
        <Link href="/submit" className="text-accent-red hover:underline">
          file the first report
        </Link>
        .
      </p>
    </div>
  );
}
