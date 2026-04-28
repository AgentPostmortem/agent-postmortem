export interface Tag {
  slug: string;
  label: string;
  description: string;
}

export const TAGS: Tag[] = [
  {
    slug: "hallucination",
    label: "hallucination",
    description:
      "The agent confidently generated false information, fabricated APIs, URLs, or facts.",
  },
  {
    slug: "expensive-mistake",
    label: "expensive-mistake",
    description:
      "The agent's actions resulted in significant unexpected financial costs.",
  },
  {
    slug: "wrong-recipient",
    label: "wrong-recipient",
    description:
      "Messages, emails, or data were sent to unintended recipients.",
  },
  {
    slug: "deleted-data",
    label: "deleted-data",
    description:
      "The agent permanently deleted files, database records, or storage objects.",
  },
  {
    slug: "security-fail",
    label: "security-fail",
    description:
      "Credentials, secrets, or sensitive data were exposed or mishandled.",
  },
  {
    slug: "social-blunder",
    label: "social-blunder",
    description:
      "The agent caused embarrassment, reputation damage, or interpersonal harm.",
  },
  {
    slug: "code-disaster",
    label: "code-disaster",
    description:
      "The agent produced, committed, or deployed broken, destructive, or insecure code.",
  },
  {
    slug: "infinite-loop",
    label: "infinite-loop",
    description:
      "The agent entered an unrecoverable loop, causing resource exhaustion or runaway costs.",
  },
  {
    slug: "scope-creep",
    label: "scope-creep",
    description:
      "The agent took actions far beyond the intended scope of the task.",
  },
  {
    slug: "compliance-violation",
    label: "compliance-violation",
    description:
      "The agent's actions violated legal, regulatory, or policy requirements.",
  },
  {
    slug: "data-exfiltration",
    label: "data-exfiltration",
    description:
      "The agent transmitted sensitive data to external or unintended destinations.",
  },
  {
    slug: "misunderstood-instruction",
    label: "misunderstood-instruction",
    description:
      "The agent fundamentally misinterpreted a clear instruction and acted on the wrong assumption.",
  },
];
