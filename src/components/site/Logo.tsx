/**
 * GridOps Labs mark: a source, a normally-open tie node, and three restoration
 * branches — the energized path drawn in the brand orange. Dark parts use
 * currentColor so the mark adapts to light and dark surroundings.
 */
const ORANGE = "#F5831F";

export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 58 40" className={className} role="img" aria-label="GridOps Labs">
      <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {/* source → tie node */}
        <line x1="9.8" y1="20" x2="19.2" y2="20" />
        {/* upper branch to an open node */}
        <polyline points="28.8,16.4 37,10 46.7,10" />
        {/* lower branch to an open node */}
        <polyline points="28.8,23.6 37,30 46.7,30" />
      </g>
      {/* energized (orange) branch to a filled node */}
      <line x1="30.5" y1="20" x2="46.9" y2="20" stroke={ORANGE} strokeWidth={3} strokeLinecap="round" />

      {/* source node (filled) */}
      <circle cx="6" cy="20" r="3.8" fill="currentColor" />
      {/* tie node: dark ring, energized orange core */}
      <circle cx="25" cy="20" r="5.5" fill="none" stroke="currentColor" strokeWidth={3} />
      <circle cx="25" cy="20" r="2.7" fill={ORANGE} />
      {/* open branch nodes */}
      <circle cx="50.5" cy="10" r="3.8" fill="none" stroke="currentColor" strokeWidth={3} />
      <circle cx="50.5" cy="30" r="3.8" fill="none" stroke="currentColor" strokeWidth={3} />
      {/* energized branch node (filled orange) */}
      <circle cx="50.5" cy="20" r="3.8" fill={ORANGE} />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5 text-ink">
      <LogoMark className="h-8 w-auto" />
      <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-0.01em]">GridOps Labs</span>
    </span>
  );
}
