import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const SUITE_LINKS = [
  {
    href: "https://greenlite.agentpostmortem.com",
    label: "Greenlite",
    description: "Human approvals",
    mark: "G",
    accent: "bg-purple-600",
  },
  {
    href: "https://resolvd.agentpostmortem.com",
    label: "Resolvd",
    description: "Support operations",
    mark: "R",
    accent: "bg-sky-500",
  },
  {
    href: "https://tracecase.agentpostmortem.com",
    label: "Tracecase",
    description: "Agent evaluation",
    mark: "T",
    accent: "bg-emerald-500",
  },
  {
    href: "https://bridgekit.agentpostmortem.com",
    label: "Bridgekit",
    description: "MCP tools",
    mark: "B",
    accent: "bg-indigo-600",
  },
  {
    href: "https://webhands.agentpostmortem.com",
    label: "Webhands",
    description: "Browser agents",
    mark: "W",
    accent: "bg-cyan-500",
  },
];

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
        <div className="mb-10">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-red">
                Agent operating suite
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Tools for building, testing, operating, and supervising AI agents.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {SUITE_LINKS.map((product) => (
              <a
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center gap-3 rounded-md border border-border-default bg-surface-primary p-3 transition-colors hover:border-border-strong hover:bg-surface-secondary"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${product.accent} font-mono text-xs font-bold text-white`}
                >
                  {product.mark}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-text-primary transition-colors group-hover:text-accent-red">
                    {product.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[9px] text-text-tertiary">
                    {product.description}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

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
