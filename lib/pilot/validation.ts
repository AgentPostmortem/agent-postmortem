import { z } from "zod";

export const pilotSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(200).optional().default(""),
  track: z.enum(["support", "portal", "unsure"]),
  workflow: z.string().trim().min(20).max(2000),
});

export type PilotInput = z.infer<typeof pilotSchema>;
export type PilotField = keyof PilotInput;
export type PilotErrors = Partial<Record<PilotField, string>>;

export const PILOT_LIMITS = {
  name: 120,
  email: 254,
  company: 200,
  workflowMin: 20,
  workflowMax: 2000,
} as const;

function messageFor(
  path: string | number | undefined,
  code: string | undefined,
): string {
  if (path === "email")
    return "Enter a valid work email, like ada@company.com.";
  if (path === "name") return "Tell us your name.";
  if (path === "company") return "Keep this under 200 characters.";
  if (path === "track") return "Pick support, portal ops, or not sure.";
  if (path === "workflow")
    return code === "too_small"
      ? `Describe the workflow in a sentence or two (at least ${PILOT_LIMITS.workflowMin} characters).`
      : `Keep the description under ${PILOT_LIMITS.workflowMax} characters.`;
  return "Check this field and try again.";
}

/**
 * Single source of truth for pilot validation, shared by the client form
 * (instant feedback) and the API route (enforcement). Returns every field
 * error at once so the form can show them all inline.
 */
export function validatePilot(
  input: unknown,
): { ok: true; data: PilotInput } | { ok: false; errors: PilotErrors } {
  const parsed = pilotSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };

  const errors: PilotErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as PilotField | undefined;
    if (field && !(field in errors)) {
      errors[field] = messageFor(field, issue.code);
    }
  }
  return { ok: false, errors };
}

/** First message for callers that only show one line. */
export function firstPilotError(errors: PilotErrors): string {
  const order: PilotField[] = ["name", "email", "company", "track", "workflow"];
  for (const field of order) {
    if (errors[field]) return errors[field] as string;
  }
  return "Check the form and try again.";
}
