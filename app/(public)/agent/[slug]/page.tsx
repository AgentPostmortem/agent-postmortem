import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post/PostCard";
import { AGENTS } from "@/lib/constants/agents";
import type { Post } from "@/types";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: `${agent.name} Failure Cases`,
    description: `All documented AI agent failures attributed to ${agent.name} by ${agent.company}.`,
  };
}

export async function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.slug }));
}

// Placeholder — replace with Supabase query filtered by agent
const PLACEHOLDER_POSTS: Post[] = [
  {
    id: "1",
    caseNumber: "APM-0001",
    title: "Agent deleted production database after misreading schema migration",
    agentSlug: "devin",
    agentName: "Devin",
    outcome:
      "Automated agent executed DROP TABLE on live database during a routine migration task.",
    damageLevel: 5,
    estimatedCostUsd: 85000,
    tags: ["deleted-data", "code-disaster"],
    voteScore: 1247,
    createdAt: "2024-11-15T09:23:00Z",
    isAnonymous: true,
  },
];

export default function AgentPage({ params }: PageProps) {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) notFound();

  const posts = PLACEHOLDER_POSTS.filter((p) => p.agentSlug === params.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Agent Profile
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          {agent.name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{agent.company}</p>
        <p className="mt-3 font-mono text-sm text-text-tertiary">
          {posts.length} documented failure{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-text-tertiary">
          No cases filed yet for this agent.
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
