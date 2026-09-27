import { COLORS } from "./geometry";

/** Customers served from a section. Count shown in mono; dimmed when interrupted. */
export function LoadBlock({ x, y, customers, energized, side = "above", faulted }: { x: number; y: number; customers: number; energized: boolean; side?: "above" | "below"; faulted?: boolean }) {
  const dy = side === "above" ? -30 : 30;
  const w = 64;
  const color = faulted ? COLORS.fault : energized ? COLORS.live : COLORS.muted;
  return (
    <g aria-hidden="true">
      <line x1={x} y1={y} x2={x} y2={y + (side === "above" ? -18 : 18)} stroke={energized ? COLORS.live : COLORS.dead} strokeWidth={1.5} />
      <rect x={x - w / 2} y={y + dy - 11} width={w} height={22} rx={2} fill={COLORS.bg} stroke={color} strokeWidth={1.2} />
      <text x={x} y={y + dy + 4} textAnchor="middle" fontSize={11.5} fill={energized ? COLORS.ink : COLORS.muted} style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
        {customers.toLocaleString("en-US")} cust
      </text>
    </g>
  );
}
