import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

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
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-1 font-mono text-[11px]"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border-default px-2.5 py-1.5 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          <ArrowLeftIcon size={10} /> Prev
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1.5 rounded-sm border border-border-default px-2.5 py-1.5 text-text-tertiary opacity-40"
        >
          <ArrowLeftIcon size={10} /> Prev
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="px-1 text-text-tertiary"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={[
              "rounded-sm border px-2.5 py-1.5 transition-colors",
              p === currentPage
                ? "border-accent bg-accent-soft text-accent-strong"
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
          className="inline-flex items-center gap-1.5 rounded-sm border border-border-default px-2.5 py-1.5 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          Next <ArrowRightIcon size={10} />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1.5 rounded-sm border border-border-default px-2.5 py-1.5 text-text-tertiary opacity-40"
        >
          Next <ArrowRightIcon size={10} />
        </span>
      )}
    </nav>
  );
}
