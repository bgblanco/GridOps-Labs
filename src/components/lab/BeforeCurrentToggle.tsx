"use client";

import { useState, type ReactNode } from "react";
import type { DeviceState, Scenario } from "@/lib/scenario/schema";
import { OneLineCanvas } from "./oneline/OneLineCanvas";

export interface GridSnapshot {
  devices: Record<string, DeviceState>;
  faultedEdges: string[];
  /** Simulated clock label for this snapshot, e.g. "02:41". */
  time: string;
}

/**
 * Instructional BEFORE | CURRENT comparison. CURRENT renders the live (interactive) map
 * passed as children. BEFORE renders a clearly-labeled, non-interactive snapshot so the
 * learner can compare what their last action changed. The historical view can never be
 * operated (selectable is empty and it is visually marked).
 */
export function BeforeCurrentToggle({
  scenario,
  before,
  currentTime,
  showFault,
  hideFeeders,
  onView,
  children,
}: {
  scenario: Scenario;
  before: GridSnapshot;
  currentTime: string;
  showFault?: boolean;
  hideFeeders?: string[];
  onView?: () => void;
  children: ReactNode;
}) {
  const [view, setView] = useState<"current" | "before">("current");
  const select = (v: "current" | "before") => {
    setView(v);
    if (v === "before") onView?.();
  };
  return (
    <div>
      <div className="flex items-stretch border-b border-desk-rule" role="group" aria-label="Compare system state">
        {(["before", "current"] as const).map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              onClick={() => select(v)}
              className={`flex-1 px-3 py-2 text-left transition-colors ${active ? "bg-desk-3" : "hover:bg-desk-3/50"}`}
            >
              <span className="nameplate text-[0.62rem]" style={{ color: v === "before" ? "var(--desk-muted)" : "var(--live)" }}>
                {v === "before" ? "Before" : "Current"}
              </span>
              <span className="mono ml-2 text-xs" style={{ color: active ? "var(--desk-ink)" : "var(--desk-muted)" }}>
                {v === "before" ? before.time : currentTime}
              </span>
            </button>
          );
        })}
      </div>

      {view === "current" ? (
        children
      ) : (
        <div className="relative border-2 border-dashed border-desk-muted" aria-label={`Historical system state at ${before.time}, not live`}>
          <span className="nameplate pointer-events-none absolute left-2 top-2 z-10 rounded-[2px] bg-desk px-1.5 py-0.5 text-[0.6rem] text-desk-muted">
            Historical · {before.time} · not live
          </span>
          <OneLineCanvas
            scenario={scenario}
            devices={before.devices}
            faultedEdges={before.faultedEdges}
            showFault={showFault}
            selectable={[]}
            hideFeeders={hideFeeders}
            animateFlow={false}
            title={`${scenario.environment.grid} one-line, historical state at ${before.time}. Not the live system.`}
            description="Historical comparison view. This is not the live scenario and cannot be operated."
          />
        </div>
      )}
    </div>
  );
}
