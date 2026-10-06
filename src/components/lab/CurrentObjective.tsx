/** Persistent "what am I trying to accomplish right now" band inside the Decision Lab. */
export function CurrentObjective({ objective, className = "" }: { objective?: string; className?: string }) {
  if (!objective) return null;
  return (
    <div className={`flex items-start gap-3 border-l-[3px] border-[var(--accent)] bg-desk-3 px-3.5 py-2.5 ${className}`}>
      <span className="nameplate mt-0.5 flex-none text-[0.62rem] text-[var(--accent)]">Objective</span>
      <p className="font-display text-[1.02rem] font-semibold leading-snug text-desk-ink">{objective}</p>
    </div>
  );
}
