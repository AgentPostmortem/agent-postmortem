import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TAGS } from "@/lib/constants/tags";
import { fetchPostsByTag } from "@/lib/db/posts";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) return { title: "Tag Not Found" };
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentpostmortem.com";
  const ogImageUrl = `${siteUrl}/api/og/tag/${params.slug}`;
  return {
    title: `#${tag.label} — AI Agent Failures`,
    description: tag.description,
    alternates: {
      canonical: `/tag/${params.slug}`,
    },
    openGraph: {
      title: `#${tag.label} — AI Agent Failures`,
      description: tag.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${tag.label} — AI Agent Failures`,
      description: tag.description,
      images: [ogImageUrl],
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const posts = await fetchPostsByTag(params.slug);

  return (
    <div className="shell py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <Link href="/tag" className="hover:text-text-secondary">
          Tags
        </Link>
        <span>/</span>
        <span>#{tag.slug}</span>
      </div>

      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-sm border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-5 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            Classification Tag
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h1 className="font-serif text-3xl font-normal text-text-primary">
              #{tag.label}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">
              {tag.description}
            </p>
          </div>
          <div className="rounded-sm border border-border-default bg-bg-elevated px-4 py-3">
            <div className="font-mono text-xl font-semibold text-text-primary">
              {posts.length}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              Cases
            </div>
          </div>
        </div>
      </div>

      {/* All tags strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <Link
            key={t.slug}
            href={`/tag/${t.slug}`}
            className={[
              "rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors",
              t.slug === params.slug
                ? "border-accent bg-accent-soft text-accent-strong"
                : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
            ].join(" ")}
          >
            #{t.label}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          title="No cases filed yet."
          description="Witnessed a failure?"
          action={{ label: "File the first report", href: "/submit" }}
        />
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
