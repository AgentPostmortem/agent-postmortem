import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { fetchFeedPosts, fetchSiteStats, type FeedTab } from "@/lib/db/posts";

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

interface PageProps {
  searchParams: { tab?: string };
}

export default async function HomePage({ searchParams }: PageProps) {
  const activeTab = (searchParams.tab as FeedTab) ?? "hot";
  const [posts, stats] = await Promise.all([
    fetchFeedPosts(activeTab),
    fetchSiteStats(),
  ]);

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
          Every AI Agent<br />
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
          <div className="mt-7 flex flex-wrap gap-px overflow-hidden rounded border border-border-default bg-border-default">
            {[
              { value: stats.totalPosts.toLocaleString(), label: "Cases Filed" },
              { value: formattedDamage ?? "—", label: "Estimated Damage", red: true },
              { value: stats.totalAgents.toString(), label: "Agents Implicated" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 bg-bg-surface px-5 py-3.5 min-w-[100px]">
                <div className={`font-mono text-2xl font-semibold tabular-nums ${stat.red ? "text-accent-red" : "text-text-primary"}`}>
                  {stat.value}
                </div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
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
          <div className="mb-5 border-b border-border-default">
            <nav className="flex overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <Link
                    key={tab.value}
                    href={tab.value === "hof" ? "/hall-of-fame" : `/?tab=${tab.value}`}
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

          {/* Cards */}
          {posts.length === 0 ? (
            <EmptyFeed />
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 space-y-5">
            <SidebarCard title="By Agent">
              {["Claude", "GPT-4o", "Devin", "Cursor", "Gemini"].map((name) => {
                const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
                return (
                  <Link
                    key={slug}
                    href={`/agent/${slug}`}
                    className="flex items-center justify-between py-1 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <span>{name}</span>
                    <span className="text-text-tertiary">→</span>
                  </Link>
                );
              })}
              <Link href="/agent" className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text-tertiary hover:text-accent-red">
                All agents →
              </Link>
            </SidebarCard>

            <SidebarCard title="Browse Tags">
              {[
                { slug: "hallucination", label: "Hallucination" },
                { slug: "deleted-data", label: "Deleted Data" },
                { slug: "security-fail", label: "Security Fail" },
                { slug: "wrong-recipient", label: "Wrong Recipient" },
                { slug: "expensive-mistake", label: "Expensive Mistake" },
              ].map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="block py-1 font-mono text-xs text-text-secondary transition-colors hover:text-accent-red"
                >
                  #{tag.label}
                </Link>
              ))}
            </SidebarCard>

            <SidebarCard title="Submit">
              <p className="mb-3 text-xs leading-relaxed text-text-tertiary">
                Witnessed an AI agent go wrong? File an anonymous case report.
              </p>
              <Link
                href="/submit"
                className="block rounded border border-accent-red bg-accent-red-soft px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-accent-red transition-all hover:bg-accent-red hover:text-white"
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

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
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
      <p className="font-serif text-lg text-text-secondary">No cases on file yet.</p>
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
