import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AgentPostmortem — Support and ops agents installed in 14 days",
  description:
    "Done-for-you pilot: an agent that closes support tickets within policy and runs portal ops with screenshot proof. Fixed price, approval-gated, live in 14 days.",
  alternates: {
    canonical: "/",
  },
};

const ASSURANCES = [
  "Scoped access, never full inbox keys",
  "Every action written to an audit log",
  "Risky actions paused for your approval",
];

const PLAN_CARDS = [
  {
    step: "Week 1",
    title: "One workflow goes live",
    body: "Your highest pain ticket queue or portal report, running as an agent on your stack.",
  },
  {
    step: "Guardrails",
    title: "Approvals from day one",
    body: "Per tool permissions, full audit trail, and one tap phone approval for anything irreversible.",
  },
  {
    step: "Price",
    title: "$1,200 fixed",
    body: "Then $400 per month care, pause anytime. Second half only due if it closes real work.",
  },
];

const OFFER = [
  {
    title: "Support triage",
    body: "Order status and simple refunds auto resolved within your limits. Large or risky cases arrive as escalations with a proposed reply and reason, so approval takes seconds.",
  },
  {
    title: "Portal ops",
    body: "For the tools with no API: weekly pulls, order checks, and report exports with screenshot proof and structured output you can audit line by line.",
  },
  {
    title: "Safety layer",
    body: "Scoped keys, per tool permissions, full audit trail, and phone approvals for anything irreversible. Nothing acts blind.",
  },
];

const PROOF: { label: string; description: string; href: string }[] = [
  {
    label: "Resolvd",
    description: "Support triage plus guarded refunds. Try the live demo.",
    href: "https://resolvd.agentpostmortem.com",
  },
  {
    label: "Webhands",
    description: "Portal pulls with screenshot proof. Try the live demo.",
    href: "https://webhands.agentpostmortem.com",
  },
  {
    label: "Greenlite",
    description: "One tap phone approvals for risky actions. Try it live.",
    href: "https://greenlite.agentpostmortem.com",
  },
];

export default function HomePage() {
  return (
    <div className="bg-stone-50 text-stone-900">
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        {/* Hero */}
        <header className="pb-14 pt-14 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-[13px] font-medium text-stone-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            2 pilot slots open for September
          </p>

          <h1 className="mt-7 max-w-[20ch] font-sans text-[2.6rem] font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl">
            An agent that closes tickets and runs portal ops, live in{" "}
            <span className="whitespace-nowrap rounded-lg bg-emerald-100 px-2 text-emerald-900">
              14 days.
            </span>
          </h1>

          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-stone-600">
            Done for you install for support and ops teams. Triage plus
            small refunds within policy, portal pulls with screenshot proof,
            risky actions paused for your one tap approval.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pilot"
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-700"
            >
              Book the $1,200 pilot
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-7 py-3.5 text-[15px] font-semibold text-stone-800 shadow-sm transition-colors hover:border-stone-400"
            >
              See live proof
            </Link>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {ASSURANCES.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-stone-600"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[12px] font-bold text-emerald-700">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </header>

        {/* Plan cards */}
        <section aria-label="How the pilot works" className="grid gap-4 md:grid-cols-3">
          {PLAN_CARDS.map((card, i) => (
            <div
              key={card.step}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                {card.step}
              </p>
              <h2 className="mt-4 font-sans text-xl font-bold tracking-tight">
                {card.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                {card.body}
              </p>
            </div>
          ))}
        </section>

        {/* Offer detail */}
        <section aria-label="What you get" className="mt-16">
          <h2 className="max-w-[24ch] font-sans text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            One workflow, fully owned by the agent. You keep the veto.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {OFFER.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-stone-900 p-6 text-white shadow-xl shadow-stone-900/10"
              >
                <h3 className="font-sans text-lg font-bold">{item.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-stone-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof */}
        <section aria-label="Live proof" className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-sans text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              Try the backends live
            </h2>
            <Link
              href="/tools"
              className="text-[15px] font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All backends →
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {PROOF.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="font-sans text-lg font-bold">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-stone-600">
                    {item.description}
                  </span>
                  <span className="mt-4 inline-block text-[15px] font-semibold text-emerald-700 transition-transform group-hover:translate-x-1">
                    Open demo →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing */}
        <section
          id="pilot"
          className="mt-16 scroll-mt-24 overflow-hidden rounded-3xl bg-emerald-950 px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <h2 className="mx-auto max-w-[24ch] font-sans text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            If it does not close real work, you do not pay the second half.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-emerald-100/80">
            $1,200 fixed for the 14 day pilot. Then $400 per month care,
            pause anytime. Reply within a day.
          </p>
          <Link
            href="/pilot"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-4 text-[15px] font-bold text-emerald-950 shadow-xl transition-colors hover:bg-emerald-300"
          >
            Book the pilot →
          </Link>
        </section>
      </div>
    </div>
  );
}
