import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, prefix, suffix, className, id: propsId, ...props },
  ref,
) {
  const generatedId = useId();
  const id = propsId ?? generatedId;
  const errorId = `${id}-error`;
  const describedBy =
    [error && errorId, props["aria-describedby"]].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="relative">
      {prefix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-text-tertiary"
        >
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-sm border bg-bg-surface py-2.5 text-sm text-text-primary placeholder-text-tertiary transition-colors focus:outline-none",
          error
            ? "border-accent focus:border-accent"
            : "border-border-default focus:border-accent",
          prefix ? "pl-7 pr-3" : "px-3",
          suffix ? "pr-7" : "",
          className,
        )}
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {suffix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-text-tertiary"
        >
          {suffix}
        </span>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
});
