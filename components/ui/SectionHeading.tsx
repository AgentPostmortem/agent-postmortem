import type { ReactNode } from "react";

/**
 * One heading treatment for every top-level section: a display-size title on a
 * hairline rule, with optional right-aligned metadata. Replaces five near-copies
 * of the same markup and gives the page a real type hierarchy.
 */
export function SectionHeading({
  id,
  title,
  meta,
  children,
}: {
  id?: string;
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-border-default pb-3">
      <h2
        id={id}
        className="font-sans text-[1.625rem] font-bold leading-none tracking-[-0.02em] text-text-primary sm:text-[2.125rem]"
      >
        {title}
      </h2>
      {meta ? (
        <span className="font-sans text-[13px] font-semibold text-text-tertiary">
          {meta}
        </span>
      ) : null}
      {children}
    </div>
  );
}
