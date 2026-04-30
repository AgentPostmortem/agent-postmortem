import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { AGENTS } from "@/lib/constants/agents";
import { fetchPostsByAgent } from "@/lib/db/posts";

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

export default async function AgentPage({ params }: PageProps) {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) notFound();

  const posts = await fetchPostsByAgent(params.slug);

  const totalDamage = posts.reduce(
    (sum, p) => sum + (p.estimatedCostUsd ?? 0),
    0,
  );
  const formattedDamage =
    totalDamage >= 1_000_000
      ? `$${(totalDamage / 1_000_000).toFixed(1)}M`
      : totalDamage >= 1_000
        ? `$${(totalDamage / 1_000).toFixed(0)}k`
        : totalDamage > 0
          ? `$${totalDamage}`
          : null;

  const avgSeverity = posts.length
    ? (posts.reduce((sum, p) => sum + p.damageLevel, 0) / posts.length).toFixed(
        1,
      )
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Agents</span>
        <span>/</span>
        <span>{agent.name}</span>
      </div>

      {/* Agent header */}
      <div className="mb-8 overflow-hidden rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-5 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            Agent Profile
          </span>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-normal text-text-primary">
                {agent.name}
              </h1>
              <p className="mt-0.5 font-mono text-sm text-text-secondary">
                {agent.company}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
                {agent.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 gap-px overflow-hidden rounded border border-border-default bg-border-default">
              {[
                { value: posts.length.toString(), label: "Cases" },
                ...(formattedDamage
                  ? [{ value: formattedDamage, label: "Damage", red: true }]
                  : []),
                ...(avgSeverity
                  ? [{ value: avgSeverity + "/5", label: "Severity" }]
                  : []),
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-bg-surface px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <div
                    className={`font-mono text-lg font-semibold tabular-nums sm:text-xl ${s.red ? "text-accent-red" : "text-text-primary"}`}
                  >
                    {s.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-text-tertiary sm:text-[9px]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="rounded border border-dashed border-border-default py-16 text-center">
          <p className="font-serif text-lg text-text-secondary">
            No cases filed for {agent.name} yet.
          </p>
          <p className="mt-2 text-sm text-text-tertiary">
            <Link href="/submit" className="text-accent-red hover:underline">
              File the first report →
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
