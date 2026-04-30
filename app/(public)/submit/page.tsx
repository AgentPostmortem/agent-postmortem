import type { Metadata } from "next";
import { SubmitForm } from "@/components/post/SubmitForm";

export const metadata: Metadata = {
  title: "File a Case Report — AgentPostmortem",
  description:
    "Submit an AI agent failure case to the public registry. Anonymous submissions accepted.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="stamp stamp-red">Case Intake Form</span>
          <span className="font-mono text-[10px] text-text-tertiary">
            REF: APM-PENDING
          </span>
        </div>
        <h1 className="font-serif text-3xl font-normal text-text-primary sm:text-4xl">
          File a Case Report
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Document what went wrong. Anonymous submissions accepted. Please
          redact sensitive information in screenshots before upload. If you
          provide an email, you&apos;ll receive a private edit link for
          follow-up changes.
        </p>
      </div>

      {/* Guidelines */}
      <div className="mb-8 overflow-hidden rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default px-4 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            What makes a strong case
          </span>
        </div>
        <ul className="divide-y divide-border-default">
          {[
            "A specific, real incident — not a general complaint",
            "The exact instruction or prompt that triggered the failure",
            "What the agent actually did vs. what was intended",
            "Concrete impact: financial, operational, or reputational",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 px-4 py-2.5">
              <span className="mt-0.5 font-mono text-[10px] text-accent-red">
                →
              </span>
              <span className="text-sm text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <SubmitForm />
    </div>
  );
}
