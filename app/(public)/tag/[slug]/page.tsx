import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { TAGS } from "@/lib/constants/tags";
import { fetchPostsByTag } from "@/lib/db/posts";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) return { title: "Tag Not Found" };
  return {
    title: `#${tag.label} — AI Agent Failures`,
    description: tag.description,
  };
}

export default async function TagPage({ params }: PageProps) {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const posts = await fetchPostsByTag(params.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Tags</span>
        <span>/</span>
        <span>#{tag.label}</span>
      </div>

      {/* Header */}
      <div className="mb-8 overflow-hidden rounded border border-border-default bg-bg-surface">
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
          <div className="rounded border border-border-default bg-bg-elevated px-4 py-3">
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
              "rounded border px-2.5 py-1 font-mono text-xs transition-colors",
              t.slug === params.slug
                ? "border-accent-red bg-accent-red-soft text-accent-red"
                : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
            ].join(" ")}
          >
            #{t.label}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="rounded border border-dashed border-border-default py-16 text-center">
          <p className="font-serif text-lg text-text-secondary">
            No cases with this tag yet.
          </p>
          <p className="mt-2 text-sm text-text-tertiary">
            <Link href="/submit" className="text-accent-red hover:underline">
              File a report →
            </Link>
          </p>
        </div>
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
