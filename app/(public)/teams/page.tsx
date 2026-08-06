"use client";

import { useState } from "react";
import { z } from "zod";

const featureIcon = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const waitlistSchema = z.object({
  email: z.string().email(),
  company: z.string().min(1),
  role: z.string().min(1),
  useCase: z.string().optional(),
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

const FEATURES = [
  {
    icon: (
      <svg {...featureIcon}>
        <path d="M10 2.5l7 7.5-7 7.5L3 10l7-7.5z" />
        <path d="M10 6.5L13.5 10 10 13.5 6.5 10 10 6.5z" />
      </svg>
    ),
    title: "Private Case Repository",
    description:
      "Keep your internal AI failure reports private, searchable, and structured — separate from the public ledger.",
  },
  {
    icon: (
      <svg {...featureIcon}>
        <circle cx="10" cy="10" r="7.5" />
        <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Team Attribution",
    description:
      "Track which team, product, or project each failure originated in. Pattern analysis across your organization.",
  },
  {
    icon: (
      <svg {...featureIcon}>
        <circle cx="10" cy="10" r="7.5" />
        <circle cx="10" cy="10" r="3.5" />
      </svg>
    ),
    title: "Severity Dashboards",
    description:
      "Real-time dashboards showing incident frequency, damage trends, and agent performance comparisons.",
  },
  {
    icon: (
      <svg {...featureIcon}>
        <path d="M10 2.5l7 7.5-7 7.5L3 10l7-7.5z" />
      </svg>
    ),
    title: "API Access",
    description:
      "Programmatic submission via REST API. Integrate directly with your CI/CD pipelines, Slack, or PagerDuty.",
  },
  {
    icon: (
      <svg {...featureIcon}>
        <path d="M4 16.5h12M4 12.5l4-4 3 3 5-5" />
        <path d="M13 6.5h3v3" />
      </svg>
    ),
    title: "Compliance Export",
    description:
      "Export structured incident reports for SOC 2, ISO 27001, and AI governance documentation.",
  },
  {
    icon: (
      <svg {...featureIcon}>
        <circle cx="10" cy="10" r="7.5" />
        <path
          d="M10 2.5v15A7.5 7.5 0 0010 2.5z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
    title: "Benchmark Reports",
    description:
      "Compare your agent failure rate against anonymized industry benchmarks.",
  },
];

export default function TeamsPage() {
  const [formData, setFormData] = useState<Partial<WaitlistForm>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof WaitlistForm, string>>
  >({});
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = waitlistSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof WaitlistForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    setStatus("submitting");
    try {
      const response = await fetch("/api/teams/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (response.ok) {
        setStatus("success");
      } else {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setSubmitError(body?.error ?? "Submission failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setSubmitError("Submission failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-16 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          For Teams
        </p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-text-primary">
          Your AI Incident Management Platform
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          The same forensic rigor as the public ledger — built for enterprise
          teams running AI agents at scale. Private, compliant, and integrated.
        </p>
      </div>

      {/* Features grid */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-sm border border-border-default bg-bg-surface p-5"
          >
            <span className="font-mono text-lg text-accent">
              {feature.icon}
            </span>
            <h3 className="mt-3 font-serif text-base text-text-primary">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Waitlist form */}
      <div className="mx-auto max-w-lg">
        <div className="mb-6 border-b border-border-default pb-4">
          <h2 className="font-serif text-2xl font-normal text-text-primary">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Early access. No commitment. We&apos;ll reach out when your spot is
            ready.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-sm border border-border-default bg-bg-surface p-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Confirmed
            </p>
            <p className="mt-2 text-text-primary">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Work Email *
              </label>
              <input
                type="email"
                value={formData.email ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-accent">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Company *
              </label>
              <input
                type="text"
                value={formData.company ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
                placeholder="Acme Corp"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-accent">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Your Role *
              </label>
              <input
                type="text"
                value={formData.role ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
                placeholder="CTO, Security Lead, AI Engineer…"
              />
              {errors.role && (
                <p className="mt-1 text-xs text-accent">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Use Case (optional)
              </label>
              <textarea
                value={formData.useCase ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, useCase: e.target.value }))
                }
                rows={3}
                className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
                placeholder="Describe how you're currently tracking AI agent incidents…"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-accent">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-sm border border-accent/60 bg-accent-soft py-2.5 font-mono text-sm uppercase tracking-widest text-accent-strong transition-colors hover:border-accent-strong hover:bg-accent hover:text-bg-canvas disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting…" : "Request Access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
