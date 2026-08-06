import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CaseRow } from "@/components/post/CaseRow";
import { Pagination } from "@/components/ui/Pagination";
import { FeaturedCase } from "@/components/home/FeaturedCase";
import { MastheadAnchor } from "@/components/home/MastheadAnchor";
import {
  AgentPanel,
  FailureModePanel,
  SeverityPanel,
  TimelinePanel,
} from "@/components/home/OverviewPanels";
import { ArrowRightIcon, CloseIcon, PlusIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  fetchFeedPosts,
  fetchRegistryOverview,
  fetchWorstCase,
  fetchCommentCountsByPostIds,
  type FeedTab,
  type RegistryOverview,
} from "@/lib/db/posts";
import { formatUsd, monthLabel, percentOf } from "@/lib/utils/format";
import type { Post } from "@/types";

// Both the overview and the taxonomy index read the same aggregate; memoise it
// per request so the page issues one query, not two.
const getOverview = cache(() => fetchRegistryOverview());

export const revalidate = 30;

export const metadata: Metadata = {
  title: "AgentPostmortem — AI Failure Case Files",
  description:
    "A public ledger of AI agent failures. Real cases, real damages, documented so the industry can learn.",
  alternates: {
    canonical: "/",
  },
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

/* ---------------------------------------------------------------- overview */

/** Splits "$542.2M" into its numeral and its magnitude suffix for display. */
function splitFigure(value: string): { head: string; suffix: string } {
  const match = /^(\$[\d.,]+)([A-Za-z]*)$/.exec(value);
  if (!match) return { head: value, suffix: "" };
  return { head: match[1], suffix: match[2] };
}

function CounterStrip({ data }: { data: RegistryOverview }) {
  const damage = formatUsd(data.totalDamageUsd);
  const severe = (data.bySeverity[5] ?? 0) + (data.bySeverity[4] ?? 0);

  const items = [
    { value: data.totalCases.toLocaleString(), label: "Cases on file" },
    {
      value: `${severe.toLocaleString()}`,
      label: `Severe or worse (${percentOf(severe, data.totalCases)}%)`,
    },
    { value: data.byAgent.length.toString(), label: "Agents implicated" },
  ];

  const figure = damage ? splitFigure(damage) : null;

  return (
    <dl className="grid gap-px overflow-hidden rounded-sm border border-border-strong bg-border-default lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      {figure && (
        <div className="plate-deep relative flex min-w-0 flex-col justify-center px-6 py-9 sm:px-9 sm:py-11">
          <div
            aria-hidden="true"
            className="aura left-2 top-2 h-40 w-64 sm:h-52 sm:w-96"
          />
          <dt className="relative font-mono text-[9px] uppercase tracking-[0.22em] text-accent/80">
            Total documented damage
          </dt>
          <dd className="relative mt-4">
            <span className="figure-display block text-[4.25rem] font-semibold sm:text-[6rem] lg:text-[7.5rem]">
              {figure.head}
              {figure.suffix && (
                <span className="text-[0.44em] font-medium tracking-[0.02em]">
                  {figure.suffix}
                </span>
              )}
            </span>
            <span className="mt-5 block max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-text-tertiary">
              Damage across {data.quantifiedCases} quantified cases
            </span>
          </dd>
        </div>
      )}

      <div className="plate grid min-w-0 grid-cols-1 gap-px bg-border-default sm:grid-cols-3 lg:grid-cols-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="min-w-0 bg-bg-surface/60 px-6 py-5 sm:px-6 sm:py-6"
          >
            <dt className="sr-only">{item.label}</dt>
            <dd className="flex items-baseline justify-between gap-4 lg:block">
              <span className="block font-mono text-[1.75rem] font-medium leading-none tabular-nums text-text-primary sm:text-[2.125rem]">
                {item.value}
              </span>
              <span
                aria-hidden="true"
                className="block max-w-[22ch] text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-text-tertiary lg:mt-2.5 lg:text-left"
              >
                {item.label}
              </span>
            </dd>
          </div>
        ))}
      </div>
    </dl>
  );
}

