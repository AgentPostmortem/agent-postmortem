import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TagBadge } from "@/components/post/TagBadge";
import { VoteButtons } from "@/components/post/VoteButtons";
import { fetchPostByCase } from "@/lib/db/posts";

interface PageProps {
  params: { caseNumber: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPostByCase(params.caseNumber);
  const title = post ? post.title : `Case ${params.caseNumber.toUpperCase()}`;
  return {
    title,
    description: post?.outcome?.slice(0, 160) ?? `AI agent failure case file ${params.caseNumber.toUpperCase()}`,
    openGraph: {
      images: [{ url: `/api/og/${params.caseNumber}`, width: 1200, height: 630 }],
    },
  };
}

const SEVERITY_META: Record<number, { label: string; color: string; bg: string; bar: string }> = {
  1: { label: "MINIMAL",  color: "text-text-tertiary",  bg: "bg-bg-elevated",     bar: "w-1/5" },
  2: { label: "LOW",      color: "text-text-secondary", bg: "bg-bg-elevated",     bar: "w-2/5" },
  3: { label: "MODERATE", color: "text-text-secondary", bg: "bg-bg-elevated",     bar: "w-3/5" },
  4: { label: "SEVERE",   color: "text-accent-red",     bg: "bg-accent-red-soft", bar: "w-4/5" },
  5: { label: "CRITICAL", color: "text-accent-red",     bg: "bg-accent-red-soft", bar: "w-full" },
};

export default async function CasePage({ params }: PageProps) {
  const post = await fetchPostByCase(params.caseNumber);
  if (!post) notFound();

  const s = SEVERITY_META[post.damageLevel];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }).format(new Date(post.createdAt));

  const cost = post.estimatedCostUsd != null
    ? post.estimatedCostUsd >= 1_000_000
      ? `$${(post.estimatedCostUsd / 1_000_000).toFixed(1)}M`
      : post.estimatedCostUsd >= 1_000
      ? `$${(post.estimatedCostUsd / 1_000).toFixed(0)}k`
      : `$${post.estimatedCostUsd}`
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Registry</Link>
        <span>/</span>
        <span>{post.caseNumber}</span>
      </div>

      {/* Case file header block */}
      <div className="mb-8 overflow-hidden rounded border border-border-default bg-bg-surface">
        {/* Metadata row */}
        <div className="grid grid-cols-2 divide-y divide-border-default border-b border-border-default sm:flex sm:divide-y-0 sm:divide-x sm:divide-border-default [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1 sm:[&>*:last-child]:ml-auto">
          <div className="px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Case No.</div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-text-primary">{post.caseNumber}</div>
          </div>
          <div className="px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Subject</div>
            <Link href={`/agent/${post.agentSlug}`} className="mt-0.5 block font-mono text-sm text-text-primary transition-colors hover:text-accent-red">
              {post.agentName}
            </Link>
          </div>
          <div className="px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Filed</div>
            <div className="mt-0.5 font-mono text-sm text-text-primary">{formattedDate}</div>
          </div>
          <div className={`px-5 py-3 ${s.bg}`}>
            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Severity</div>
            <div className={`mt-0.5 font-mono text-sm font-bold ${s.color}`}>
              {post.damageLevel} / 5 — {s.label}
            </div>
          </div>
        </div>

        {/* Severity progress bar */}
        <div className="h-1 bg-bg-elevated">
          <div className={`h-1 bg-accent-red transition-all ${s.bar}`} />
        </div>

        {/* Title */}
        <div className="px-5 py-5">
          <h1 className="font-serif text-2xl font-normal leading-snug text-text-primary sm:text-3xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
          )}
        </div>

        {/* Damage + vote row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-5 py-3">
          <div className="flex flex-wrap gap-5">
            {cost && (
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Est. Damage </span>
                <span className="font-mono text-sm font-semibold text-accent-red">~{cost}</span>
              </div>
            )}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Attribution </span>
              <span className="font-mono text-sm text-text-secondary">
                {post.isAnonymous ? "Anonymous" : post.authorHandle ? `@${post.authorHandle}` : "Practitioner"}
              </span>
            </div>
          </div>
          <VoteButtons postId={post.id} initialScore={post.voteScore} />
        </div>
      </div>

      {/* Instruction */}
      {post.prompt && (
        <section className="mb-6">
          <div className="section-label">Instruction Given to Agent</div>
          <div className="rounded border border-border-default bg-bg-surface">
            <div className="border-b border-border-default px-4 py-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Prompt</span>
            </div>
            <blockquote className="px-5 py-4">
              <p className="font-mono text-sm leading-relaxed text-text-secondary">
                &ldquo;{post.prompt}&rdquo;
              </p>
            </blockquote>
          </div>
        </section>
      )}

      {/* Findings */}
      <section className="mb-6">
        <div className="section-label">Findings</div>
        <div className="rounded border border-border-default bg-bg-surface px-5 py-5">
          <p className="text-[0.95rem] leading-7 text-text-primary">{post.outcome}</p>
        </div>
      </section>

      {/* Evidence */}
      {post.screenshots && post.screenshots.length > 0 && (
        <section className="mb-6">
          <div className="section-label">
            Evidence — {post.screenshots.length} Exhibit{post.screenshots.length > 1 ? "s" : ""}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {post.screenshots.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`Exhibit ${i + 1}`} className="rounded border border-border-default" />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-5">
        <div className="flex gap-5">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary">
            ← All Cases
          </Link>
          <Link href={`/agent/${post.agentSlug}`} className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary">
            More {post.agentName} →
          </Link>
        </div>
        <a href={`/api/og/${post.caseNumber}`} target="_blank" className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary">
          Share card ↗
        </a>
      </div>
    </div>
  );
}
