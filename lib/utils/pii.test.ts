import { describe, expect, it } from "vitest";
import { redactPii } from "./pii";

describe("redactPii", () => {
  it("redacts email addresses and phone numbers", () => {
    const input =
      "Reach me at person@example.com or +1 (415) 555-1212 before launch.";

    expect(redactPii(input)).toBe(
      "Reach me at [EMAIL REDACTED] or [PHONE REDACTED] before launch.",
    );
  });
});