async function RegistryOverviewSection() {
  const data = await getOverview();
  if (data.totalCases === 0) return null;

  return (
    <section aria-labelledby="overview-heading" className="mt-10">
      <CounterStrip data={data} />

      <div className="section-gap">
        <SectionHeading
          id="overview-heading"
          title="What the registry shows"
          meta={
            <Link
              href="/stats"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              Full stats <ArrowRightIcon size={9} />
            </Link>
          }
        />
      </div>

      <div className="grid gap-px overflow-hidden rounded-sm border border-border-strong bg-border-default md:grid-cols-2 xl:grid-cols-4">
        <SeverityPanel data={data} />
        <FailureModePanel data={data} />
        <AgentPanel data={data} />
        <TimelinePanel data={data} />
      </div>
    </section>
  );
}

async function MastheadAnchorSection() {
  const data = await getOverview();
  return <MastheadAnchor data={data} />;
}

function OverviewSkeleton() {
  return (
    <div className="mt-10 space-y-6">
      <div className="h-[96px] animate-pulse bg-bg-surface" />
      <div className="grid gap-px bg-border-default md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse bg-bg-surface" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ feed */

interface FeedGroup {
  key: string;
  title: string;
  note: string;
  posts: Post[];
}

const SEVERITY_BANDS: { key: string; title: string; levels: number[] }[] = [
  { key: "critical", title: "Critical and severe", levels: [5, 4] },
  { key: "significant", title: "Significant", levels: [3] },
  { key: "contained", title: "Contained", levels: [2, 1] },
];

/**
 * The feed is clustered rather than flat. New cases group by filing month,
 * everything else groups by severity band, so a visitor can see the shape of
 * the page before reading a single title.
 */
function groupPosts(posts: Post[], tab: FeedTab): FeedGroup[] {
  if (tab === "new" || tab === "week") {
    const byMonth = new Map<string, Post[]>();
    for (const post of posts) {
      const month = post.createdAt.slice(0, 7);
      byMonth.set(month, [...(byMonth.get(month) ?? []), post]);
    }
    return Array.from(byMonth.entries()).map(([month, group]) => ({
      key: month,
      title: monthLabel(month),
      note: `${group.length} filed`,
      posts: group,
    }));
  }

  return SEVERITY_BANDS.map((band) => {
    const group = posts.filter((p) => band.levels.includes(p.damageLevel));
    return {
      key: band.key,
      title: band.title,
      note: `severity ${band.levels.slice().sort().join("–")}`,
      posts: group,
    };
  }).filter((g) => g.posts.length > 0);
}

async function PostsFeed({
  activeTab,
  currentPage,
  activeAgent,
  activeSeverity,
}: {
  activeTab: FeedTab;
  currentPage: number;
  activeAgent: string;
  activeSeverity: string;
}) {
  const { posts, total } = await fetchFeedPosts(
    activeTab,
    currentPage,
    activeAgent || undefined,
    activeSeverity ? parseInt(activeSeverity) : undefined,
  );

  const commentCounts = await fetchCommentCountsByPostIds(
    posts.map((p) => p.id),
  );

  const totalPages = Math.ceil(total / 20);
  if (posts.length === 0) return <EmptyFeed />;

  const groups = groupPosts(posts, activeTab);

  return (
    <>
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
        Showing {posts.length} of {total.toLocaleString()} cases, grouped by{" "}
        {activeTab === "new" || activeTab === "week"
          ? "filing month"
          : "severity band"}
        .
      </p>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.key} aria-label={group.title}>
            <div className="flex items-baseline justify-between gap-3 border-b border-border-strong pb-2">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary">
                {group.title}
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                {group.posts.length} case{group.posts.length === 1 ? "" : "s"} ·{" "}
                {group.note}
              </span>
            </div>
            {/* Column headers make the rows comparable, not just readable */}
            <div className="hidden grid-cols-[7.5rem_minmax(0,1fr)_9rem_7rem_6rem] gap-x-6 border-b border-border-default px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-text-tertiary sm:grid">
              <span>Case / severity</span>
              <span>Incident</span>
              <span>Agent</span>
              <span className="text-right">Damage</span>
              <span className="text-right">Filed</span>
            </div>
            <div className="divide-y divide-border-default border-b border-border-default">
              {group.posts.map((post) => (
                <CaseRow
                  key={post.id}
                  post={post}
                  commentCount={commentCounts[post.id]}
                />
              ))}
            </div>
          </section>
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
  );
}

function PostsSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 animate-pulse bg-bg-surface" />
      ))}
    </div>
  );
}

