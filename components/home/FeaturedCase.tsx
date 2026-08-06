import Link from "next/link";
import { SeverityPill } from "@/components/post/SeverityPill";
import { TagBadge } from "@/components/post/TagBadge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SEVERITY_DESCRIPTIONS } from "@/lib/constants/severity";
import { formatUsd } from "@/lib/utils/format";
import { incidentDate } from "@/lib/utils/incident-date";
import type { Post } from "@/types";

/**
 * The single worst case on file, given full-width editorial treatment so the
 * feed is not a wall of identical rows.
 */
export function FeaturedCase({ post }: { post: Post }) {
  const cost = formatUsd(post.estimatedCostUsd);
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(incidentDate(post)));

  return (
    <article className="plate relative rounded-sm border border-border-strong bg-bg-surface/40 px-5 sm:px-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-default py-3">
        <span className="stamp stamp-red">Worst on file</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-text-tertiary">
          {post.caseNumber}
        </span>
        <SeverityPill level={post.damageLevel} />
        <span className="ml-auto font-mono text-[10px] text-text-tertiary">
          {date}
        </span>
      </div>

      <div className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <h3 className="max-w-[24ch] font-serif text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-text-primary sm:text-[2rem]">
            <Link
              href={`/case/${post.caseNumber.toLowerCase()}`}
              className="transition-colors hover:text-accent"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 max-w-[62ch] text-[0.95rem] leading-[1.7] text-text-secondary">
            {post.outcome}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 5).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <Link
            href={`/case/${post.caseNumber.toLowerCase()}`}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent hover:text-accent-strong"
          >
            Read the case file <ArrowRightIcon size={10} />
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-px self-start bg-border-default lg:grid-cols-1">
          <div className="bg-bg-canvas px-4 py-3">
            <dt className="meta-key">Agent</dt>
            <dd className="meta-val mt-0.5 truncate">{post.agentName}</dd>
          </div>
          <div className="bg-bg-canvas px-4 py-3">
            <dt className="meta-key">Est. damage</dt>
            <dd className="meta-val mt-0.5">
              {cost ? `~${cost}` : "Not quantified"}
            </dd>
          </div>
          <div className="col-span-2 bg-bg-canvas px-4 py-3 lg:col-span-1">
            <dt className="meta-key">Impact</dt>
            <dd className="mt-1 text-[0.75rem] leading-relaxed text-text-secondary">
              {SEVERITY_DESCRIPTIONS[post.damageLevel]}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
