"use client";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { getSiteUrl } from "@/lib/utils/urls";

export function CopyLinkButton({ caseNumber }: { caseNumber: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    if (!navigator.clipboard) {
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(`${getSiteUrl()}/case/${caseNumber}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
    }
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-text-tertiary hover:text-text-primary"
    >
      {copied ? (
        <>
          Copied <CheckIcon size={10} />
        </>
      ) : failed ? (
        "Could not copy, copy the URL from the address bar"
      ) : (
        "Copy Link"
      )}
    </button>
  );
}
