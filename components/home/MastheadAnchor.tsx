import { severityStyle, SEVERITY_LABELS } from "@/lib/constants/severity";
import type { SeverityLevel } from "@/lib/constants/severity";
import type { RegistryOverview } from "@/lib/db/posts";
import { percentOf } from "@/lib/utils/format";

const LEVELS: SeverityLevel[] = [5, 4, 3, 2, 1];

/**
 * The masthead's visual anchor: a case-file plate showing the registry's real
 * severity profile. Every mark on it is driven by approved rows, nothing here
 * is decorative filler. Severity is carried by the printed level, the label
 * and the bar length, never by colour alone.
 */
export function MastheadAnchor({ data }: { data: RegistryOverview }) {
  if (data.totalCases === 0) return null;

  const max = Math.max(...LEVELS.map((l) => data.bySeverity[l] ?? 0), 1);
  const reported = data.latestIncidentAt
    ? new Date(data.latestIncidentAt).toISOString().slice(0, 10)
    : null;

  return (
    <figure className="relative m-0">
      <div
        aria-hidden="true"
        className="aura -inset-6 hidden lg:block"
        style={{ filter: "blur(38px)" }}
      />
      <div className="plate relative rounded-sm border border-border-strong bg-bg-surface/70 backdrop-blur-[2px]">
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-tertiary">
            Registry / Severity Profile
          </span>
          <span className="font-mono text-[9px] tabular-nums tracking-wider text-text-tertiary">
            n={data.totalCases.toLocaleString()}
          </span>
        </div>

        <ul className="ruled px-4 py-3">
          {LEVELS.map((level) => {
            const s = severityStyle(level);
            const count = data.bySeverity[level] ?? 0;
            const width = Math.max(2, Math.round((count / max) * 100));
            return (
              <li key={level} className="py-[5px]">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                    <span className="tabular-nums text-text-primary">
                      {level}
                    </span>{" "}
                    <span className={s.text}>{SEVERITY_LABELS[level]}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-text-primary">
                    {count}
                    <span className="ml-1.5 text-[9px] text-text-tertiary">
                      {percentOf(count, data.totalCases)}%
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-[3px] w-full bg-bg-canvas">
                  <div
                    className={`h-[3px] ${s.fill}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <figcaption className="flex items-center justify-between gap-3 border-t border-border-default px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-text-tertiary">
          <span>{data.byAgent.length} agents implicated</span>
          {reported && (
            <span className="tabular-nums">Last reported {reported}</span>
          )}
        </figcaption>
      </div>
    </figure>
  );
}