async function FeaturedCaseSection() {
  const post = await fetchWorstCase();
  if (!post) return null;
  return (
    <section aria-labelledby="featured-heading" className="section-gap">
      <SectionHeading id="featured-heading" title="Featured case" />
      <FeaturedCase post={post} />
    </section>
  );
}

function FeaturedSkeleton() {
  return <div className="section-gap h-56 animate-pulse bg-bg-surface" />;
}

/* -------------------------------------------------------------- taxonomy */

async function TaxonomySection() {
  const data = await getOverview();
  if (data.totalCases === 0) return null;

  const maxTag = Math.max(...data.byTag.map((t) => t.count), 1);

  return (
    <section aria-labelledby="taxonomy-heading" className="section-gap">
      <SectionHeading
        id="taxonomy-heading"
        title="Browse the taxonomy"
        meta={`${data.byTag.length} failure modes · ${data.byAgent.length} agents`}
      />

      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
        Failure modes
      </h3>
      <ul className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-3">
        {data.byTag.map((tag) => (
          <li key={tag.slug}>
            <Link
              href={`/tag/${tag.slug}`}
              className="block bg-bg-canvas px-4 py-3.5 transition-colors hover:bg-bg-surface"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="truncate font-mono text-xs text-text-secondary">
                  #{tag.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-text-primary">
                  {tag.count}
                </span>
              </span>
              <span className="mt-2 block h-px w-full bg-border-default">
                <span
                  className="block h-px bg-text-tertiary"
                  style={{
                    width: `${Math.max(2, Math.round((tag.count / maxTag) * 100))}%`,
                  }}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="mb-3 mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
        Agents
      </h3>
      <ul className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-4">
        {data.byAgent.map((agent) => {
          const damage = formatUsd(agent.damageUsd);
          return (
            <li key={agent.slug}>
              <Link
                href={`/agent/${agent.slug}`}
                className="block bg-bg-canvas px-4 py-3.5 transition-colors hover:bg-bg-surface"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-mono text-xs text-text-primary">
                    {agent.label}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-text-primary">
                    {agent.count}
                  </span>
                </span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                  {agent.severeCount} severe+
                  {damage ? ` · ${damage}` : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ page */

export default function HomePage({ searchParams }: PageProps) {
  const activeTab = (searchParams.tab as FeedTab) ?? "hot";
  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1") || 1);
  const activeAgent = searchParams.agent ?? "";
  const activeSeverity = searchParams.severity ?? "";

  return (
    <div className="shell py-12 sm:py-16">
      {/* Masthead: compact, so the data starts above the fold */}
      <header className="relative isolate border-b border-border-default pb-12">
        {/* Glow bleed is clipped so the page never scrolls sideways */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="aura -left-24 -top-32 h-[26rem] w-[38rem] opacity-70"
          />
        </div>
        <div className="relative mb-6 flex flex-wrap items-center gap-2">
          <span className="stamp stamp-red">Unrestricted</span>
          <span className="stamp stamp-muted">Public Registry</span>
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <h1 className="max-w-[15ch] font-serif text-[2.75rem] font-semibold leading-[0.94] tracking-[-0.028em] text-text-primary sm:text-[4rem] lg:text-[5rem]">
              Every AI Agent{" "}
              <span className="text-text-secondary">Failure,</span>{" "}
              <span className="relative text-accent">
                Documented.
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full bg-accent/60"
                />
              </span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-base leading-[1.7] text-text-secondary sm:text-[1.0625rem]">
              A structured public ledger for AI agent incidents. Submit
              anonymously. Every case numbered, tagged, and searchable. Built so
              the next team doesn&apos;t make the same mistake.
            </p>
          </div>

          <div className="lg:justify-self-end lg:text-right">
            <form method="GET" action="/search">
              <label htmlFor="registry-search" className="sr-only">
                Search cases
              </label>
              <div className="flex gap-2">
                <input
                  id="registry-search"
                  type="text"
                  name="q"
                  placeholder="Search cases…"
                  className="min-w-0 flex-1 rounded-sm border border-border-default bg-bg-surface px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-sm border border-border-default bg-bg-elevated px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-sm border border-accent/60 bg-accent-soft px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-bg-canvas"
              >
                <PlusIcon size={10} /> File a Case Report
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
              >
                How it works <ArrowRightIcon size={10} />
              </Link>
            </div>

            {/* Visual anchor, drawn entirely from approved case rows */}
            <div className="mt-8 text-left">
              <Suspense fallback={null}>
                <MastheadAnchorSection />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Data overview leads the page, ahead of any individual case */}
      <Suspense fallback={<OverviewSkeleton />}>
        <RegistryOverviewSection />
      </Suspense>

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedCaseSection />
      </Suspense>

      {/* Clustered case feed */}
      <section aria-labelledby="feed-heading" className="section-gap">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-border-default">
          <h2
            id="feed-heading"
            className="pb-3 font-serif text-[1.625rem] font-semibold leading-none tracking-[-0.02em] text-text-primary sm:text-[2.125rem]"
          >
            Case feed
          </h2>
          <nav
            aria-label="Feed sort"
            className="flex overflow-x-auto scrollbar-none"
          >
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
                    "relative pb-3 pl-6 font-mono text-[11px] uppercase tracking-wider transition-colors",
                    isActive
                      ? "text-text-primary after:absolute after:bottom-0 after:left-6 after:right-0 after:h-0.5 after:bg-accent"
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
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
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
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                      isActive
                        ? "border-accent bg-accent-soft text-accent"
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
                  className="rounded-sm border border-border-default px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary transition-colors hover:border-accent hover:text-accent"
                  title="Clear agent filter"
                >
                  <CloseIcon size={9} />
                </Link>
              )}
            </div>
          </div>

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
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                      isActive
                        ? "border-accent bg-accent-soft text-accent"
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
                  className="rounded-sm border border-border-default px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary transition-colors hover:border-accent hover:text-accent"
                  title="Clear severity filter"
                >
                  <CloseIcon size={9} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <Suspense fallback={<PostsSkeleton />}>
          <PostsFeed
            activeTab={activeTab}
            currentPage={currentPage}
            activeAgent={activeAgent}
            activeSeverity={activeSeverity}
          />
        </Suspense>
      </section>

      {/* Taxonomy promoted from sidebar chips to a full browsable index */}
      <Suspense fallback={null}>
        <TaxonomySection />
      </Suspense>

      <section className="section-gap border-t border-border-default pt-10">
        <h2 className="font-serif text-2xl font-medium tracking-[-0.015em] text-text-primary">
          Witnessed an AI agent go wrong?
        </h2>
        <p className="mt-3 max-w-[52ch] text-[0.95rem] leading-relaxed text-text-secondary">
          File an anonymous case report. Every submission is reviewed, numbered,
          and added to the public record.
        </p>
        <Link
          href="/submit"
          className="mt-6 inline-flex items-center gap-2 rounded-sm border border-accent/60 bg-accent-soft px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-bg-canvas"
        >
          <PlusIcon size={10} /> File Report
        </Link>
      </section>
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="border border-dashed border-border-default py-20 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-border-strong">
        <span className="text-text-tertiary">
          <CloseIcon size={14} />
        </span>
      </div>
      <p className="font-serif text-lg font-medium text-text-secondary">
        No cases on file yet.
      </p>
      <p className="mt-2 text-sm text-text-tertiary">
        Connect Supabase or{" "}
        <Link href="/submit" className="text-accent hover:underline">
          file the first report
        </Link>
        .
      </p>
    </div>
  );
}
