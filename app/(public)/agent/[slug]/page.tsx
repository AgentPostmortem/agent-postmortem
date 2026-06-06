import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AGENTS } from "@/lib/constants/agents";
import { fetchPostsByAgent } from "@/lib/db/posts";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) return { title: "Agent Not Found" };
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentpostmortem.com";
  const ogImageUrl = `${siteUrl}/api/og/agent/${params.slug}`;
  return {
    title: `${agent.name} Failure Cases`,
    description: `All documented AI agent failures attributed to ${agent.name} by ${agent.company}.`,
    alternates: {
      canonical: `/agent/${params.slug}`,
    },
    openGraph: {
      title: `${agent.name} Failure Cases`,
      description: agent.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} Failure Cases`,
      description: agent.description,
      images: [ogImageUrl],
    },
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
        <Link href="/agent" className="hover:text-text-secondary">
          Agents
        </Link>
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
        <EmptyState
          title={`No cases filed for ${agent.name} yet.`}
          action={{ label: "File the first report →", href: "/submit" }}
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
