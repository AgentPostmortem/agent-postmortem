import Link from "next/link";
import { LogoIcon } from "@/components/brand/Logo";

const NAV = [
  { href: "/tools", label: "Proof" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/stats", label: "Stats" },
  { href: "/#pilot", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-bg-canvas/95 backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <LogoIcon size={26} />
          <div>
            <div className="font-sans text-[15px] font-bold leading-none tracking-tight text-text-primary transition-colors group-hover:text-accent">
              AgentPostmortem
            </div>
            <div className="mt-1 hidden font-sans text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary sm:block">
              Ops agents, installed
            </div>
          </div>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pilot"
            className="hidden items-center gap-1.5 rounded-sm bg-emerald-400 px-3.5 py-1.5 font-sans text-sm font-semibold text-stone-950 transition-colors hover:bg-emerald-300 md:flex"
          >
            Get pilot
          </Link>

          <Link
            href="/pilot"
            className="flex items-center gap-1.5 rounded-sm bg-emerald-400 px-2.5 py-1.5 font-sans text-[13px] font-semibold text-stone-950 md:hidden"
          >
            Pilot
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
                className="block px-4 py-3.5 font-sans text-sm font-semibold text-text-secondary hover:text-text-primary"
              >
                Home
              </Link>
              {NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3.5 font-sans text-sm font-semibold text-text-secondary hover:text-text-primary"
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
