import type { ReactNode } from "react";

/**
 * A page section. `tone="raised"` renders a full-bleed light editorial band (marketing /
 * explanatory content); the default `page` tone is flush on the page ground. The dark
 * operating look is reserved for the Decision Lab and desk panels — a section is never dark.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  tight,
  tone = "page",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  tight?: boolean;
  tone?: "page" | "raised";
}) {
  const raised = tone === "raised";
  return (
    <section
      id={id}
      aria-labelledby={id && title ? `${id}-title` : undefined}
      className={`scroll-mt-20 ${raised ? "mt-20 border-y border-rule bg-surface py-16 sm:mt-24 sm:py-20" : ""}`}
    >
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${raised ? "" : tight ? "pt-14" : "pt-20 sm:pt-24"} ${className}`}>
        {(eyebrow || title) && (
          <div className="max-w-3xl">
            {eyebrow && <p className="nameplate text-accent-ink">{eyebrow}</p>}
            {title && (
              <h2 id={id ? `${id}-title` : undefined} className="mt-2 text-[clamp(1.9rem,4.2vw,2.8rem)] font-semibold text-ink">
                {title}
              </h2>
            )}
            {intro && <div className="mt-4 grid gap-3 text-[1.07rem] leading-relaxed text-ink-2">{intro}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <p className="nameplate text-accent-ink">{eyebrow}</p>
      <h1 className="mt-3 max-w-4xl text-[clamp(2.3rem,5.6vw,4rem)] font-semibold text-ink">{title}</h1>
      {intro && <div className="mt-5 grid max-w-[62ch] gap-3 text-[1.1rem] leading-relaxed text-ink-2">{intro}</div>}
    </div>
  );
}

export function Disclaimer({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`border-l-2 border-rule-strong pl-3 text-sm leading-relaxed text-muted ${className}`} role="note">
      {text}
    </p>
  );
}
