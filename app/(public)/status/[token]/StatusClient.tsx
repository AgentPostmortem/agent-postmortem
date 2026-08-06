"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

interface StatusData {
  caseNumber: string | null;
  title: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  agentName: string;
}

type StatusResponse = StatusData | { error: string };

const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    description:
      "Your submission is in the moderation queue. This typically takes 1–3 days.",
    color: "text-text-secondary",
    dot: "bg-text-tertiary",
  },
  approved: {
    label: "Approved — Live",
    description:
      "Your case has been approved and is publicly visible in the registry.",
    color: "text-accent",
    dot: "bg-accent",
  },
  rejected: {
    label: "Not Published",
    description:
      "Your submission did not meet our publishing criteria. You may file a new report with more detail.",
    color: "text-text-tertiary",
    dot: "bg-border-strong",
  },
};

export function StatusClient() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/status/${token}`)
      .then((r) => r.json())
      .then((json) => {
        const response = json as StatusResponse;
        if ("error" in response) {
          setNotFound(true);
          return;
        }
        setData(response);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-mono text-sm text-text-tertiary">Loading…</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-serif text-2xl text-text-primary">
          Submission not found
        </p>
        <p className="mt-3 text-sm text-text-tertiary">
          The link may be invalid or your token may not match any submission.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-text-tertiary hover:text-text-primary"
        >
          <ArrowLeftIcon size={10} /> Back to Registry
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[data.status];
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(data.createdAt));

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        <span>Submission Status</span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-text-primary">
          Submission Status
        </h1>
      </div>

      <div className="rounded-sm border border-border-default bg-bg-surface px-6 py-6">
        {/* Status indicator */}
        <div className="mb-5 flex items-center gap-3">
          <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
          <span
            className={`font-mono text-sm font-semibold uppercase tracking-wider ${cfg.color}`}
          >
            {cfg.label}
          </span>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-text-secondary">
          {cfg.description}
        </p>

        <div className="space-y-3 border-t border-border-default pt-5">
          <div className="flex items-start justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Title
            </span>
            <span className="text-right text-sm text-text-primary">
              {data.title}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Agent
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {data.agentName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Submitted
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {date}
            </span>
          </div>
          {data.caseNumber && (
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Case Number
              </span>
              <span className="font-mono text-xs text-accent">
                {data.caseNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {data.status === "approved" && data.caseNumber && (
          <Link
            href={`/case/${data.caseNumber.toLowerCase()}`}
            className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-accent-strong hover:bg-accent/20"
          >
            <span className="inline-flex items-center gap-1.5">
              View Case <ArrowRightIcon size={10} />
            </span>
          </Link>
        )}
        {data.status !== "rejected" && (
          <Link
            href={`/edit/${token}`}
            className="rounded-sm border border-border-default bg-bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:border-border-strong hover:text-text-primary"
          >
            Edit Submission
          </Link>
        )}
        <Link
          href="/"
          className="rounded-sm border border-border-default bg-bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-tertiary hover:border-border-strong hover:text-text-secondary"
        >
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeftIcon size={10} /> Registry
          </span>
        </Link>
      </div>
    </div>
  );
}
