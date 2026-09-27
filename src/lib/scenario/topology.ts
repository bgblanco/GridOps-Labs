import type { DeviceState, Scenario, TopologyEdge } from "./schema";

/**
 * Connectivity-based energization. This is NOT power flow: it only answers
 * "is there a closed path from a source to this edge?" and "which source?".
 * Loading, voltage and protection behavior are carried as scenario data.
 */
export interface Energization {
  /** edgeId -> source node id feeding it */
  edgeSource: Record<string, string>;
  /** nodeId -> source node id */
  nodeSource: Record<string, string>;
  /** Faulted edges that a source can reach (would be "closing into a fault") */
  energizedFaults: string[];
}

const conducts = (edge: TopologyEdge, devices: Record<string, DeviceState>) =>
  edge.kind === "line" ? true : (devices[edge.id] ?? edge.normal ?? "open") === "closed";

export function computeEnergization(
  scenario: Scenario,
  devices: Record<string, DeviceState>,
  faultedEdges: string[],
): Energization {
  const { nodes, edges } = scenario.topology;
  const adj = new Map<string, TopologyEdge[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    if (!adj.has(e.to)) adj.set(e.to, []);
    adj.get(e.from)!.push(e);
    adj.get(e.to)!.push(e);
  }

  const nodeSource: Record<string, string> = {};
  const edgeSource: Record<string, string> = {};

  for (const src of nodes.filter((n) => n.kind === "source")) {
    const queue = [src.id];
    if (nodeSource[src.id]) continue;
    nodeSource[src.id] = src.id;
    while (queue.length) {
      const id = queue.shift()!;
      for (const e of adj.get(id) ?? []) {
        // A device edge that is open still has its source-side terminal energized,
        // but does not pass energy across.
        if (!conducts(e, devices)) continue;
        if (!edgeSource[e.id]) edgeSource[e.id] = src.id;
        const next = e.from === id ? e.to : e.from;
        if (!nodeSource[next]) {
          nodeSource[next] = src.id;
          queue.push(next);
        }
      }
    }
  }

  // Open devices: mark "live on one side" by giving them the source of either terminal
  // (used only for styling, not for customer counts).
  const energizedFaults = faultedEdges.filter((id) => edgeSource[id]);
  return { edgeSource, nodeSource, energizedFaults };
}

export function customersInterrupted(
  scenario: Scenario,
  energization: Energization,
  faultedEdges: string[],
): number {
  return scenario.topology.loads.reduce((sum, load) => {
    const live = Boolean(energization.edgeSource[load.edgeId]) && !faultedEdges.includes(load.edgeId);
    return live ? sum : sum + load.customers;
  }, 0);
}

export function customersOnFeeder(scenario: Scenario, feeder: string): number {
  const edgeFeeder = new Map(scenario.topology.edges.map((e) => [e.id, e.feeder]));
  return scenario.topology.loads
    .filter((l) => edgeFeeder.get(l.edgeId) === feeder)
    .reduce((s, l) => s + l.customers, 0);
}
