import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – AgentPostmortem",
  description:
    "Get in touch with the AgentPostmortem team for case disputes, editorial questions, partnerships, and abuse reports.",
};

export default function ContactPage() {
  return (
    <div className="shell max-w-2xl py-12 sm:py-16">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Registry / Contact
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          Contact
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary [&_h2]:font-serif [&_h2]:font-normal [&_h2]:text-text-primary [&_a]:text-accent [&_a:hover]:underline">
        <p>
          The best way to reach us is by email. We try to respond within a few
          business days.
        </p>

        <p>
          <a href="mailto:hello@agentpostmortem.com">
            hello@agentpostmortem.com
          </a>
        </p>

        <h2>Case Disputes</h2>

        <p>
          If a published case contains factually incorrect information about
          your product or organization, email us with the case number, the
          specific claim in dispute, and any supporting evidence. We take
          accuracy seriously and will investigate promptly. Our goal is a
          correct record, not a one-sided one.
        </p>

        <h2>Editorial Questions</h2>

        <p>
          Questions about our editorial process, why a submission was rejected,
          or how we assign severity and tags, send them our way. We are also
          open to feedback on the case format itself.
        </p>

        <h2>Partnerships</h2>

        <p>
          We are interested in hearing from AI safety researchers, journalism
          outlets, and legal or policy teams working on AI accountability. If
          you represent an organization that wants to contribute data,
          co-publish research, or discuss API access, get in touch.
        </p>

        <h2>Abuse Reports</h2>

        <p>
          If you believe a case has been submitted maliciously (to harass a
          person or defame an organization without factual basis), please email
          us with the case number and a clear explanation. Include any evidence
          you have. We investigate all abuse reports and will remove cases that
          do not meet our standards.
        </p>

        <h2>Bug Reports</h2>

        <p>
          For technical issues with the site, please open an issue on{" "}
          <a
            href="https://github.com/AgentPostmortem/agent-postmortem"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          . Bug reports and pull requests are welcome.
        </p>

        <div className="mt-10 border-t border-border-default pt-6">
          <p className="font-mono text-xs text-text-tertiary">
            AgentPostmortem is an independent project. Response times may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
