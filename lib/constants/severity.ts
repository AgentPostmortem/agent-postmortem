export const SEVERITY_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Minor",
  2: "Moderate",
  3: "Significant",
  4: "Severe",
  5: "Catastrophic",
} as const;

export const SEVERITY_DESCRIPTIONS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Minor inconvenience. No lasting impact, easily reversed, no financial loss.",
  2: "Recoverable mistake. Required manual intervention but no lasting harm.",
  3: "Significant disruption. Hours of lost work, reputational embarrassment, or measurable financial impact under $10k.",
  4: "Serious damage. Customer data affected, security incident, or financial losses $10k–$100k.",
  5: "Catastrophic failure. Permanent data loss, major security breach, six-figure damages, or legal exposure.",
} as const;

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Whether a number is a real damage level.
 *
 * Severity arrives as a URL query string and reaches the database through
 * parseInt, so `?severity=99` and `?severity=abc` are both reachable. The
 * column only holds 1 to 5, and supabase-js now types it as that union, which
 * is what surfaced this: the filter was being built from unvalidated input.
 */
export function isSeverityLevel(value: number): value is SeverityLevel {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

/**
 * Visual encoding for each severity level. Severity is core content, so it gets
 * its own semantic scale, separate from the amber brand accent. Every consumer
 * must also render the label or the tick count, never colour alone.
 */
export interface SeverityStyle {
  /** Short registry label used in dense listings */
  short: string;
  text: string;
  bg: string;
  border: string;
  fill: string;
  stripe: string;
  bar: string;
}

export const SEVERITY_STYLES: Record<SeverityLevel, SeverityStyle> = {
  1: {
    short: "MINIMAL",
    text: "text-sev-low",
    bg: "bg-sev-low-soft",
    border: "border-sev-low/40",
    fill: "bg-sev-low",
    stripe: "bg-sev-low/60",
    bar: "w-1/5",
  },
  2: {
    short: "LOW",
    text: "text-sev-low",
    bg: "bg-sev-low-soft",
    border: "border-sev-low/40",
    fill: "bg-sev-low",
    stripe: "bg-sev-low",
    bar: "w-2/5",
  },
  3: {
    short: "MODERATE",
    text: "text-sev-medium",
    bg: "bg-sev-medium-soft",
    border: "border-sev-medium/40",
    fill: "bg-sev-medium",
    stripe: "bg-sev-medium",
    bar: "w-3/5",
  },
  4: {
    short: "SEVERE",
    text: "text-sev-high",
    bg: "bg-sev-high-soft",
    border: "border-sev-high/45",
    fill: "bg-sev-high",
    stripe: "bg-sev-high",
    bar: "w-4/5",
  },
  5: {
    short: "CRITICAL",
    text: "text-sev-critical",
    bg: "bg-sev-critical-soft",
    border: "border-sev-critical/50",
    fill: "bg-sev-critical",
    stripe: "bg-sev-critical",
    bar: "w-full",
  },
};

export function severityStyle(level: number): SeverityStyle {
  return SEVERITY_STYLES[(level as SeverityLevel) ?? 1] ?? SEVERITY_STYLES[1];
}
