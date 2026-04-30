type EventLevel = "info" | "warn" | "error";

interface EventPayload {
  event: string;
  level?: EventLevel;
  [key: string]: unknown;
}

export function logEvent({ level = "info", ...payload }: EventPayload) {
  const logger =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : console.info;

  logger(JSON.stringify(payload));
}
