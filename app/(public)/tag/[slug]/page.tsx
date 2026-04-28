import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post/PostCard";
import { TAGS } from "@/lib/constants/tags";
import type { Post } from "@/types";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) return { title: "Tag Not Found" };
  return {
    title: `#${tag.label} Cases`,
    description: `All AI agent failure cases tagged with "${tag.label}".`,
  };
}

export async function generateStaticParams() {
  return TAGS.map((tag) => ({ slug: tag.slug }));
}

const PLACEHOLDER_POSTS: Post[] = [
  {
    id: "2",
    caseNumber: "APM-0002",
    title: "GPT-4 hallucinated API endpoint sent 4,000 emails to wrong recipients",
    agentSlug: "gpt-4",
    agentName: "GPT-4",
    outcome:
      "Agent hallucinated a field mapping and sent confidential pricing data to a competitor contact list.",
    damageLevel: 4,
    estimatedCostUsd: 22000,
    tags: ["wrong-recipient", "hallucination", "social-blunder"],
    voteScore: 891,
    createdAt: "2024-11-12T14:10:00Z",
    isAnonymous: false,
    authorHandle: "startupfounder_nyc",
  },
];

export default function TagPage({ params }: PageProps) {
  const tag = TAGS.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const posts = PLACEHOLDER_POSTS.filter((p) => p.tags.includes(params.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Tag
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          #{tag.label}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{tag.description}</p>
        <p className="mt-3 font-mono text-sm text-text-tertiary">
          {posts.length} case{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-text-tertiary">
          No cases filed with this tag yet.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
