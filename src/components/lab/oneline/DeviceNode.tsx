import type { KeyboardEvent } from "react";
import type { DeviceState, EdgeKind } from "@/lib/scenario/schema";
import type { EdgeGeom } from "./geometry";
import { COLORS } from "./geometry";

export interface DeviceNodeProps {
  id: string;
  kind: Exclude<EdgeKind, "line">;
  geom: EdgeGeom;
  state: DeviceState;
  /** Is either terminal energized? */
  live: boolean;
  label?: string;
  caption?: string;
  labelAt?: "above" | "below" | "left" | "right";
  selectable?: boolean;
  emphasized?: boolean;
  compact?: boolean;
  onSelect?: (id: string) => void;
}

function Symbol({ kind, state, live, compact }: { kind: DeviceNodeProps["kind"]; state: DeviceState; live: boolean; compact?: boolean }) {
  const s = compact ? 0.85 : 1;
  const on = state === "closed";
  const c = on && live ? COLORS.live : COLORS.ink;
  if (kind === "breaker") {
    return (
      <g transform={`scale(${s})`}>
        <rect x={-13} y={-13} width={26} height={26} fill={on ? c : COLORS.bg} stroke={on ? c : COLORS.ink} strokeWidth={2.2} />
        {!on && <line x1={-7} y1={0} x2={7} y2={0} stroke={COLORS.ink} strokeWidth={2} />}
      </g>
    );
  }
  // switch / tie: terminals + blade. Tie gets a double outline to read as normally-open.
  return (
    <g transform={`scale(${s})`}>
      <rect x={-18} y={-12} width={36} height={24} fill={COLORS.bg} />
      <circle cx={-12} cy={0} r={3.2} fill={COLORS.ink} />
      <circle cx={12} cy={0} r={3.2} fill={on ? c : COLORS.bg} stroke={COLORS.ink} strokeWidth={1.6} />
      <line x1={-12} y1={0} x2={on ? 12 : 8} y2={on ? 0 : -12} stroke={on ? c : COLORS.ink} strokeWidth={2.6} strokeLinecap="round" />
      {kind === "tie" && <rect x={-20} y={-15} width={40} height={30} fill="none" stroke={COLORS.muted} strokeWidth={1} strokeDasharray="3 3" />}
    </g>
  );
}

export function DeviceNode({ id, kind, geom, state, live, label, caption, labelAt = "below", selectable, emphasized, compact, onSelect }: DeviceNodeProps) {
  const { mx, my, angle } = geom;
  const stateText = kind === "tie" && state === "open" ? "N/O · OPEN" : state.toUpperCase();
  const off = compact ? 26 : 30;
  const pos = {
    above: { x: mx, y: my - off - 10, a: "middle" as const },
    below: { x: mx, y: my + off + 2, a: "middle" as const },
    left: { x: mx - off, y: my - 4, a: "end" as const },
    right: { x: mx + off, y: my - 4, a: "start" as const },
  }[labelAt];

  const handleKey = (e: KeyboardEvent<SVGGElement>) => {
    if (!selectable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <g
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-label={selectable ? `${label ?? id}, ${state}. Select to operate.` : undefined}
      onClick={selectable ? () => onSelect?.(id) : undefined}
      onKeyDown={handleKey}
      style={{ cursor: selectable ? "pointer" : "default", outline: "none" }}
      className="device-node"
    >
      {selectable && (
        <circle cx={mx} cy={my} r={compact ? 22 : 26} fill="var(--accent)" fillOpacity={0.1} stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4 3" className="device-ring" />
      )}
      {emphasized && <circle cx={mx} cy={my} r={compact ? 22 : 27} fill="none" stroke="var(--accent)" strokeWidth={2.5} />}
      <g transform={`translate(${mx} ${my}) rotate(${angle})`}>
        <Symbol kind={kind} state={state} live={live} compact={compact} />
      </g>
      {compact && caption && (
        <text x={pos.x} y={labelAt === "right" ? pos.y + 8 : pos.y} textAnchor={pos.a} fontSize={24} fill={COLORS.ink} style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.06em" }}>
          {caption}
        </text>
      )}
      {!compact && label && (
        <text x={pos.x} y={pos.y} textAnchor={pos.a} fontSize={12.5} fill={COLORS.ink} style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
          {label}
        </text>
      )}
      {!compact && (
        <text x={pos.x} y={pos.y + 14} textAnchor={pos.a} fontSize={10.5} fill={state === "closed" && live ? COLORS.live : COLORS.muted} style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontWeight: 600 }}>
          {caption ? `${caption} · ${stateText}` : stateText}
        </text>
      )}
      {/* Enlarged invisible hit target for touch */}
      {selectable && <circle cx={mx} cy={my} r={30} fill="transparent" />}
    </g>
  );
}

export const BreakerNode = (p: Omit<DeviceNodeProps, "kind">) => <DeviceNode {...p} kind="breaker" />;
export const SwitchNode = (p: Omit<DeviceNodeProps, "kind">) => <DeviceNode {...p} kind="switch" />;
export const TieNode = (p: Omit<DeviceNodeProps, "kind">) => <DeviceNode {...p} kind="tie" />;
