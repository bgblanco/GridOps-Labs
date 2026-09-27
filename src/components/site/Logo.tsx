export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  // A source, a closed device, and an open tie: the whole idea in one mark.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="3" fill="var(--desk)" />
      <circle cx="7" cy="16" r="3" fill="none" stroke="var(--live)" strokeWidth="2" />
      <line x1="10" y1="16" x2="13" y2="16" stroke="var(--live)" strokeWidth="2" />
      <rect x="13" y="12.5" width="7" height="7" fill="var(--live)" />
      <line x1="20" y1="16" x2="23" y2="16" stroke="var(--live)" strokeWidth="2" />
      <line x1="23" y1="16" x2="28" y2="11" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[1.2rem] font-bold uppercase leading-none tracking-[0.1em]">
        GridOps <span className="font-semibold text-muted">Labs</span>
      </span>
    </span>
  );
}
