"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA, site } from "@/lib/content/site";
import { Wordmark } from "./Logo";

export function GridOpsHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky z-40 border-b border-rule bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-ink" aria-label="GridOps Labs home">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((n) => {
            const active = pathname === n.href || pathname?.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-[2px] px-2.5 py-2 text-[0.95rem] ${active ? "text-ink underline decoration-[var(--accent)] decoration-2 underline-offset-[6px]" : "text-ink-2 hover:text-ink"}`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link href={CTA.primary.href} className="btn btn-ink ml-3 min-h-[42px] px-4 text-[0.95rem]">
            {CTA.primary.label}
          </Link>
        </nav>
        <button
          type="button"
          className="btn btn-ghost min-h-[44px] px-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-rule bg-bg px-4 pb-5 pt-2 lg:hidden">
          <ul className="grid">
            {[...site.nav, { href: "/contact", label: "Contact" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex min-h-[48px] items-center border-b border-rule text-[1.05rem]" aria-current={pathname === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={CTA.primary.href} className="btn btn-primary mt-4 w-full">
            {CTA.primary.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
