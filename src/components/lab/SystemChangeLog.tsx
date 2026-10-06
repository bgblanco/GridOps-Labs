import type { SystemChangeRow } from "@/lib/scenario/engine";

const LANE_COLOR: Record<SystemChangeRow["lane"], string> = {
  outcome: "var(--live)",
  device: "var(--desk-ink)",
  decision: "var(--desk-ink)",
  info: "var(--desk-muted)",
  system: "var(--desk-muted)",
};

/**
 * Compact, in-scenario feed of the electrical changes the learner has caused, newest
 * first. Built from the engine log (see systemChanges) — never a hard-coded sequence.
 */
export function SystemChangeLog({ rows }: { rows: SystemChangeRow[] }) {
  if (!rows.length) return null;
  return (
    <section aria-label="System changes" className="border-t border-desk-rule bg-desk px-4 py-3 sm:px-5">
      <p className="nameplate text-[0.66rem] text-desk-muted">System changes</p>
      <ol className="mt-2 grid gap-1.5">
        {rows.map((r) => (
          <li key={r.seq} className="flex items-baseline gap-3 text-[0.86rem] leading-snug">
            <span className="mono w-11 flex-none text-desk-muted">{r.time}</span>
            <span style={{ color: LANE_COLOR[r.lane] }}>{r.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
