import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About AgentPostmortem",
  description:
    "Why we built a public ledger for AI agent failures and how we handle privacy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          About
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          Why This Exists
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary [&_h2]:font-serif [&_h2]:font-normal [&_h2]:text-text-primary [&_a]:text-accent-red [&_a:hover]:underline">
        <p>
          Aviation has the NTSB. Medicine has morbidity and mortality
          conferences. Software has postmortems. But AI agents (systems making
          autonomous decisions with real-world consequences) have nothing.
          Failures happen quietly, root causes are never shared, and the
          industry learns nothing.
        </p>

        <p>
          AgentPostmortem is a structured public ledger for AI agent failures.
          Every case is numbered, tagged, and searchable. The goal is not to
          shame vendors or teams. The goal is to give practitioners a shared
          base of evidence so we don&apos;t keep making the same mistakes.
        </p>

        <h2>How We Handle Privacy</h2>

        <p>
          All submissions can be anonymous. We redact emails, phone numbers, and
          other obvious PII from submitted text before it reaches our database.
          IP addresses are hashed with a secret pepper and never stored in
          plaintext. If you provide an email, it&apos;s used only to deliver
          your private edit link and is not retained after delivery. Screenshot
          uploads are stored as provided, so submitters should remove sensitive
          information before uploading evidence.
        </p>

        <h2>What Makes a Good Case Report</h2>

        <ul>
          <li>A specific, reproducible incident, not a general complaint</li>
          <li>The instruction or prompt that triggered the failure</li>
          <li>What the agent actually did versus what was intended</li>
          <li>Concrete damages: financial, reputational, operational</li>
          <li>Evidence where possible (screenshots, logs)</li>
        </ul>

        <h2>Moderation</h2>

        <p>
          Every submission is reviewed before publication. We reject cases that
          are vague, unverifiable, or appear to be targeted harassment. Approved
          cases are assigned a permanent case number (APM-XXXX) and indexed
          immediately.
        </p>

        <h2>Open Source</h2>

        <p>
          AgentPostmortem is open source. The registry code is publicly
          available, and contributions, bug reports, and new agent/tag additions
          are welcome on{" "}
          <a
            href="https://github.com/AgentPostmortem/agent-postmortem"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <h2>For Teams</h2>

        <p>
          If you run AI agents at scale and need private incident tracking,
          compliance exports, or API access, see our{" "}
          <Link href="/teams">Teams offering</Link>.
        </p>

        <div id="contact">
          <h2>Contact</h2>

          <p>
            For editorial questions, case disputes, or partnership inquiries:{" "}
            <a href="mailto:hello@agentpostmortem.com">
              hello@agentpostmortem.com
            </a>
          </p>
        </div>

        <div className="mt-10 border-t border-border-default pt-6">
          <p className="font-mono text-xs text-text-tertiary">
            AgentPostmortem is an independent project. We are not affiliated
            with Anthropic, OpenAI, Google, Microsoft, or any AI vendor listed
            in the case database.
          </p>
        </div>
      </div>
    </div>
  );
}
