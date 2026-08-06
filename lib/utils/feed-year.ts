/**
 * Year bucketing for the case feed.
 *
 * The registry spans 2016 to today, but most of the recent reporting lands in
 * the current year. The landing view defaults to the newest year that actually
 * has cases so the feed reads as current, while every older year stays one
 * click away and the full archive stays reachable.
 *
 * Every year here is derived from `incidentDate()` (source publication date,
 * falling back to the record date), never hardcoded.
 */
import { incidentDate, type IncidentDateInput } from "./incident-date";

/** Sentinel query value for "do not filter by year". */
export const ALL_YEARS = "all";

export interface YearBucket {
  /** Four digit year, e.g. "2026" */
  year: string;
  count: number;
}

/** "YYYY" bucket for the incident date, or null when no date is known. */
export function incidentYear(row: IncidentDateInput): string | null {
  return incidentDate(row)?.slice(0, 4) ?? null;
}

/**
 * Counts per year, newest first. Rows with no usable date are skipped rather
 * than lumped into an arbitrary year.
 */
export function bucketByYear(rows: IncidentDateInput[]): YearBucket[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const year = incidentYear(row);
    if (!year) continue;
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

/** The newest year with at least one case, or null when there is no data. */
export function latestYear(buckets: YearBucket[]): string | null {
  return buckets.length > 0 ? buckets[0].year : null;
}

/**
 * Resolves the year the feed should show.
 *
 * - no param at all: the newest year on file, so the landing view is current
 * - "all": the whole archive
 * - a year we actually hold cases for: that year
 * - anything else (junk, or a year with no cases): fall back to the archive,
 *   so a stale link never renders an empty feed
 */
export function resolveYear(
  param: string | undefined,
  buckets: YearBucket[],
): string | null {
  if (param === undefined || param === "") return latestYear(buckets);
  if (param === ALL_YEARS) return null;
  return buckets.some((b) => b.year === param) ? param : null;
}

/**
 * Half-open ISO range for a year: `start <= date < end`. Used to filter the
 * feed query without touching any stored row.
 */
export function yearRange(year: string): { start: string; end: string } {
  const numeric = Number(year);
  return {
    start: `${year}-01-01T00:00:00.000Z`,
    end: `${numeric + 1}-01-01T00:00:00.000Z`,
  };
}

/** Total across every year bucket, used for the "browse all N cases" link. */
export function totalAcrossYears(buckets: YearBucket[]): number {
  return buckets.reduce((sum, b) => sum + b.count, 0);
}
