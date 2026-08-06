import type { Metadata } from "next";
import Link from "next/link";
import { TAGS } from "@/lib/constants/tags";
import { fetchTagCaseCounts } from "@/lib/db/posts";
import { ArrowRightIcon } from "@/components/ui/icons";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tags — AgentPostmortem",
  description: "Browse all failure categories in the AgentPostmortem registry.",
};

export default async function TagsIndexPage() {
  const counts = await fetchTagCaseCounts();

  const sortedTags = [...TAGS].sort(
    (a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0),
  );

  return (
    <div className="shell py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Tags</span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-text-primary">
          Failure Categories
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {TAGS.length} categories used to classify AI agent failure modes.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {sortedTags.map((tag) => {
          const count = counts[tag.slug] ?? 0;
          return (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="group rounded-sm border border-border-default bg-bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-bg-elevated"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-accent">
                      #{tag.slug}
                    </span>
                    {count > 0 && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-strong">
                        {count}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
                    {tag.description}
                  </p>
                </div>
                <span className="shrink-0 text-text-tertiary group-hover:text-accent">
                  <ArrowRightIcon size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
