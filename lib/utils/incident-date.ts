/**
 * The date a case should show to a reader.
 *
 * `created_at` is a record-keeping timestamp: when the row landed in our
 * database. Because cases are imported in batches, dozens of them share a
 * handful of `created_at` values, which makes any timeline built on it a
 * meaningless spike.
 *
 * `source_published_at` is the publication date of the source article, which
 * is the closest thing we have to when the incident was actually documented.
 * Prefer it everywhere a date is user-facing, and fall back to `created_at`
 * only when the source date is unknown.
 *
 * Accepts both a raw database row (snake_case) and a mapped `Post`
 * (camelCase) so this rule lives in exactly one place.
 */
export interface IncidentDateInput {
  source_published_at?: string | null;
  created_at?: string | null;
  sourcePublishedAt?: string | null;
  createdAt?: string | null;
}

export function incidentDate(
  row: IncidentDateInput & { created_at: string },
): string;
export function incidentDate(
  row: IncidentDateInput & { createdAt: string },
): string;
export function incidentDate(row: IncidentDateInput): string | null;
export function incidentDate(row: IncidentDateInput): string | null {
  return (
    row.source_published_at ??
    row.sourcePublishedAt ??
    row.created_at ??
    row.createdAt ??
    null
  );
}

/** "YYYY-MM" bucket for the incident date, or null when no date is known. */
export function incidentMonth(row: IncidentDateInput): string | null {
  return incidentDate(row)?.slice(0, 7) ?? null;
}
