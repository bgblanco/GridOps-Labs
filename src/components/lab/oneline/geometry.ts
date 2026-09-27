import type { TopologyEdge, TopologyNode } from "@/lib/scenario/schema";

export interface EdgeGeom {
  x1: number; y1: number; x2: number; y2: number;
  mx: number; my: number; angle: number; length: number;
}

export function edgeGeom(edge: TopologyEdge, nodes: Map<string, TopologyNode>): EdgeGeom {
  const a = nodes.get(edge.from)!;
  const b = nodes.get(edge.to)!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return {
    x1: a.x, y1: a.y, x2: b.x, y2: b.y,
    mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    length: Math.hypot(dx, dy),
  };
}

export const COLORS = {
  live: "var(--live)",
  dead: "var(--dead)",
  fault: "var(--fault)",
  alarm: "var(--alarm)",
  ink: "var(--desk-ink)",
  muted: "var(--desk-muted)",
  bg: "var(--desk-2)",
  rule: "var(--desk-rule)",
};
