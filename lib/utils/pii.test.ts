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

  it("documents with less than 7 digit number notredacted", () => {
    // as  the Minimum digit count for something to qualify as a phone number is 7
    expect(redactPhones("Order 123456")).toBe("Order 123456");
  });

  it("doesnt redacts a long tracking number as a phone number", () => {
    expect(redactPhones("Tracking number: 9400111899223856928490")).toBe(
      "Tracking number: 9400111899223856928490",
    );
  });

  // over-redacts scenarios

  it("over-redacts emails with invalid local-part separators", () => {
    expect(
      redactEmails(
        "Contact alice.@example.com and alice..smith@example.com today",
      ),
    ).toBe("Contact [EMAIL REDACTED] and [EMAIL REDACTED] today");
  });

  it("over-redacts emails with invalid domain separators", () => {
    expect(
      redactEmails("Contact bob@-domain.org and bob@domain-.org today"),
    ).toBe("Contact [EMAIL REDACTED] and [EMAIL REDACTED] today");
  });

  it("over-redacts emails with leading dots in the domain", () => {
    expect(redactEmails("Contact bob@.domain.org today")).toBe(
      "Contact [EMAIL REDACTED] today",
    );
  });

  it("over-redacts emails with consecutive dots in the domain", () => {
    expect(redactEmails("Contact bob@domain..org today")).toBe(
      "Contact [EMAIL REDACTED] today",
    );
  });

  it("over-redacts an email inside a URL", () => {
    expect(redactEmails("Visit https://alice@example.com/profile today")).toBe(
      "Visit https://[EMAIL REDACTED]/profile today",
    );
  });

  it("over-redacts a documentation email", () => {
    expect(redactEmails("Use user@example.com in the documentation")).toBe(
      "Use [EMAIL REDACTED] in the documentation",
    );
  });

  it("over-redacts multiple invalid email-like values in one string", () => {
    expect(
      redactEmails(
        "Values: _alice@example.com bob@domain..org carol.@example.com",
      ),
    ).toBe("Values: [EMAIL REDACTED] [EMAIL REDACTED] [EMAIL REDACTED]");
  });

  it("over-redacts a plain number as a phone number", () => {
    expect(redactPhones("Reference number: 1234567")).toBe(
      "Reference number: [PHONE REDACTED]",
    );
  });

  it("over-redacts a long numeric identifier as a phone number", () => {
    expect(redactPhones("Order ID: 001234567890")).toBe(
      "Order ID: [PHONE REDACTED]",
    );
  });

  it("over-redacts a version number as a phone number", () => {
    expect(redactPhones("Build version: 1.234.567")).toBe(
      "Build version: [PHONE REDACTED]",
    );
  });

  it("over-redacts an IP address as a phone number", () => {
    expect(redactPhones("Server IP: 192.168.1.1")).toBe(
      "Server IP: [PHONE REDACTED]",
    );
  });

  it("over-redacts a date-like value as a phone number", () => {
    expect(redactPhones("Reference date: 2026-08-06")).toBe(
      "Reference date: [PHONE REDACTED]",
    );
  });

  it("over-redacts a timestamp as a phone number", () => {
    expect(redactPhones("Created at: 20260806144500")).toBe(
      "Created at: [PHONE REDACTED]",
    );
  });

  it("over-redacts a postal code as a phone number", () => {
    expect(redactPhones("PIN code: 11000123")).toBe(
      "PIN code: [PHONE REDACTED]",
    );
  });

  it("over-redacts a currency amount as a phone number", () => {
    expect(redactPhones("Total amount: 123.456.789")).toBe(
      "Total amount: [PHONE REDACTED]",
    );
  });

  it("over-redacts coordinates as a phone number", () => {
    expect(redactPhones("Location: 28.6139 77.2090")).toBe(
      "Location: [PHONE REDACTED]",
    );
  });

  it("over-redacts an all-zero placeholder as a phone number", () => {
    expect(redactPhones("Placeholder: 000-000-0000")).toBe(
      "Placeholder: [PHONE REDACTED]",
    );
  });

  it("over-redacts a parenthesized value as a phone number", () => {
    expect(redactPhones("Value: (2026) 1234567")).toBe(
      "Value: [PHONE REDACTED]",
    );
  });

  it("over-redacts an extension-like value as a phone number", () => {
    expect(redactPhones("Extension: ext-1234568")).toBe(
      "Extension: ext-[PHONE REDACTED]",
    );
  });

  it("over-redacts a number embedded in an identifier", () => {
    expect(redactPhones("Serial number: ABC-1234567-XYZ")).toBe(
      "Serial number: ABC-[PHONE REDACTED]-XYZ",
    );
  });

  it("over-redacts multiple non-phone values in one string", () => {
    expect(
      redactPhones(
        "Date 2026-08-06, IP 192.168.1.1, version 1.234.567, order 001234567890",
      ),
    ).toBe(
      "Date [PHONE REDACTED], IP [PHONE REDACTED], version [PHONE REDACTED], order [PHONE REDACTED]",
    );
  });

  it("over-redacts an email embedded in a larger token", () => {
    expect(redactEmails("Contact prefixalice@example.comsuffix today")).toBe(
      "Contact [EMAIL REDACTED] today",
    );
  });
});
