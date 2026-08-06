/**
 * Case number allocation.
 *
 * Case numbers are `APM-` plus a zero padded sequence (`APM-0044`). They are
 * permanent identifiers: once a number has been minted it is never handed to a
 * second post, even if the original case is later retired or rejected.
 *
 * The sequence is therefore derived from the HIGHEST number that exists on any
 * row, not from a count of approved rows. A count silently reuses numbers as
 * soon as a single case is retired.
 */

export const CASE_NUMBER_PREFIX = "APM-";
export const CASE_NUMBER_PAD = 4;
export const MAX_CASE_NUMBER_ATTEMPTS = 5;

const CASE_NUMBER_PATTERN = /^APM-(\d+)$/i;
const POSTGRES_UNIQUE_VIOLATION = "23505";

/** Numeric suffix of a case number, or null when the value is not one. */
export function parseCaseNumber(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = CASE_NUMBER_PATTERN.exec(value.trim());
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Render a sequence number in the canonical `APM-0001` form. */
export function formatCaseNumber(sequence: number): string {
  return `${CASE_NUMBER_PREFIX}${sequence.toString().padStart(CASE_NUMBER_PAD, "0")}`;
}

/**
 * Next free case number given every case number currently on file.
 * Gaps are never backfilled, so retired numbers stay retired.
 */
export function nextCaseNumber(existing: Array<string | null>): string {
  let highest = 0;
  for (const value of existing) {
    const parsed = parseCaseNumber(value);
    if (parsed !== null && parsed > highest) highest = parsed;
  }
  return formatCaseNumber(highest + 1);
}

/** True when a Postgres/PostgREST error is a unique constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { code, message } = error as { code?: unknown; message?: unknown };
  if (code === POSTGRES_UNIQUE_VIOLATION) return true;
  return typeof message === "string" && /duplicate key value/i.test(message);
}

export interface CaseNumberDeps<T> {
  /** Every case number currently stored, including retired and rejected ones. */
  listCaseNumbers: () => PromiseLike<Array<string | null>>;
  /** Persist the row with the supplied case number. */
  update: (
    caseNumber: string,
  ) => PromiseLike<{ data: T | null; error: unknown }>;
  /** Bounded retry budget. */
  attempts?: number;
}

export interface CaseNumberResult<T> {
  data: T | null;
  error: unknown;
  caseNumber: string | null;
}

/**
 * Assign the next case number and write it, retrying on unique violations.
 *
 * Two admins approving at the same moment both read the same maximum, so the
 * second write loses to the unique index on `posts.case_number`. Rather than
 * locking, we re-derive the number from scratch on each attempt and try again;
 * the loop is bounded so a genuinely broken write still surfaces its error.
 */
export async function updateWithFreshCaseNumber<T>(
  deps: CaseNumberDeps<T>,
): Promise<CaseNumberResult<T>> {
  const attempts = deps.attempts ?? MAX_CASE_NUMBER_ATTEMPTS;
  let last: CaseNumberResult<T> = {
    data: null,
    error: new Error("Case number allocation made no attempts."),
    caseNumber: null,
  };

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const caseNumber = nextCaseNumber(await deps.listCaseNumbers());
    const { data, error } = await deps.update(caseNumber);
    last = { data, error, caseNumber };

    if (!error) return last;
    if (!isUniqueViolation(error)) return last;
  }

  return last;
}
