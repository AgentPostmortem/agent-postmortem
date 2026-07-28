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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="AgentPostmortem home"
        >
          <LogoIcon size={28} />
          <div>
            <div className="font-serif text-sm leading-none text-text-primary transition-colors group-hover:text-accent-red">
              AgentPostmortem
            </div>
            <div className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-widest text-text-tertiary sm:block">
              Public Case Registry
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="hidden items-center gap-1.5 rounded-full border border-accent-red/60 bg-accent-red-soft px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-accent-red-muted transition-all hover:border-accent-red-muted hover:bg-accent-red hover:text-bg-canvas md:flex"
          >
            <PlusIcon size={10} /> File Report
          </Link>

          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-full border border-accent-red/60 bg-accent-red-soft px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent-red-muted md:hidden"
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
            <nav className="absolute right-0 top-11 w-52 divide-y divide-border-default rounded border border-border-default bg-bg-canvas shadow-xl">
              <Link
                href="/"
                className="block px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary"
              >
                Registry
              </Link>
              {NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary"
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
