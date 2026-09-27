import type { ReplayRow } from "@/lib/scenario/engine";

const LANE: Record<ReplayRow["lane"], { color: string; name: string }> = {
  info: { color: "var(--q-indicated)", name: "Information" },
  device: { color: "var(--desk-ink)", name: "Device" },
  decision: { color: "var(--accent)", name: "Decision" },
  outcome: { color: "var(--q-inferred)", name: "Outcome" },
  system: { color: "var(--desk-muted)", name: "Event" },
};

/** Replay built from the learner's own actions. Times are simulated. */
export function ReplayTimeline({ rows }: { rows: ReplayRow[] }) {
  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-desk-muted" aria-label="Legend">
        {Object.entries(LANE).map(([k, v]) => (
          <li key={k} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: v.color }} />
            {v.name}
          </li>
        ))}
      </ul>
      <ol className="relative grid gap-0 border-l border-desk-rule pl-0">
        {rows.map((r) => (
          <li key={r.seq} className="relative grid grid-cols-[4rem_1fr] items-baseline gap-3 py-1.5 pl-4">
            <span aria-hidden="true" className="absolute -left-[5px] top-[0.85rem] h-2.5 w-2.5 rounded-full" style={{ background: LANE[r.lane].color }} />
            <span className="mono text-sm text-desk-muted">{r.time}</span>
            <span className={`text-sm ${r.lane === "decision" || r.lane === "outcome" ? "font-semibold text-desk-ink" : "text-desk-ink"}`}>
              <span className="sr-only">{LANE[r.lane].name}: </span>
              {r.label}
              {r.label === "Reason given" && r.detail ? <span className="block font-normal text-desk-muted">{r.detail}</span> : null}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-desk-muted">Simulated scenario clock. Each action advances it by a fixed amount.</p>
    </div>
  );
}
