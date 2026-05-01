"use client";

import Link from "next/link";
import { VoteButtons } from "./VoteButtons";
import { TagBadge } from "./TagBadge";
import type { Post } from "@/types";

type PostCardProps = { post: Post; commentCount?: number };

const SEVERITY_COLOR: Record<number, string> = {
  1: "bg-text-tertiary/40",
  2: "bg-text-tertiary/60",
  3: "bg-accent-red/50",
  4: "bg-accent-red/75",
  5: "bg-accent-red",
};

const SEVERITY_LABEL: Record<number, string> = {
  1: "MINIMAL",
  2: "LOW",
  3: "MODERATE",
  4: "SEVERE",
  5: "CRITICAL",
};

const SEVERITY_BORDER: Record<number, string> = {
  1: "border-l-text-tertiary/30",
  2: "border-l-text-tertiary/50",
  3: "border-l-accent-red/40",
  4: "border-l-accent-red/70",
  5: "border-l-accent-red",
};

export function PostCard({ post, commentCount }: PostCardProps) {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(post.createdAt));

  const cost =
    post.estimatedCostUsd != null
      ? post.estimatedCostUsd >= 1_000_000
        ? `$${(post.estimatedCostUsd / 1_000_000).toFixed(1)}M`
        : post.estimatedCostUsd >= 1_000
          ? `$${(post.estimatedCostUsd / 1_000).toFixed(0)}k`
          : `$${post.estimatedCostUsd}`
      : null;

  return (
    <article
      className={`group relative overflow-hidden rounded border border-border-default bg-bg-surface border-l-2 transition-all hover:border-border-strong hover:bg-bg-elevated ${SEVERITY_BORDER[post.damageLevel]}`}
    >
      <div className="flex">
        {/* Vote column */}
        <div className="flex w-11 shrink-0 flex-col items-center justify-start border-r border-border-default pt-3.5 pb-3">
          <VoteButtons postId={post.id} initialScore={post.voteScore} compact />
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1 px-4 py-3.5">
          {/* Case number row */}
          <div className="mb-2 flex items-center justify-between gap-3">
            {/* Left: metadata — truncates if too long */}
            <div className="flex min-w-0 items-center gap-x-2 overflow-hidden">
              <span className="shrink-0 font-mono text-[10px] tracking-widest text-text-tertiary">
                {post.caseNumber}
              </span>
              <span className="shrink-0 text-border-strong text-xs">·</span>
              <Link
                href={`/agent/${post.agentSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"
              >
                {post.agentName}
              </Link>
              <span className="shrink-0 text-border-strong text-xs">·</span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-widest ${post.damageLevel >= 4 ? "text-accent-red-muted" : "text-text-tertiary"}`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${SEVERITY_COLOR[post.damageLevel]}`}
                />
                {SEVERITY_LABEL[post.damageLevel]}
              </span>
              {cost && (
                <>
                  <span className="shrink-0 text-border-strong text-xs">·</span>
                  <span className="shrink-0 font-mono text-[10px] font-semibold text-accent-red-muted">
                    ~{cost}
                  </span>
                </>
              )}
            </div>

            {/* Right: date — never wraps */}
            <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
              {date}
            </span>
          </div>

          {/* Title */}
          <Link href={`/case/${post.caseNumber.toLowerCase()}`}>
            <h2 className="font-serif text-[1.05rem] leading-snug text-text-primary transition-colors group-hover:text-accent-red">
              {post.title}
            </h2>
          </Link>

          {/* Outcome */}
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {post.outcome}
          </p>

          {/* Tags + comment count */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {post.tags.length > 4 && (
              <span className="font-mono text-[10px] text-text-tertiary">
                +{post.tags.length - 4} more
              </span>
            )}
            <span className="ml-auto flex items-center gap-3">
              {!post.isAnonymous && post.authorHandle && (
                <span className="font-mono text-[10px] text-text-tertiary">
                  via @{post.authorHandle}
                </span>
              )}
              {commentCount != null && commentCount > 0 && (
                <span className="font-mono text-[10px] text-text-tertiary">
                  {commentCount} comment{commentCount !== 1 ? "s" : ""}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Severity bar at bottom — scales with damage level */}
      <div className="h-px w-full bg-border-default">
        <div
          className={`h-px transition-all ${SEVERITY_COLOR[post.damageLevel]}`}
          style={{ width: `${post.damageLevel * 20}%` }}
        />
      </div>
    </article>
  );
}
