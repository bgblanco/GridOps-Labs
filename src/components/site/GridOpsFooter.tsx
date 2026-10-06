import Link from "next/link";
import { CTA, site } from "@/lib/content/site";
import { Wordmark } from "./Logo";

export function GridOpsFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Scenario-based proficiency training for electric distribution operations.
          </p>
          <p className="mt-2 text-sm text-muted">Different grids. Different tools. Same responsibility.</p>
          <p className="mt-4 text-xs text-muted">
            GridOps Labs is developed by Sentinel Peak Solutions.<br />
            Inquiries: <a href="mailto:info@sentinelpeaksolutions.com" className="hover:text-ink hover:underline">info@sentinelpeaksolutions.com</a>
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="nameplate text-muted">Site</p>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {[...site.nav, { href: "/contact", label: "Contact" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-2 hover:text-ink hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="nameplate text-muted">Get involved</p>
          <ul className="mt-3 grid gap-1.5 text-sm">
            <li><Link href={CTA.primary.href} className="text-ink-2 hover:text-ink hover:underline">{CTA.primary.label}</Link></li>
            <li><Link href={CTA.secondary.href} className="text-ink-2 hover:text-ink hover:underline">{CTA.secondary.label}</Link></li>
            <li><Link href={CTA.tertiary.href} className="text-ink-2 hover:text-ink hover:underline">{CTA.tertiary.label}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs leading-relaxed text-muted sm:px-6 md:flex-row md:justify-between">
          <p className="max-w-3xl">{site.disclaimer}</p>
          <p className="flex-none">© {new Date().getFullYear()} GridOps Labs · {site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
