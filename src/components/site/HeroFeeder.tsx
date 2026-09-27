"use client";

import { useEffect, useState } from "react";
import { dl001 } from "@/lib/scenarios/dl-001";
import { OneLineCanvas } from "@/components/lab/oneline/OneLineCanvas";
import type { DeviceState } from "@/lib/scenario/schema";

const normal: Record<string, DeviceState> = { "CB-120": "closed", "SW-1201": "closed", "SW-1202": "closed", "TIE-121": "open", "TIE-122": "open", "TIE-123": "open", "CB-121": "closed" };

const frames: { clock: string; status: string; tone: string; devices: Record<string, DeviceState>; fault: boolean; ties?: boolean; out: number }[] = [
  { clock: "02:36", status: "Normal configuration", tone: "var(--live)", devices: normal, fault: false, out: 0 },
  { clock: "02:37", status: "CB-120 lockout", tone: "var(--fault)", devices: { ...normal, "CB-120": "open" }, fault: true, out: 2240 },
  { clock: "02:42", status: "Fault isolated", tone: "var(--alarm)", devices: { ...normal, "CB-120": "open", "SW-1201": "open", "SW-1202": "open" }, fault: true, out: 2240 },
  { clock: "02:44", status: "Section 1 restored", tone: "var(--alarm)", devices: { ...normal, "SW-1201": "open", "SW-1202": "open" }, fault: true, out: 1600 },
  { clock: "02:45", status: "Three ties available. Which one?", tone: "var(--accent)", devices: { ...normal, "SW-1201": "open", "SW-1202": "open" }, fault: true, ties: true, out: 1600 },
];

export function HeroFeeder() {
  const [i, setI] = useState(frames.length - 1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    if (reduce) return;
    setI(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    if (reduce) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % frames.length), i === frames.length - 1 ? 5200 : 2400);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  const f = frames[i];
  return (
    <figure className="on-desk overflow-hidden rounded-[4px] border border-desk-rule bg-desk-2 text-desk-ink" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-between gap-3 border-b border-desk-rule bg-desk px-4 py-2.5">
        <span className="nameplate text-[0.7rem] text-desk-muted">Summit Electric · Feeder 120</span>
        <span className="mono text-sm text-desk-ink">{f.clock}</span>
      </div>
      <OneLineCanvas
        scenario={dl001}
        devices={f.devices}
        faultedEdges={f.fault ? ["S2"] : []}
        showFault={f.fault}
        emphasized={f.ties ? ["TIE-121", "TIE-122", "TIE-123"] : []}
        showLoads={false}
        compact
        title="Animated one-line of fictional Feeder 120: lockout, fault isolation, partial restoration, and three available ties."
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-desk-rule bg-desk px-4 py-3" aria-live="off">
        <span className="font-display text-lg font-semibold" style={{ color: f.tone }}>
          {f.status}
        </span>
        <span className="mono text-sm text-desk-muted">{f.out ? `${f.out.toLocaleString("en-US")} out` : "All customers on"}</span>
      </figcaption>
    </figure>
  );
}
