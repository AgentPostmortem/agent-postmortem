import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AgentPostmortem",
  description:
    "We documented how AI agents fail in production, then built the install service that avoids every one of those failures.",
};

export default function AboutPage() {
  return (
    <div className="shell max-w-2xl py-12 sm:py-16">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
          About
        </p>
        <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-text-primary">
          We have seen every way agents fail. We install the ones that
          don&apos;t.
        </h1>
      </div>

      <div className="prose max-w-none space-y-8 text-text-secondary [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-text-primary [&_a]:text-accent [&_a:hover]:underline">
        <p>
          I&apos;m Royal Simpson Pinto, an AI and product engineer. I spent
          months documenting real AI agent failures in production: deleted data,
          wrong recipients, surprise bills, exposed credentials. That public
          registry still exists on this site, and every guardrail in my installs
          traces back to a case in it.
        </p>

        <p>
          The lesson from all those cases is simple. Agents fail when they get
          unlimited access, no audit trail, and nobody approving the risky
          calls. So that is exactly what my installs refuse to do: scoped keys,
          every action logged, and a human approval step for anything
          irreversible.
        </p>

        <h2>What I sell</h2>

        <p>
          One thing: a 14-day pilot that puts an agent on one of your support or
          portal workflows. Triage plus guarded refunds within your policy, or
          portal pulls with screenshot proof. $1,200 fixed, and the second half
          is only due if it closes real work. After that, $400 per month care,
          pause anytime.
        </p>

        <p>
          <a href="/pilot">Book the pilot here</a>. I reply within a day.
        </p>

        <h2>Why trust a solo builder</h2>

        <ul>
          <li>Fifteen-plus products live and maintained, not mockups</li>
          <li>
            1,500-plus open source contributions, including GSoC and Linux
            Foundation programs
          </li>
          <li>
            The backends behind the pilot are all running in production and
            linked from the <a href="/tools">proof page</a>
          </li>
        </ul>

        <h2>The failure registry</h2>

        <p>
          The public case registry remains online as a reference: numbered,
          tagged, searchable reports of agent incidents, with a moderation queue
          and anonymous submissions. It no longer defines this site; it is the
          evidence shelf the installs stand on.
        </p>

        <div id="contact">
          <h2>Contact</h2>

          <p>
            For pilot bookings, questions, or case disputes:{" "}
            <a href="mailto:hello@agentpostmortem.com">
              hello@agentpostmortem.com
            </a>
          </p>
        </div>

        <div className="mt-10 border-t border-border-default pt-6">
          <p className="font-mono text-xs text-text-tertiary">
            AgentPostmortem is an independent project. We are not affiliated
            with Anthropic, OpenAI, Google, Microsoft, or any AI vendor named in
            the case database.
          </p>
        </div>
      </div>
    </div>
  );
}
