/** Compact USD formatting used across registry summaries. */
export function formatUsd(value: number | null | undefined): string | null {
  if (value == null || value <= 0) return null;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${value}`;
}

/** Percentage of a total, rounded, safe when the total is zero. */
export function percentOf(count: number, total: number): number {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

/** Short month label, e.g. "2026-03" becomes "Mar 26". */
export function monthLabel(month: string): string {
  const [year, mon] = month.split("-");
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const idx = Number(mon) - 1;
  const name = names[idx] ?? mon;
  return `${name} ${year?.slice(2) ?? ""}`;
}
