import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – AgentPostmortem",
  description:
    "How AgentPostmortem collects, uses, and protects information about visitors and submitters.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Registry / Privacy Policy
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          Privacy Policy
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary [&_h2]:font-serif [&_h2]:font-normal [&_h2]:text-text-primary [&_a]:text-accent-red [&_a:hover]:underline">
        <p>
          We built AgentPostmortem to be as privacy-respecting as a public
          registry can be. This policy explains what information we collect, how
          we use it, and what we do not do.
        </p>

        <h2>What We Collect</h2>

        <p>
          When you browse the registry we collect standard server logs: your
          hashed IP address (see below), the page requested, timestamp, and
          user-agent string. We do not require an account to browse or to submit
          a case. If you choose to provide an email address during submission,
          we collect that too — for the sole purpose described below.
        </p>

        <h2>How We Use It</h2>

        <p>
          Log data is used only to operate the site: diagnosing errors,
          understanding traffic patterns, and detecting abuse. Email addresses
          provided at submission time are used only to send the submitter a
          private edit link for their case. We do not use any collected
          information for advertising, profiling, or sale to third parties.
        </p>

        <h2>Anonymous Submissions</h2>

        <p>
          Providing an email address when submitting a case is entirely
          optional. If you do not provide one, your submission is fully
          anonymous from our side. If you do provide one, it is used to deliver
          a single transactional email containing your private edit link and is
          not retained in our database after that email is sent.
        </p>

        <p>
          We also run basic automated redaction on submitted text before it
          reaches our database: email addresses, phone numbers, and common PII
          patterns are stripped. Screenshot and file uploads are stored as
          provided — please remove sensitive information from evidence before
          uploading.
        </p>

        <h2>IP Hashing</h2>

        <p>
          We never store IP addresses in plaintext. Incoming IPs are immediately
          hashed with a secret server-side pepper using a one-way function. The
          hash is used for rate-limiting and abuse detection only. The pepper is
          rotated periodically, which permanently destroys the ability to link
          old hashes to their source IPs. No IP address can be recovered from
          the hashes we store.
        </p>

        <h2>Cookies</h2>

        <p>
          We set a minimal session cookie when you visit the site. It contains
          no personally identifying information and exists only to maintain
          basic site functionality (e.g. CSRF protection). We do not use
          tracking cookies, analytics cookies, or any third-party advertising
          cookies.
        </p>

        <h2>Third-Party Services</h2>

        <p>
          Running this registry requires a small number of third-party
          infrastructure providers. Each sees a limited slice of data:
        </p>

        <ul>
          <li>
            <strong>Supabase</strong> — our database and storage provider. Case
            data and hashed IPs are stored here. Supabase infrastructure is
            hosted on AWS.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the Next.js application. Vercel sees
            request logs in the normal course of serving the site.
          </li>
          <li>
            <strong>Cloudflare</strong> — provides DNS, DDoS protection, and
            CDN. Cloudflare sees raw IP addresses as part of proxying requests
            before they reach our application.
          </li>
          <li>
            <strong>Resend</strong> — transactional email provider. Used only to
            send edit-link emails to submitters who provide an address. Resend
            receives the recipient address and the email body for that single
            send.
          </li>
        </ul>

        <p>
          We do not use Google Analytics, Mixpanel, Segment, or any behavioural
          analytics platform.
        </p>

        <h2>Data Retention</h2>

        <p>
          Published case records are retained indefinitely — that is the point
          of a public ledger. Server logs are retained for up to 90 days and
          then deleted. Hashed IPs in rate-limit records are purged after 30
          days. Submitter emails, as noted above, are not retained after the
          edit-link email is delivered.
        </p>

        <h2>Contact</h2>

        <p>
          If you have questions about this policy, believe your personal
          information has been mishandled, or want to request deletion of
          something, contact us at{" "}
          <a href="mailto:hello@agentpostmortem.com">
            hello@agentpostmortem.com
          </a>
          . We will respond within 10 business days.
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
