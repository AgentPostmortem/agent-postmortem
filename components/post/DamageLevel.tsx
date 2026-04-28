import { cn } from "@/lib/utils/cn";
import { SEVERITY_LABELS } from "@/lib/constants/severity";

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

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Pip bar */}
      <div className="flex gap-0.5" aria-label={`Severity ${level} of 5`}>
        {([1, 2, 3, 4, 5] as const).map((pip) => (
          <div
            key={pip}
            className={cn(
              "h-2 rounded-sm transition-colors",
              // Width gets slightly wider at higher severity
              pip <= 2 ? "w-2.5" : pip === 3 ? "w-3" : "w-3.5",
              pip <= level
                ? level >= 4
                  ? "bg-accent-red"
                  : level === 3
                    ? "bg-accent-red opacity-70"
                    : "bg-accent-red opacity-40"
                : "bg-border-strong"
            )}
          />
        ))}
      </div>

      {showLabel && (
        <span className="font-mono text-xs text-text-secondary">
          {label}
        </span>
      )}
    </div>
  );
}
