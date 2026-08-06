import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { TagBadge } from "@/components/post/TagBadge";
import { VoteButtons } from "@/components/post/VoteButtons";
import { PostCard } from "@/components/post/PostCard";
import { fetchPostByCase, fetchRelatedPosts } from "@/lib/db/posts";
import { CopyLinkButton } from "@/components/post/CopyLinkButton";
import { CommentsSection } from "@/components/post/CommentsSection";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getSiteUrl } from "@/lib/utils/urls";

export const revalidate = 60;

// Cache the case fetch so generateMetadata and the page share the same result.
// Route-level ISR still uses the OpenNext incremental cache; this request-level
// memo avoids wrapping Supabase cookie reads in unstable_cache.
const getCachedCase = cache((caseNumber: string) =>
  fetchPostByCase(caseNumber),
);

function getSourceDomain(sourceUrl?: string) {
  if (!sourceUrl) return null;
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

interface PageProps {
  params: { caseNumber: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getCachedCase(params.caseNumber);
  const caseNum = params.caseNumber.toUpperCase();
  const title = post ? post.title : `Case ${caseNum}`;
  const description =
    post?.outcome?.slice(0, 160) ?? `AI agent failure case file ${caseNum}`;
  const siteUrl = getSiteUrl();
  const ogImageUrl = `${siteUrl}/api/og/${caseNum}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/case/${caseNum}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/case/${caseNum}`,
      siteName: "AgentPostmortem",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const SEVERITY_META: Record<
  number,
  { label: string; color: string; bg: string; bar: string }
> = {
  1: {
    label: "MINIMAL",
    color: "text-text-tertiary",
    bg: "bg-bg-elevated",
    bar: "w-1/5",
  },
  2: {
    label: "LOW",
    color: "text-text-secondary",
    bg: "bg-bg-elevated",
    bar: "w-2/5",
  },
  3: {
    label: "MODERATE",
    color: "text-text-secondary",
    bg: "bg-bg-elevated",
    bar: "w-3/5",
  },
  4: {
    label: "SEVERE",
    color: "text-accent-red",
    bg: "bg-accent-red-soft",
    bar: "w-4/5",
  },
  5: {
    label: "CRITICAL",
    color: "text-accent-red",
    bg: "bg-accent-red-soft",
    bar: "w-full",
  },
};

export default async function CasePage({ params }: PageProps) {
  const post = await getCachedCase(params.caseNumber);
  if (!post) notFound();

  const related = await fetchRelatedPosts(
    post.caseNumber,
    post.agentSlug,
    post.tags,
  );

  const s = SEVERITY_META[post.damageLevel];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

  const siteUrl = getSiteUrl();
  const sourceDomain = getSourceDomain(post.sourceUrl);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.outcome.slice(0, 160),
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: {
      "@type": "Organization",
      name: "AgentPostmortem",
    },
    publisher: {
      "@type": "Organization",
      name: "AgentPostmortem",
      url: siteUrl,
    },
    url: `${siteUrl}/case/${post.caseNumber}`,
    mainEntityOfPage: `${siteUrl}/case/${post.caseNumber}`,
    keywords: post.tags.join(", "),
    ...(post.sourceUrl
      ? {
          citation: {
            "@type": "CreativeWork",
            name: post.sourceTitle ?? sourceDomain ?? "Source report",
            url: post.sourceUrl,
          },
        }
      : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Registry",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.caseNumber,
        item: `${siteUrl}/case/${post.caseNumber}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">
            Registry
          </Link>
          <span>/</span>
          <span>{post.caseNumber}</span>
        </div>

        {/* Case file header block */}
        <div className="mb-8 overflow-hidden rounded border border-border-default bg-bg-surface">
          {/* Metadata row */}
          <div className="grid grid-cols-2 divide-y divide-border-default border-b border-border-default sm:flex sm:divide-y-0 sm:divide-x sm:divide-border-default [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1 sm:[&>*:last-child]:ml-auto">
            <div className="px-4 py-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Case No.
              </div>
              <div className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
                {post.caseNumber}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Subject
              </div>
              <Link
                href={`/agent/${post.agentSlug}`}
                className="mt-0.5 block font-mono text-sm text-text-primary transition-colors hover:text-accent-red"
              >
                {post.agentName}
              </Link>
            </div>
            <div className="px-4 py-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Filed
              </div>
              <div className="mt-0.5 font-mono text-sm text-text-primary">
                {formattedDate}
              </div>
            </div>
            <div className={`px-5 py-3 ${s.bg}`}>
              <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Severity
              </div>
              <div className={`mt-0.5 font-mono text-sm font-bold ${s.color}`}>
                {post.damageLevel} / 5 · {s.label}
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
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Damage + vote row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-5 py-3">
            <div className="flex flex-wrap gap-5">
              {cost && (
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                    Est. Damage{" "}
                  </span>
                  <span className="font-mono text-sm font-semibold text-accent-red">
                    ~{cost}
                  </span>
                </div>
              )}
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  Attribution{" "}
                </span>
                <span className="font-mono text-sm text-text-secondary">
                  {post.isAnonymous
                    ? "Anonymous"
                    : post.authorHandle
                      ? `@${post.authorHandle}`
                      : "Practitioner"}
                </span>
              </div>
            </div>
            <VoteButtons postId={post.id} initialScore={post.voteScore} />
          </div>
        </div>

        {/* Source / accuracy disclaimer */}
        <p className="mb-6 font-mono text-[10px] leading-relaxed text-text-tertiary">
          Independent project · aggregated from public reports and may be
          unverified — see the primary source below · not affiliated with or
          endorsed by any company or product named.
        </p>

        {/* Instruction */}
        {post.prompt && (
          <section className="mb-6">
            <div className="section-label">Instruction Given to Agent</div>
            <div className="rounded border border-border-default bg-bg-surface">
              <div className="border-b border-border-default px-4 py-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  Prompt
                </span>
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
          <div className="section-label">Incident Summary</div>
          <div className="rounded border border-border-default bg-bg-surface px-5 py-5">
            <p className="text-[0.95rem] leading-7 text-text-primary">
              {post.outcome}
            </p>
          </div>
        </section>

        {(post.verifiedFacts.length > 0 ||
          post.unknowns.length > 0 ||
          post.lessons.length > 0) && (
          <section className="mb-6">
            <div className="section-label">Case Analysis</div>
            <div className="divide-y divide-border-default rounded border border-border-default bg-bg-surface">
              {post.verifiedFacts.length > 0 && (
                <div className="px-5 py-5">
                  <h2 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Verified Facts
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {post.verifiedFacts.map((fact) => (
                      <li
                        key={fact}
                        className="flex gap-3 text-sm leading-6 text-text-primary"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-red" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {post.unknowns.length > 0 && (
                <div className="px-5 py-5">
                  <h2 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Not Publicly Confirmed
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {post.unknowns.map((unknown) => (
                      <li
                        key={unknown}
                        className="flex gap-3 text-sm leading-6 text-text-secondary"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong" />
                        <span>{unknown}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {post.lessons.length > 0 && (
                <div className="px-5 py-5">
                  <h2 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Operational Lessons
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {post.lessons.map((lesson) => (
                      <li
                        key={lesson}
                        className="flex gap-3 text-sm leading-6 text-text-primary"
                      >
                        <span className="mt-1 shrink-0 text-accent-red">
                          <ArrowRightIcon size={11} />
                        </span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {post.sourceUrl && (
          <section className="mb-6">
            <div className="section-label">Primary Source</div>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border border-border-default bg-bg-surface px-5 py-4 transition-colors hover:border-border-strong"
            >
              <span className="block text-sm leading-6 text-text-primary">
                {post.sourceTitle ?? "Read the source report"}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {sourceDomain} ↗
              </span>
            </a>
          </section>
        )}

        {/* Evidence */}
        {post.screenshots && post.screenshots.length > 0 && (
          <section className="mb-6">
            <div className="section-label">
              Evidence — {post.screenshots.length} Exhibit
              {post.screenshots.length > 1 ? "s" : ""}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {post.screenshots.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Exhibit ${i + 1}`}
                  className="rounded border border-border-default"
                />
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <CommentsSection postId={post.id} />

        {/* Related cases */}
        {related.length > 0 && (
          <div className="mt-10 border-t border-border-default pt-8">
            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
              More Cases
            </div>
            <div className="space-y-2">
              {related.map((r) => (
                <PostCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-5">
          <div className="flex gap-5">
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary"
            >
              <span className="inline-flex items-center gap-1.5">
                <ArrowLeftIcon size={10} /> All Cases
              </span>
            </Link>
            <Link
              href={`/agent/${post.agentSlug}`}
              className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary"
            >
              <span className="inline-flex items-center gap-1.5">
                More {post.agentName} <ArrowRightIcon size={10} />
              </span>
            </Link>
          </div>
          {/* Share */}
          <div className="flex items-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${post.title}" — AI agent failure case ${post.caseNumber}`)}&url=${encodeURIComponent(`${getSiteUrl()}/case/${post.caseNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary"
            >
              <span className="inline-flex items-center gap-1.5">
                Share on X <ArrowRightIcon size={10} />
              </span>
            </a>
            <CopyLinkButton caseNumber={post.caseNumber} />
          </div>
        </div>
      </div>
    </>
  );
}
