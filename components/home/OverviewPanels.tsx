import Link from "next/link";
import { severityStyle, SEVERITY_LABELS } from "@/lib/constants/severity";
import type { SeverityLevel } from "@/lib/constants/severity";
import type { RegistryOverview } from "@/lib/db/posts";
import { formatUsd, monthLabel, percentOf } from "@/lib/utils/format";

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="plate min-w-0 bg-bg-surface/45">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border-default px-5 py-3">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          {title}
        </h3>
        {note && (
          <span className="font-mono text-[9px] tabular-nums text-text-tertiary">
            {note}
          </span>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

/** Horizontal count bar. The number is always printed, the bar is secondary. */
function BarRow({
  label,
  count,
  max,
  pct,
  href,
  fillClass = "bg-text-tertiary/70",
  trailing,
}: {
  label: React.ReactNode;
  count: number;
  max: number;
  pct?: number;
  href?: string;
  fillClass?: string;
  trailing?: string;
}) {
  const width = max > 0 ? Math.max(2, Math.round((count / max) * 100)) : 0;
  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate font-mono text-[11px] text-text-secondary group-hover/bar:text-text-primary">
          {label}
        </span>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-primary">
          {count}
          {pct != null && (
            <span className="ml-1.5 text-[9px] text-text-tertiary">{pct}%</span>
          )}
          {trailing && (
            <span className="ml-1.5 text-[9px] text-text-tertiary">
              {trailing}
            </span>
          )}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full bg-bg-elevated">
        <div className={`h-1 ${fillClass}`} style={{ width: `${width}%` }} />
      </div>
    </>
  );

  return (
    <li className="py-1.5">
      {href ? (
        <Link href={href} className="group/bar block">
          {inner}
        </Link>
      ) : (
        <div className="group/bar">{inner}</div>
      )}
    </li>
  );
}

export function SeverityPanel({ data }: { data: RegistryOverview }) {
  const levels: SeverityLevel[] = [5, 4, 3, 2, 1];
  const max = Math.max(...levels.map((l) => data.bySeverity[l] ?? 0), 1);
  const severe = (data.bySeverity[5] ?? 0) + (data.bySeverity[4] ?? 0);

  return (
    <Panel
      title="Severity distribution"
      note={`${percentOf(severe, data.totalCases)}% severe or worse`}
    >
      <ul>
        {levels.map((level) => {
          const s = severityStyle(level);
          const count = data.bySeverity[level] ?? 0;
          return (
            <BarRow
              key={level}
              label={
                <>
                  <span className="tabular-nums">{level}</span>{" "}
                  <span className={s.text}>{SEVERITY_LABELS[level]}</span>
                </>
              }
              count={count}
              max={max}
              pct={percentOf(count, data.totalCases)}
              href={`/?severity=${level}`}
              fillClass={s.fill}
            />
          );
        })}
      </ul>
    </Panel>
  );
}

export function AgentPanel({ data }: { data: RegistryOverview }) {
  const agents = data.byAgent.slice(0, 6);
  const max = Math.max(...agents.map((a) => a.count), 1);

  return (
    <Panel title="Cases by agent" note={`${data.byAgent.length} implicated`}>
      <ul>
        {agents.map((agent) => (
          <BarRow
            key={agent.slug}
            label={agent.label}
            count={agent.count}
            max={max}
            href={`/agent/${agent.slug}`}
            trailing={
              agent.severeCount > 0 ? `${agent.severeCount} severe+` : undefined
            }
          />
        ))}
      </ul>
    </Panel>
  );
}

export function FailureModePanel({ data }: { data: RegistryOverview }) {
  const tags = data.byTag.slice(0, 6);
  const max = Math.max(...tags.map((t) => t.count), 1);

  return (
    <Panel title="Failure modes" note={`${data.byTag.length} in use`}>
      <ul>
        {tags.map((tag) => (
          <BarRow
            key={tag.slug}
            label={`#${tag.label}`}
            count={tag.count}
            max={max}
            href={`/tag/${tag.slug}`}
            fillClass="bg-text-tertiary/70"
          />
        ))}
      </ul>
    </Panel>
  );
}

/**
 * Cases filed per month, hand-built as CSS columns. No charting dependency,
 * no client JavaScript. Every bar is a real month count.
 */
export function TimelinePanel({ data }: { data: RegistryOverview }) {
  const months = data.byMonth;
  if (months.length === 0) return null;
  const max = Math.max(...months.map((m) => m.count), 1);
  const totalDamage = formatUsd(data.totalDamageUsd);

  return (
    <Panel
      title="Cases filed by month"
      note={totalDamage ? `${totalDamage} logged damage` : undefined}
    >
      <ol className="flex h-24 items-end gap-1.5">
        {months.map((m) => (
          <li
            key={m.month}
            className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1"
          >
            <span className="text-center font-mono text-[9px] tabular-nums text-text-tertiary">
              {m.count}
            </span>
            <div
              className="w-full bg-text-tertiary/70"
              style={{
                height: `${Math.max(4, Math.round((m.count / max) * 100))}%`,
              }}
            />
            <span className="truncate text-center font-mono text-[8px] uppercase tracking-wider text-text-tertiary">
              {monthLabel(m.month)}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        {months
          .map((m) => `${monthLabel(m.month)}: ${m.count} cases`)
          .join(". ")}
      </p>
    </Panel>
  );
}
