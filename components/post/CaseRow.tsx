import Link from "next/link";
import { severityStyle } from "@/lib/constants/severity";
import { formatUsd } from "@/lib/utils/format";
import type { Post } from "@/types";

/**
 * Dense registry row. Built for scanning and comparison: fixed columns for
 * severity, agent, damage and date, so cases line up against each other.
 * The full card treatment is reserved for the featured case.
 */
export function CaseRow({
  post,
  commentCount,
}: {
  post: Post;
  commentCount?: number;
}) {
  const s = severityStyle(post.damageLevel);
  const cost = formatUsd(post.estimatedCostUsd);

  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(post.createdAt));

  return (
    <article className="group relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 px-3 py-3 transition-colors hover:bg-bg-elevated sm:grid-cols-[7.5rem_minmax(0,1fr)_6.5rem_5rem_4.5rem] sm:items-center sm:gap-x-4 sm:px-4">
      {/* Severity + case number */}
      <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-1">
        <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-accent">
          {post.caseNumber}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="flex items-end gap-[2px]">
            {[1, 2, 3, 4, 5].map((tick) => (
              <span
                key={tick}
                className={[
                  "w-[3px] rounded-[1px]",
                  tick <= post.damageLevel ? s.fill : "bg-border-strong",
                  tick <= 2 ? "h-1.5" : tick === 3 ? "h-2" : "h-2.5",
                ].join(" ")}
              />
            ))}
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] ${s.text}`}
          >
            {s.short}
          </span>
          <span className="sr-only">Severity {post.damageLevel} of 5</span>
        </span>
      </div>

      {/* Title + supporting line */}
      <div className="col-span-2 min-w-0 sm:col-span-1">
        <h3 className="text-[0.95rem] font-medium leading-snug tracking-tight text-text-primary">
          <Link
            href={`/case/${post.caseNumber.toLowerCase()}`}
            className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-[0.8rem] leading-relaxed text-text-tertiary">
          {post.outcome}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-text-tertiary">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
          {post.tags.length > 3 && <span>+{post.tags.length - 3}</span>}
          {commentCount != null && commentCount > 0 && (
            <span className="tabular-nums">{commentCount} comments</span>
          )}
          {/* Mobile-only column values */}
          <span className="sm:hidden">{post.agentName}</span>
          {cost && <span className="sm:hidden">~{cost}</span>}
          <span className="sm:hidden">{date}</span>
        </div>
      </div>

      {/* Desktop columns */}
      <div className="hidden font-mono text-[11px] text-text-secondary sm:block">
        {post.agentName}
      </div>
      <div className="hidden text-right font-mono text-[11px] tabular-nums sm:block">
        {cost ? (
          <span className="text-text-primary">~{cost}</span>
        ) : (
          <span className="text-text-tertiary">n/a</span>
        )}
      </div>
      <div className="hidden text-right font-mono text-[10px] tabular-nums text-text-tertiary sm:block">
        {date}
      </div>
    </article>
  );
}
