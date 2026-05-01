import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-1 font-mono text-[11px]">
      {currentPage > 1 ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className="rounded border border-border-default px-2.5 py-1.5 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          ← Prev
        </Link>
      ) : (
        <span className="rounded border border-border-default px-2.5 py-1.5 text-text-tertiary opacity-40">
          ← Prev
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-text-tertiary">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            className={[
              "rounded border px-2.5 py-1.5 transition-colors",
              p === currentPage
                ? "border-accent-red bg-accent-red-soft text-accent-red-muted"
                : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
            ].join(" ")}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          className="rounded border border-border-default px-2.5 py-1.5 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded border border-border-default px-2.5 py-1.5 text-text-tertiary opacity-40">
          Next →
        </span>
      )}
    </div>
  );
}
