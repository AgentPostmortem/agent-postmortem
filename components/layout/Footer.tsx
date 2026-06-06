import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const LINK_GROUPS = [
  {
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/teams", label: "Teams" },
    ],
  },
  {
    links: [
      { href: "/hall-of-fame", label: "Hall of Fame" },
      { href: "/stats", label: "Stats" },
      { href: "/submit", label: "File a Report" },
      {
        href: "https://github.com/AgentPostmortem/agent-postmortem",
        label: "GitHub",
        external: true,
      },
    ],
  },
  {
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border-default">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-sm bg-accent-red" />
              <span className="font-serif text-sm text-text-primary">
                AgentPostmortem
              </span>
            </div>
            <p className="max-w-[18rem] font-mono text-[11px] leading-relaxed text-text-tertiary">
              An independent public ledger of AI agent failures, aggregated from
              public reports. Not affiliated with or endorsed by any company or
              product named. Reports may be unverified — always check the linked
              source.
            </p>
            <div className="mt-4">
              <NewsletterSignup />
            </div>
          </div>

          {/* Link groups */}
          <div className="flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-10">
            {LINK_GROUPS.map((group, i) => (
              <nav key={i} className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border-default pt-6">
          <p className="font-mono text-[10px] text-text-tertiary">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            AgentPostmortem. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
