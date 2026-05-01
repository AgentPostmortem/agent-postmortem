export interface Tag {
  slug: string;
  label: string;
  description: string;
}

export const TAGS: Tag[] = [
  {
    slug: "hallucination",
    label: "Hallucination",
    description:
      "The agent confidently generated false information, fabricated APIs, URLs, or facts.",
  },
  {
    slug: "expensive-mistake",
    label: "Expensive Mistake",
    description:
      "The agent's actions resulted in significant unexpected financial costs.",
  },
  {
    slug: "wrong-recipient",
    label: "Wrong Recipient",
    description:
      "Messages, emails, or data were sent to unintended recipients.",
  },
  {
    slug: "deleted-data",
    label: "Deleted Data",
    description:
      "The agent permanently deleted files, database records, or storage objects.",
  },
  {
    slug: "security-fail",
    label: "Security Fail",
    description:
      "Credentials, secrets, or sensitive data were exposed or mishandled.",
  },
  {
    slug: "social-blunder",
    label: "Social Blunder",
    description:
      "The agent caused embarrassment, reputation damage, or interpersonal harm.",
  },
  {
    slug: "code-disaster",
    label: "Code Disaster",
    description:
      "The agent produced, committed, or deployed broken, destructive, or insecure code.",
  },
  {
    slug: "infinite-loop",
    label: "Infinite Loop",
    description:
      "The agent entered an unrecoverable loop, causing resource exhaustion or runaway costs.",
  },
  {
    slug: "scope-creep",
    label: "Scope Creep",
    description:
      "The agent took actions far beyond the intended scope of the task.",
  },
  {
    slug: "compliance-violation",
    label: "Compliance Violation",
    description:
      "The agent's actions violated legal, regulatory, or policy requirements.",
  },
  {
    slug: "data-exfiltration",
    label: "Data Exfiltration",
    description:
      "The agent transmitted sensitive data to external or unintended destinations.",
  },
  {
    slug: "misunderstood-instruction",
    label: "Misunderstood Instruction",
    description:
      "The agent fundamentally misinterpreted a clear instruction and acted on the wrong assumption.",
  },
];
