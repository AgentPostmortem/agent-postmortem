"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Registry" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/about", label: "About" },
  { href: "/teams", label: "Teams" },
  { href: "/submit", label: "File Report" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="AgentPostmortem home"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-accent-red/30 bg-accent-red-soft">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="11"
                  height="11"
                  rx="1.5"
                  stroke="#dc2626"
                  strokeWidth="1.2"
                />
                <path
                  d="M3.5 4h6M3.5 6.5h6M3.5 9h3.5"
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-serif text-sm leading-none text-text-primary transition-colors group-hover:text-accent-red">
                AgentPostmortem
              </div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                Public Case Registry
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.slice(0, 4).map((link) => (
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
            {/* Desktop CTA */}
            <Link
              href="/submit"
              className="hidden items-center gap-1.5 rounded border border-accent-red bg-accent-red-soft px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-accent-red transition-all hover:bg-accent-red hover:text-white md:flex"
            >
              <span aria-hidden="true">+</span> File Report
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-5 bg-text-secondary transition-all duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-text-secondary transition-all duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-5 bg-text-secondary transition-all duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="border-t border-border-default bg-bg-canvas md:hidden">
            <nav className="mx-auto max-w-5xl divide-y divide-border-default px-4">
              {NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    link.label === "File Report"
                      ? "text-accent-red"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label === "File Report" ? "+ " : ""}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
