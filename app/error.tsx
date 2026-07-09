"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded border border-border-strong bg-bg-surface">
        <span className="font-mono text-lg text-accent-red">!</span>
      </div>
      <h1 className="font-serif text-3xl font-normal text-text-primary">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-text-secondary">
        An unexpected error occurred. The team has been notified.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[10px] text-text-tertiary">
          ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded border border-border-default bg-bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded border border-border-default bg-bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:border-border-strong hover:text-text-secondary"
        >
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeftIcon size={10} /> Registry
          </span>
        </Link>
      </div>
    </div>
  );
}
