import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "danger" | "warning";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border-default bg-bg-elevated text-text-tertiary",
  success: "border-green-800 bg-green-950 text-green-400",
  danger: "border-accent-red bg-accent-red-soft text-accent-red",
  warning: "border-yellow-800 bg-yellow-950 text-yellow-400",
};

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
