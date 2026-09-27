import type { EdgeGeom } from "./geometry";
import { COLORS } from "./geometry";

export interface FeederSegmentProps {
  geom: EdgeGeom;
  energized: boolean;
  faulted?: boolean;
  isolated?: boolean;
  highlighted?: boolean;
  highlightTone?: "limit" | "info";
  label?: string;
  showLabel?: boolean;
  animate?: boolean;
  compact?: boolean;
}

/** A conductor section. Energized = solid teal, de-energized = dashed slate. */
export function FeederSegment({ geom, energized, faulted, isolated, highlighted, highlightTone = "limit", label, showLabel, animate, compact }: FeederSegmentProps) {
  const { x1, y1, x2, y2, mx, my } = geom;
  const stroke = faulted ? COLORS.fault : energized ? COLORS.live : COLORS.dead;
  const width = compact ? 3 : 4;
  const horizontal = Math.abs(y2 - y1) < 1;
  return (
    <g opacity={faulted && isolated ? 0.45 : 1}>
      {highlighted && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={highlightTone === "limit" ? COLORS.fault : COLORS.alarm} strokeOpacity={0.28} strokeWidth={18} strokeLinecap="round" />
      )}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke}
        strokeWidth={width}
        strokeDasharray={energized || faulted ? undefined : "7 6"}
        strokeLinecap="round"
      />
      {energized && animate && !faulted && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--desk)" strokeOpacity={0.55} strokeWidth={width - 1} className="flow-anim" strokeLinecap="round" />
      )}
      {showLabel && label && horizontal && (
        <text x={mx} y={my + 26} textAnchor="middle" fontSize={12} fill={highlighted ? (highlightTone === "limit" ? COLORS.fault : COLORS.alarm) : COLORS.muted} style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
          {label}
        </text>
      )}
    </g>
  );
}
