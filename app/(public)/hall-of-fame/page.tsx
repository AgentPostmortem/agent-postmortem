import type { Metadata } from "next";
import Link from "next/link";
import { fetchFeedPosts } from "@/lib/db/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hall of Fame — Most Catastrophic AI Agent Failures",
  description:
    "The top 100 most catastrophic AI agent failures, ranked by community vote.",
};

const SEVERITY_COLOR: Record<number, string> = {
  1: "text-text-tertiary",
  2: "text-text-tertiary",
  3: "text-text-secondary",
  4: "text-accent-red/80",
  5: "text-accent-red",
};

const SEVERITY_LABEL: Record<number, string> = {
  1: "MINIMAL",
  2: "LOW",
  3: "MODERATE",
  4: "SEVERE",
  5: "CRITICAL",
};

export default async function HallOfFamePage() {
  const posts = await fetchFeedPosts("hof", 25);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="stamp stamp-red">Hall of Fame</span>
        </div>
        <h1 className="font-serif text-4xl font-normal text-text-primary">
          Most Catastrophic Failures
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          The top cases ranked by community vote. These are the incidents that
          define AI agent risk.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded border border-dashed border-border-default py-16 text-center">
          <p className="font-serif text-lg text-text-secondary">
            No cases on file yet.
          </p>
          <p className="mt-2 text-sm text-text-tertiary">
            <Link href="/submit" className="text-accent-red hover:underline">
              File the first report
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-border-default bg-bg-surface">
          {/* Header row */}
          <div className="flex items-center gap-4 border-b border-border-default bg-bg-elevated px-4 py-2">
            <span className="w-8 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              #
            </span>
            <span className="flex-1 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              Case
            </span>
            <span className="hidden w-24 text-right font-mono text-[9px] uppercase tracking-widest text-text-tertiary sm:inline">
              Severity
            </span>
            <span className="w-16 text-right font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              Score
            </span>
          </div>

          <ol>
            {posts.map((post, i) => {
              const isTop3 = i < 3;
              const cost =
                post.estimatedCostUsd != null
                  ? post.estimatedCostUsd >= 1_000_000
                    ? `$${(post.estimatedCostUsd / 1_000_000).toFixed(1)}M`
                    : post.estimatedCostUsd >= 1_000
                      ? `$${(post.estimatedCostUsd / 1_000).toFixed(0)}k`
                      : `$${post.estimatedCostUsd}`
                  : null;

              return (
                <li
                  key={post.id}
                  className={[
                    "flex items-center gap-4 border-b border-border-default px-4 py-3 transition-colors hover:bg-bg-elevated",
                    isTop3 && "bg-bg-elevated/50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0">
                    <span
                      className={[
                        "font-mono text-sm font-bold tabular-nums",
                        i === 0
                          ? "text-accent-red"
                          : i < 3
                            ? "text-text-secondary"
                            : "text-text-tertiary",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-mono text-[10px] text-text-tertiary">
                        {post.caseNumber}
                      </span>
                      <span className="text-border-strong">·</span>
                      <Link
                        href={`/agent/${post.agentSlug}`}
                        className="font-mono text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        {post.agentName}
                      </Link>
                      {cost && (
                        <>
                          <span className="text-border-strong">·</span>
                          <span className="font-mono text-[10px] font-semibold text-accent-red">
                            ~{cost}
                          </span>
                        </>
                      )}
                    </div>
                    <Link href={`/case/${post.caseNumber.toLowerCase()}`}>
                      <p
                        className={[
                          "mt-0.5 font-serif leading-snug text-text-primary transition-colors hover:text-accent-red",
                          isTop3 ? "text-base" : "text-sm",
                        ].join(" ")}
                      >
                        {post.title}
                      </p>
                    </Link>
                  </div>

                  {/* Severity */}
                  <div
                    className={`hidden w-24 text-right font-mono text-[10px] sm:block ${SEVERITY_COLOR[post.damageLevel]}`}
                  >
                    {SEVERITY_LABEL[post.damageLevel]}
                  </div>

                  {/* Score */}
                  <div className="w-16 text-right font-mono text-xs tabular-nums text-text-secondary">
                    {post.voteScore >= 1000
                      ? `${(post.voteScore / 1000).toFixed(1)}k`
                      : post.voteScore}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
