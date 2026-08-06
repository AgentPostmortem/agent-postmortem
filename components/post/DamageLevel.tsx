import { cn } from "@/lib/utils/cn";
import { SEVERITY_LABELS, severityStyle } from "@/lib/constants/severity";

interface DamageLevelProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  className?: string;
}

export function DamageLevel({
  level,
  showLabel = false,
  className,
}: DamageLevelProps) {
  const label = SEVERITY_LABELS[level];
  const s = severityStyle(level);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Pip bar: count of filled pips encodes level without relying on colour */}
      <div className="flex items-end gap-0.5" aria-hidden="true">
        {([1, 2, 3, 4, 5] as const).map((pip) => (
          <div
            key={pip}
            className={cn(
              "w-2.5 rounded-[1px] transition-colors",
              pip <= 2 ? "h-1.5" : pip === 3 ? "h-2" : "h-2.5",
              pip <= level ? s.fill : "bg-border-strong",
            )}
          />
        ))}
      </div>
      <span className="sr-only">
        Severity {level} of 5, {label}
      </span>

      {showLabel && (
        <span
          className={cn("font-mono text-xs tabular-nums", s.text)}
          aria-hidden="true"
        >
          {level}/5 {label}
        </span>
      )}
    </div>
  );
}
