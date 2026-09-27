export interface SystemStatePanelProps {
  feederLabel: string;
  clock: string;
  customersOut: number;
  feederStatus: string;
  statusTone: "live" | "dead" | "fault" | "mixed";
}

/** Compact status strip shown above the one-line. */
export function SystemStatePanel({ feederLabel, clock, customersOut, feederStatus, statusTone }: SystemStatePanelProps) {
  const toneColor = { live: "var(--live)", dead: "var(--desk-muted)", fault: "var(--fault)", mixed: "var(--alarm)" }[statusTone];
  return (
    <dl className="grid grid-cols-3 border-b border-desk-rule text-desk-ink">
      <div className="border-r border-desk-rule px-3 py-2.5 sm:px-4">
        <dt className="nameplate text-[0.68rem] text-desk-muted">Clock</dt>
        <dd className="mono text-lg sm:text-xl">{clock}</dd>
      </div>
      <div className="border-r border-desk-rule px-3 py-2.5 sm:px-4">
        <dt className="nameplate text-[0.68rem] text-desk-muted">{feederLabel}</dt>
        <dd className="font-display text-base font-semibold sm:text-lg" style={{ color: toneColor }}>
          {feederStatus}
        </dd>
      </div>
      <div className="px-3 py-2.5 sm:px-4">
        <dt className="nameplate text-[0.68rem] text-desk-muted">Customers out</dt>
        <dd className="mono text-lg sm:text-xl" aria-live="polite">
          {customersOut.toLocaleString("en-US")}
        </dd>
      </div>
    </dl>
  );
}
