import Link from "next/link";
import { LogoIcon } from "@/components/brand/Logo";
import { PlusIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/tools", label: "Tools" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/stats", label: "Stats" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
  { href: "/teams", label: "Teams" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-bg-canvas/95 backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="AgentPostmortem home"
        >
          <LogoIcon size={26} />
          <div>
            <div className="font-serif text-sm font-medium leading-none tracking-tight text-text-primary transition-colors group-hover:text-accent">
              AgentPostmortem
            </div>
            <div className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary sm:block">
              Public Case Registry
            </div>
          </div>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="hidden items-center gap-1.5 rounded-sm border border-accent/60 bg-accent-soft px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-bg-canvas md:flex"
          >
            <PlusIcon size={10} /> File Report
          </Link>

          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-sm border border-accent/60 bg-accent-soft px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent md:hidden"
          >
            <PlusIcon size={9} /> File
          </Link>

          <details className="group relative md:hidden">
            <summary
              aria-label="Open menu"
              className="flex h-8 w-8 cursor-pointer list-none flex-col items-center justify-center gap-[5px] [&::-webkit-details-marker]:hidden"
            >
              <span className="h-px w-5 bg-text-secondary" />
              <span className="h-px w-5 bg-text-secondary" />
              <span className="h-px w-5 bg-text-secondary" />
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-11 w-52 divide-y divide-border-default rounded-sm border border-border-default bg-bg-canvas shadow-xl"
            >
              <Link
                href="/"
                className="block px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-accent"
              >
                Registry
              </Link>
              {NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
