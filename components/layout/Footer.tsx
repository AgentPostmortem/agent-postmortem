import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const SUITE_LINKS = [
  {
    href: "https://resolvd.agentpostmortem.com",
    label: "Resolvd",
    description: "Support operations",
    mark: "R",
  },
  {
    href: "https://greenlite.agentpostmortem.com",
    label: "Greenlite",
    description: "Human approvals",
    mark: "G",
  },
  {
    href: "https://relayg.agentpostmortem.com",
    label: "RelayG",
    description: "Triage state machine",
    mark: "Rg",
  },
  {
    href: "https://webhands.agentpostmortem.com",
    label: "Webhands",
    description: "Browser agents",
    mark: "W",
  },
  {
    href: "https://bridgekit.agentpostmortem.com",
    label: "Bridgekit",
    description: "Scoped MCP server",
    mark: "B",
  },
  {
    href: "https://tracecase.agentpostmortem.com",
    label: "Tracecase",
    description: "Agent CI",
    mark: "T",
  },
  {
    href: "https://mcp.agentpostmortem.com",
    label: "Casebook MCP",
    description: "Failure registry MCP",
    mark: "C",
  },
  {
    href: "https://chat.agentpostmortem.com",
    label: "Casebook Chat",
    description: "Cited investigation",
    mark: "Cc",
  },
  {
    href: "https://injection-arena.agentpostmortem.com",
    label: "Injection Arena",
    description: "Injection challenge",
    mark: "I",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/mcp-audit",
    label: "MCP-audit",
    description: "MCP security scanner",
    mark: "M",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/skill-audit",
    label: "Skill-audit",
    description: "Agent-skill security scanner",
    mark: "Sa",
  },
  {
    href: "https://www.npmjs.com/package/ctxtrim",
    label: "Ctxtrim",
    description: "Trim AI-context token cost",
    mark: "Ct",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/evalgate",
    label: "Evalgate",
    description: "Prompt regression CI",
    mark: "E",
  },
  {
    href: "https://pypi.org/project/ctxlens-cli/",
    label: "Ctxlens",
    description: "Context profiler",
    mark: "Cx",
  },
  {
    href: "https://pypi.org/project/answerproof/",
    label: "Answerproof",
    description: "Verifiable RAG receipts",
    mark: "A",
  },
  {
    href: "https://github.com/royalpinto007/Agentrace",
    label: "Agentrace",
    description: "Agent observability",
    mark: "Ar",
  },
  {
    href: "https://github.com/royalpinto007/Voiceeval",
    label: "Voiceeval",
    description: "Voice agent evals",
    mark: "V",
  },
  {
    href: "https://github.com/royalpinto007/VaultRAG",
    label: "VaultRAG",
    description: "Permission-aware RAG",
    mark: "Vr",
  },
  {
    href: "https://github.com/royalpinto007/Tenantq",
    label: "Tenantq",
    description: "Multi-tenant vector search",
    mark: "Tq",
  },
];

const LINK_GROUPS = [
  {
    label: "Organisation",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/teams", label: "Teams" },
    ],
  },
  {
    label: "Registry",
    links: [
      { href: "/hall-of-fame", label: "Hall of Fame" },
      { href: "/stats", label: "Stats" },
      { href: "/submit", label: "File a Report" },
      {
        href: "https://github.com/AgentPostmortem/agentpostmortem",
        label: "GitHub",
        external: true,
      },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-default">
      <div className="shell py-12">
        <div className="mb-10">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Agent operating suite
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Tools for building, testing, operating, and supervising AI
                agents.
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
                className="group flex min-w-0 items-center gap-3 rounded-sm border border-border-default bg-bg-surface p-3 transition-colors hover:border-border-strong hover:bg-bg-elevated"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-border-strong bg-bg-elevated font-mono text-xs font-bold text-accent-strong transition-colors group-hover:border-accent/50">
                  {product.mark}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-text-primary transition-colors group-hover:text-accent">
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
              <div className="h-1.5 w-1.5 rounded-sm bg-accent" />
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
              <nav
                key={i}
                aria-label={group.label}
                className="flex flex-col gap-2.5"
              >
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
