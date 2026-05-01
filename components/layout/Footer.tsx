import Link from "next/link";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/teams", label: "Teams" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/submit", label: "File a Report" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  {
    href: "https://github.com/AgentPostmortem/agent-postmortem",
    label: "GitHub",
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border-default">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-sm bg-accent-red" />
            <span className="font-serif text-sm text-text-tertiary">
              AgentPostmortem
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="font-mono text-xs text-text-tertiary">
            Not affiliated with any AI vendor.
          </p>
        </div>
      </div>
    </footer>
  );
}
