import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-sm bg-accent-red" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          Case Not Found
        </span>
      </div>

      <div className="mb-2 font-mono text-6xl font-bold tabular-nums text-border-strong">
        404
      </div>

      <h1 className="mt-4 font-serif text-2xl font-normal text-text-primary">
        No case on file.
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
        The case you&apos;re looking for doesn&apos;t exist, was removed, or the
        URL is incorrect.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded border border-accent-red bg-accent-red-soft px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent-red transition-all hover:bg-accent-red hover:text-white"
        >
          ← Back to Registry
        </Link>
        <Link
          href="/submit"
          className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
        >
          File a Report →
        </Link>
      </div>
    </div>
  );
}
