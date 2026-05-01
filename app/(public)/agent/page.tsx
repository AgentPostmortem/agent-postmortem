import type { Metadata } from "next";
import Link from "next/link";
import { AGENTS } from "@/lib/constants/agents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "AI Agents — AgentPostmortem",
  description:
    "Browse all AI agents with documented failure cases in the AgentPostmortem registry.",
};

export default function AgentsIndexPage() {
  const byCompany = AGENTS.reduce<Record<string, typeof AGENTS>>(
    (acc, agent) => {
      const key = agent.company;
      if (!acc[key]) acc[key] = [];
      acc[key].push(agent);
      return acc;
    },
    {},
  );

  const companies = Object.keys(byCompany).sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Agents</span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-text-primary">
          Agent Index
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {AGENTS.length} agents tracked across {companies.length} companies.
        </p>
      </div>

      <div className="space-y-8">
        {companies.map((company) => (
          <div key={company}>
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
              {company}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {byCompany[company].map((agent) => (
                <Link
                  key={agent.slug}
                  href={`/agent/${agent.slug}`}
                  className="group rounded border border-border-default bg-bg-surface p-4 transition-colors hover:border-accent-red/40 hover:bg-bg-elevated"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-sm font-semibold text-text-primary group-hover:text-accent-red">
                        {agent.name}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
                        {agent.description}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-text-tertiary group-hover:text-accent-red">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
