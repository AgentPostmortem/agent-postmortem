"use client";
import { useState } from "react";

export function CopyLinkButton({ caseNumber }: { caseNumber: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(
          `https://agentpostmortem.com/case/${caseNumber}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:text-text-primary"
    >
      {copied ? "Copied ✓" : "Copy Link"}
    </button>
  );
}
