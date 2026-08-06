import { cn } from "@/lib/utils/cn";
import { severityStyle } from "@/lib/constants/severity";

interface SeverityPillProps {
  level: number;
  /** Hide the text label (ticks and the sr-only label still convey severity) */
  compact?: boolean;
  className?: string;
}

/**
 * Severity indicator. Severity is encoded three ways so it never depends on
 * colour alone: a filled-tick count, a text label, and the semantic colour.
 */
export function SeverityPill({
  level,
  compact = false,
  className,
}: SeverityPillProps) {
  const s = severityStyle(level);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-[3px] font-mono text-[9px] uppercase leading-none tracking-[0.14em]",
        s.border,
        s.bg,
        s.text,
        className,
      )}
    >
      <span aria-hidden="true" className="flex items-end gap-[2px]">
        {[1, 2, 3, 4, 5].map((tick) => (
          <span
            key={tick}
            className={cn(
              "w-[2px] rounded-[1px]",
              tick <= level ? s.fill : "bg-border-strong",
              tick <= 2 ? "h-1.5" : tick === 3 ? "h-2" : "h-2.5",
            )}
          />
        ))}
      </span>
      {compact ? (
        <span className="sr-only">
          Severity {level} of 5, {s.short}
        </span>
      ) : (
        <>
          <span className="tabular-nums">{level}</span>
          <span>{s.short}</span>
        </>
      )}
    </span>
  );
}
