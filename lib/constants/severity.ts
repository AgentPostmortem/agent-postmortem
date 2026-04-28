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
