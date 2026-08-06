import type { Metadata } from "next";
import Link from "next/link";
import { fetchStatsData } from "@/lib/db/posts";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Failure Stats — AgentPostmortem",
  description:
    "Aggregate statistics on documented AI agent failures: by severity, agent, tag, and over time.",
};

const SEVERITY_LABEL: Record<number, string> = {
  1: "Minimal",
  2: "Low",
  3: "Moderate",
  4: "Severe",
  5: "Critical",
};

const SEVERITY_COLOR: Record<number, string> = {
  1: "bg-text-tertiary/40",
  2: "bg-text-tertiary/60",
  3: "bg-accent/40",
  4: "bg-accent/70",
  5: "bg-accent",
};

function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${year}-${month}-01`));
}

export default async function StatsPage() {
  const stats = await fetchStatsData();

  const maxAgentCount = Math.max(...stats.byAgent.map((a) => a.count), 1);
  const maxMonthCount = Math.max(...stats.recentByMonth.map((m) => m.count), 1);
  const totalSeverity = Object.values(stats.bySeverity).reduce(
    (s, n) => s + n,
    0,
  );

  return (
    <div className="shell py-12 sm:py-16">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Stats</span>
      </div>

      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal text-text-primary">
          Failure Statistics
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          Aggregate data across all documented AI agent incidents.
        </p>
      </div>

      {/* Top-line numbers */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-4">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            Cases Filed
          </div>
          <div className="font-serif text-3xl text-text-primary">
            {stats.totalCases}
          </div>
        </div>
        <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-4">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            Est. Total Damage
          </div>
          <div className="font-serif text-3xl text-accent">
            {stats.totalDamageUsd > 0 ? formatUsd(stats.totalDamageUsd) : "—"}
          </div>
        </div>
        <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-4">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            Agents Implicated
          </div>
          <div className="font-serif text-3xl text-text-primary">
            {stats.byAgent.length}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* By severity */}
        <section>
          <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            By Severity
          </div>
          <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-4">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((lvl) => {
                const count = stats.bySeverity[lvl] ?? 0;
                const pct =
                  totalSeverity > 0 ? (count / totalSeverity) * 100 : 0;
                return (
                  <div key={lvl}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-secondary">
                        {lvl} — {SEVERITY_LABEL[lvl]}
                      </span>
                      <span className="font-mono text-[10px] text-text-tertiary">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-bg-elevated">
                      <div
                        className={`h-1.5 rounded-full transition-all ${SEVERITY_COLOR[lvl]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* By agent */}
        <section>
          <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            Top Agents by Case Count
          </div>
          <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-4">
            {stats.byAgent.length === 0 ? (
              <p className="text-sm text-text-tertiary">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.byAgent.map((agent) => (
                  <div key={agent.slug}>
                    <div className="mb-1 flex items-center justify-between">
                      <Link
                        href={`/agent/${agent.slug}`}
                        className="font-mono text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        {agent.name}
                      </Link>
                      <span className="font-mono text-[10px] text-text-tertiary">
                        {agent.count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-bg-elevated">
                      <div
                        className="h-1.5 rounded-full bg-accent/60 transition-all"
                        style={{
                          width: `${(agent.count / maxAgentCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cases over time */}
        {stats.recentByMonth.length > 0 && (
          <section className="lg:col-span-2">
            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
              Cases Filed — Last 12 Months
            </div>
            <div className="rounded-sm border border-border-default bg-bg-surface px-5 py-5">
              <div
                className="flex items-end gap-1.5"
                style={{ height: "120px" }}
              >
                {stats.recentByMonth.map(({ month, count }) => (
                  <div
                    key={month}
                    className="group relative flex flex-1 flex-col items-center justify-end"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="w-full rounded-t bg-accent/60 transition-all group-hover:bg-accent"
                      style={{
                        height: `${Math.max((count / maxMonthCount) * 100, 2)}%`,
                      }}
                    />
                    <span className="mt-1.5 rotate-45 font-mono text-[8px] text-text-tertiary">
                      {formatMonth(month)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* By tag */}
        <section className="lg:col-span-2">
          <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
            Top Failure Categories
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.byTag.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="flex items-center gap-2 rounded-sm border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
              >
                <span>{tag.label}</span>
                <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-tertiary">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
