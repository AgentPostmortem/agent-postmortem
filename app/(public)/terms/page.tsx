import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – AgentPostmortem",
  description:
    "Terms governing use of the AgentPostmortem public registry of AI agent failures.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Registry / Terms of Service
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          Terms of Service
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary [&_h2]:font-serif [&_h2]:font-normal [&_h2]:text-text-primary [&_a]:text-accent [&_a:hover]:underline">
        <p>
          These terms govern your use of AgentPostmortem (agentpostmortem.com).
          By accessing or submitting to the registry, you agree to them. If you
          do not agree, do not use the site.
        </p>

        <h2>Acceptance of Terms</h2>

        <p>
          Using AgentPostmortem (whether to browse cases, submit an incident, or
          access the API) constitutes acceptance of these terms. We may update
          them from time to time; continued use after changes are posted means
          you accept the revised terms.
        </p>

        <h2>Use of the Registry</h2>

        <p>
          The registry is a public reference resource. You may read, link, and
          cite cases freely. You may not scrape the site at a rate that disrupts
          availability, attempt to access unpublished submissions, reverse
          engineer any moderation process, or use the registry to build a
          competing product that reproduces its structured dataset without prior
          written agreement.
        </p>

        <h2>Submissions</h2>

        <p>
          When you submit a case report, you represent that the incident
          occurred as described, that you have standing to report it (you were
          affected, witnessed it, or have credible secondhand knowledge), and
          that you are not submitting the case to harass or defame a specific
          individual. You grant AgentPostmortem a perpetual, royalty-free
          license to publish, index, and display the submission under its
          assigned case number. Submissions that are found to be fabricated may
          be removed and the submitter may be blocked from future submissions.
        </p>

        <h2>Content Standards</h2>

        <p>
          Every submission is reviewed before publication. We reject cases that
          are vague, unverifiable, targeted harassment, or promotional content
          disguised as incident reports. Published cases may be corrected or
          annotated by our editorial team when new information comes to light.
          Approved cases receive a permanent case number and are not removed
          except in exceptional circumstances (e.g. court order, credible
          evidence of fabrication).
        </p>

        <h2>Disclaimers</h2>

        <p>
          The registry is provided &ldquo;as is.&rdquo; Case reports reflect the
          experience of submitters and have not been independently verified
          beyond our editorial review. We make no warranty about the accuracy,
          completeness, or fitness for any particular purpose of any case or the
          registry as a whole. AgentPostmortem is an independent project and is
          not affiliated with any AI vendor listed in the case database.
        </p>

        <h2>Limitation of Liability</h2>

        <p>
          To the maximum extent permitted by applicable law, AgentPostmortem and
          its operators shall not be liable for any indirect, incidental,
          special, or consequential damages arising out of your use of or
          inability to use the registry, including reliance on any case report.
          Our total liability for any claim shall not exceed the greater of $100
          USD or the amount you paid us in the preceding twelve months (which,
          for most users, is zero).
        </p>

        <h2>Changes to Terms</h2>

        <p>
          We will post changes to these terms on this page with an updated date.
          For material changes we will include a notice on the homepage for at
          least thirty days. Questions about these terms can be directed to{" "}
          <a href="mailto:hello@agentpostmortem.com">
            hello@agentpostmortem.com
          </a>
          .
        </p>

        <div className="mt-10 border-t border-border-default pt-6">
          <p className="font-mono text-xs text-text-tertiary">
            Last updated: May 2025
          </p>
        </div>
      </div>
    </div>
  );
}
