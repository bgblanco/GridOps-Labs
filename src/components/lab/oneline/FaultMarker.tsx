import { COLORS } from "./geometry";

/** Reported fault location. Drawn as a zigzag with a pulse until isolated. */
export function FaultMarker({ x, y, isolated, label = "REPORTED FAULT" }: { x: number; y: number; isolated?: boolean; label?: string }) {
  return (
    <g aria-hidden="true">
      <g className={isolated ? undefined : "fault-pulse"}>
        <circle cx={x} cy={y} r={15} fill={COLORS.bg} stroke={COLORS.fault} strokeWidth={2} />
        <path d={`M ${x - 4} ${y - 9} L ${x + 3} ${y - 1} L ${x - 3} ${y + 1} L ${x + 4} ${y + 9}`} fill="none" stroke={COLORS.fault} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
      </g>
      <text x={x} y={y + 36} textAnchor="middle" fontSize={11} fill={COLORS.fault} style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontWeight: 600 }}>
        {isolated ? "ISOLATED" : label}
      </text>
    </g>
  );
}
