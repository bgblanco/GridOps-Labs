/**
 * Operational progress rail. Reads like a switching sequence — completed / current /
 * upcoming — not a generic web progress bar. Steps come from the scenario phases.
 */
export function LabProgress({ steps, currentIndex }: { steps: string[]; currentIndex: number }) {
  return (
    <nav aria-label="Scenario progress" className="diagram-scroll border-b border-desk-rule">
      <ol className="flex min-w-max">
        {steps.map((step, i) => {
          const status = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
          return (
            <li
              key={`${step}-${i}`}
              aria-current={status === "current" ? "step" : undefined}
              className={`flex items-center gap-2 border-r border-desk-rule px-3 py-2 text-xs sm:px-4 ${
                status === "current" ? "bg-desk-3 text-desk-ink" : status === "done" ? "text-desk-ink" : "text-desk-muted"
              }`}
            >
              <span className="mono" style={{ color: status === "current" ? "var(--accent)" : status === "done" ? "var(--live)" : undefined }}>
                {status === "done" ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span className="nameplate text-[0.7rem]">{step}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
