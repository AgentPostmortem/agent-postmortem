import type { Metadata } from "next";
import Link from "next/link";
import { PilotForm } from "./PilotForm";

export const metadata: Metadata = {
  title: "Book the 14-day pilot — AgentPostmortem",
  description:
    "Apply for the $1,200 pilot: one support or portal workflow live as a guarded agent in 14 days. Second half only if it closes real work.",
  alternates: {
    canonical: "/pilot",
  },
};

const STEPS = [
  {
    n: "1",
    title: "Apply in 2 minutes",
    body: "Describe the workflow you hate doing. No call needed, no payment now.",
  },
  {
    n: "2",
    title: "Fit reply within a day",
    body: "You get a straight yes or no, the exact scope, and what access I need. If it is not a fit, I say so.",
  },
  {
    n: "3",
    title: "Live in 14 days, measured",
    body: "The agent runs on your tickets or portal with guardrails from day one. We count closed work together.",
  },
];

const INCLUDED = [
  "One support or portal workflow, installed on your stack",
  "Triage plus guarded refunds within your policy, or portal pulls with screenshot proof",
  "Scoped keys, full audit log, phone approvals for risky actions",
  "Loom walkthrough plus handover doc your team can follow",
  "14 days of fixes after delivery",
];

const FAQS = [
  {
    q: "What if it does not work?",
    a: "You pay half up front to start. The second half is only due if the agent closes real work in the pilot. If it does not, you keep everything built so far and pay nothing more.",
  },
  {
    q: "Do you need full access to our inbox or systems?",
    a: "No. Access is scoped to the one workflow: read the queue, act within agreed limits, escalate the rest. Every action is logged, and anything irreversible waits for your one-tap approval.",
  },
  {
    q: "What do you need from us to start?",
    a: "One contact who knows the workflow, read access to the queue or portal, and your refund and escalation limits in writing. Most teams get me this in a day.",
  },
  {
    q: "What happens after the 14 days?",
    a: "$400 per month care: monitoring, fixes, and small improvements. Pause or cancel anytime. You keep all docs and configs either way.",
  },
  {
    q: "Why should I trust a solo builder?",
    a: "Fifteen-plus products live, 1,500-plus open source contributions, and every guardrail in the install traces back to a documented failure case. The backends are running in production — try them on the proof page before you apply.",
  },
];

export default function PilotPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
      <header className="pb-10 pt-14 sm:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-[13px] font-medium text-stone-600 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          2 pilot slots open for September
        </p>
        <h1 className="mt-6 max-w-[22ch] font-sans text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-5xl">
          One workflow, on autopilot in{" "}
          <span className="whitespace-nowrap rounded-lg bg-emerald-100 px-2 text-emerald-900">
            14 days.
          </span>
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-text-secondary">
          $1,200 fixed. Second half only if it closes real work. Then $400
          per month care, pause anytime.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        <div>
          <section aria-label="How it works" className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <h2 className="mt-3 font-sans text-[17px] font-bold tracking-tight text-text-primary">
                  {s.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {s.body}
                </p>
              </div>
            ))}
          </section>

          <section aria-label="Included" className="mt-10">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-text-primary">
              What is included
            </h2>
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-text-secondary">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[12px] font-bold text-emerald-700">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Questions" className="mt-10">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-text-primary">
              Questions buyers actually ask
            </h2>
            <div className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
              {FAQS.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-sans text-[15px] font-bold text-text-primary marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span className="text-emerald-700 transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                    {f.a}{" "}
                    {f.q.startsWith("Why") && (
                      <Link href="/tools" className="font-semibold text-emerald-700 hover:text-emerald-800">
                        See the proof.
                      </Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-7">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Application
            </p>
            <p className="mt-2 font-sans text-2xl font-bold tracking-tight text-text-primary">
              $1,200 fixed
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              Half to start once we agree scope. Second half only on results.
            </p>
            <div className="mt-5 border-t border-stone-200 pt-5">
              <PilotForm />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
