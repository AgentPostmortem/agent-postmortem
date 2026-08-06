import { describe, expect, it } from "vitest";
import { redactEmails, redactPhones, redactPii } from "./pii";

describe("redactPii", () => {
  it("redacts email addresses and phone numbers", () => {
    const input =
      "Reach me at person@example.com or +1 (415) 555-1212 before launch.";

    expect(redactPii(input)).toBe(
      "Reach me at [EMAIL REDACTED] or [PHONE REDACTED] before launch.",
    );
  });

  it("redacts every email in one string", () => {
    expect(
      redactEmails("Contact alice@example.com and bob@domain.org today"),
    ).toBe("Contact [EMAIL REDACTED] and [EMAIL REDACTED] today");
  });

  it("redacts international phone numbers", () => {
    expect(redactPhones("Call me at +44 7700 900123")).toBe(
      "Call me at [PHONE REDACTED]",
    );
  });

  it("leaves a short extension-only digit run alone", () => {
    expect(redactPhones("ext 12")).toBe("ext 12");
  });

  it("documents that an extension attached to a phone is redacted together", () => {
    // Known over-match: PHONE_PATTERN includes the `ext 12` suffix, so the
    // whole match is redacted rather than only the main number.
    expect(redactPhones("call 555-1212 ext 12")).toBe("call [PHONE REDACTED]");
  });

  it("documents that a long non-phone digit run is over-redacted", () => {
    // Known over-match: an order ID with enough digits is treated as a phone
    // number. Conservative redaction is intentional in the utility.
    expect(redactPhones("Order 12345678901234567890")).toBe(
      "Order [PHONE REDACTED]",
    );
  });

  it("passes text without PII through unchanged", () => {
    expect(redactPii("This sentence has no PII.")).toBe(
      "This sentence has no PII.",
    );
  });
});
