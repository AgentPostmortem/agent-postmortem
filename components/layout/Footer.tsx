import Link from "next/link";

const PROOF_LINKS = [
  {
    href: "https://resolvd.agentpostmortem.com",
    label: "Resolvd",
    description: "Support triage, live demo",
    mark: "R",
  },
  {
    href: "https://webhands.agentpostmortem.com",
    label: "Webhands",
    description: "Portal ops, live demo",
    mark: "W",
  },
  {
    href: "https://greenlite.agentpostmortem.com",
    label: "Greenlite",
    description: "Phone approvals, live",
    mark: "G",
  },
];

const LINK_GROUPS = [
  {
    label: "Product",
    links: [
      { href: "/tools", label: "Proof" },
      { href: "/#pilot", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
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
        <div className="mb-10 rounded-sm border border-accent/40 bg-accent-soft p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                14-day pilot, $1,200 fixed
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                One support or portal workflow, live with guardrails. Second
                half only if it closes real work.
              </p>
            </div>
            <Link
              href="/pilot"
              className="inline-flex shrink-0 items-center justify-center rounded-sm border border-accent/60 bg-accent px-4 py-2.5 font-sans text-sm font-semibold text-bg-canvas transition-colors hover:opacity-90"
            >
              Book the pilot
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Proof: live backends
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                These power the pilot behind the scenes. Not separate products
                to evaluate.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PROOF_LINKS.map((product) => (
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
                  <span className="mt-0.5 block truncate font-sans text-xs text-text-tertiary">
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
              <span className="font-sans text-sm font-bold text-text-primary">
                AgentPostmortem
              </span>
            </div>
            <p className="max-w-[18rem] font-sans text-[13px] leading-relaxed text-text-tertiary">
              Ops agents installed with guardrails, built on documented
              failure evidence. Failure reports quoted on this site are
              aggregated from public sources and may be unverified.
            </p>
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
                    className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
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
          <p className="font-sans text-xs text-text-tertiary">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            AgentPostmortem. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
