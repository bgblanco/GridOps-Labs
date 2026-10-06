"use client";

import { useMemo } from "react";
import type { DeviceState, Scenario } from "@/lib/scenario/schema";
import { computeEnergization } from "@/lib/scenario/topology";
import { COLORS, edgeGeom } from "./geometry";
import { FeederSegment } from "./FeederSegment";
import { DeviceNode } from "./DeviceNode";
import { FaultMarker } from "./FaultMarker";
import { LoadBlock } from "./LoadBlock";

export interface OneLineCanvasProps {
  scenario: Scenario;
  devices: Record<string, DeviceState>;
  faultedEdges: string[];
  /** Show the reported fault marker */
  showFault?: boolean;
  /** Devices the learner may click */
  selectable?: string[];
  emphasized?: string[];
  /** Devices just changed by the learner — draw a one-shot change-focus ring. */
  changedDeviceIds?: string[];
  highlightGroups?: string[];
  highlightTone?: "limit" | "info";
  /** Restoration path group to light up in blue (source → tie → interrupted load). */
  pathGroup?: string;
  onSelectDevice?: (id: string) => void;
  showLoads?: boolean;
  showSectionLabels?: boolean;
  animateFlow?: boolean;
  compact?: boolean;
  /** Hide edges on these feeders (e.g. keep the first view simple) */
  hideFeeders?: string[];
  title: string;
  description?: string;
}

/**
 * Renders a scenario topology as a one-line diagram. Pure presentation:
 * state comes in through props, selections go out through onSelectDevice.
 */
export function OneLineCanvas({
  scenario,
  devices,
  faultedEdges,
  showFault,
  selectable = [],
  emphasized = [],
  changedDeviceIds = [],
  highlightGroups = [],
  highlightTone = "limit",
  pathGroup,
  onSelectDevice,
  showLoads = true,
  showSectionLabels = true,
  animateFlow = true,
  compact,
  hideFeeders = [],
  title,
  description,
}: OneLineCanvasProps) {
  const { topology } = scenario;
  const nodes = useMemo(() => new Map(topology.nodes.map((n) => [n.id, n])), [topology.nodes]);
  const energization = useMemo(() => computeEnergization(scenario, devices, faultedEdges), [scenario, devices, faultedEdges]);
  const edges = topology.edges.filter((e) => !e.hidden && !hideFeeders.includes(e.feeder));
  const visibleNodeIds = new Set(edges.flatMap((e) => [e.from, e.to]));
  const lines = edges.filter((e) => e.kind === "line");
  const deviceEdges = edges.filter((e) => e.kind !== "line");

  // A faulted edge is "isolated" when every device touching its endpoints is open.
  const isolated = (edgeId: string) => {
    const e = topology.edges.find((x) => x.id === edgeId);
    if (!e) return false;
    const touching = topology.edges.filter((d) => d.kind !== "line" && [d.from, d.to].some((n) => n === e.from || n === e.to));
    return touching.length > 0 && touching.every((d) => (devices[d.id] ?? d.normal) === "open");
  };

  const { width, height } = topology.viewBox;
  const titleId = `${scenario.metadata.slug}-oneline-title`;
  const descId = `${scenario.metadata.slug}-oneline-desc`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={description ? `${titleId} ${descId}` : titleId}
      className="block h-auto w-full select-none"
      style={{ background: COLORS.bg }}
    >
      <title id={titleId}>{title}</title>
      {description && <desc id={descId}>{description}</desc>}

      {/* drafting grid */}
      <defs>
        <pattern id={`grid-${scenario.metadata.slug}${compact ? "-c" : ""}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--desk-rule)" strokeWidth="0.6" strokeOpacity="0.55" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#grid-${scenario.metadata.slug}${compact ? "-c" : ""})`} />

      {/* Restoration-path highlight: the complete source→tie→interrupted-load path, in blue. */}
      {pathGroup && (
        <g aria-hidden="true">
          {edges
            .filter((e) => e.pathGroups?.includes(pathGroup))
            .map((e) => {
              const g = edgeGeom(e, nodes);
              return <line key={`path-${e.id}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="var(--select)" strokeOpacity={0.32} strokeWidth={compact ? 12 : 16} strokeLinecap="round" />;
            })}
        </g>
      )}

      {lines.map((e) => {
        const g = edgeGeom(e, nodes);
        const isFaulted = faultedEdges.includes(e.id) && Boolean(showFault);
        return (
          <FeederSegment
            key={e.id}
            geom={g}
            energized={Boolean(energization.edgeSource[e.id])}
            faulted={isFaulted}
            isolated={isFaulted && isolated(e.id)}
            highlighted={Boolean(e.highlightGroup && highlightGroups.includes(e.highlightGroup))}
            highlightTone={highlightTone}
            label={e.label}
            showLabel={showSectionLabels && !compact && !isFaulted}
            animate={animateFlow}
            compact={compact}
          />
        );
      })}

      {/* device edges draw their wire underneath the symbol */}
      {deviceEdges.map((e) => {
        const g = edgeGeom(e, nodes);
        const liveFrom = Boolean(energization.nodeSource[e.from]);
        const liveTo = Boolean(energization.nodeSource[e.to]);
        const state = devices[e.id] ?? e.normal ?? "open";
        return (
          <g key={`${e.id}-wire`}>
            <line x1={g.x1} y1={g.y1} x2={g.mx} y2={g.my} stroke={liveFrom ? COLORS.live : COLORS.dead} strokeWidth={compact ? 3 : 4} strokeDasharray={liveFrom ? undefined : "7 6"} />
            <line x1={g.mx} y1={g.my} x2={g.x2} y2={g.y2} stroke={liveTo ? COLORS.live : COLORS.dead} strokeWidth={compact ? 3 : 4} strokeDasharray={liveTo ? undefined : "7 6"} />
            {state === "closed" && liveFrom && liveTo && animateFlow && (
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="var(--desk)" strokeOpacity={0.55} strokeWidth={compact ? 2 : 3} className="flow-anim" />
            )}
          </g>
        );
      })}

      {showLoads &&
        topology.loads.map((l) => {
          const e = topology.edges.find((x) => x.id === l.edgeId);
          if (!e || hideFeeders.includes(e.feeder)) return null;
          const g = edgeGeom(e, nodes);
          const at = l.at ?? 0.5;
          const x = g.x1 + (g.x2 - g.x1) * at;
          const y = g.y1 + (g.y2 - g.y1) * at;
          return (
            <LoadBlock
              key={l.id}
              x={x}
              y={y}
              customers={l.customers}
              side={l.side}
              energized={Boolean(energization.edgeSource[l.edgeId]) && !faultedEdges.includes(l.edgeId)}
              faulted={Boolean(showFault) && faultedEdges.includes(l.edgeId)}
            />
          );
        })}

      {/* nodes: sources and junction dots */}
      {topology.nodes
        .filter((n) => visibleNodeIds.has(n.id))
        .map((n) => {
          const live = Boolean(energization.nodeSource[n.id]);
          if (n.kind === "source") {
            const la = n.labelAt ?? "above";
            const ty = la === "above" ? n.y - 44 : n.y + 36;
            const anchor = n.x < width / 2 ? "start" : "end";
            const tx = anchor === "start" ? n.x - 18 : n.x + 18;
            return (
              <g key={n.id} aria-hidden="true">
                <circle cx={n.x} cy={n.y} r={compact ? 14 : 17} fill={COLORS.bg} stroke={COLORS.ink} strokeWidth={2} />
                <path d={`M ${n.x - 8} ${n.y} q 4 -8 8 0 t 8 0`} fill="none" stroke={COLORS.live} strokeWidth={2} />
                {!compact && (
                  <>
                    <text x={tx} y={ty} textAnchor={anchor} fontSize={12} fill={COLORS.ink} style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontWeight: 600 }}>
                      {n.label}
                    </text>
                    {n.sublabel && (
                      <text x={tx} y={ty + 14} textAnchor={anchor} fontSize={10.5} fill={COLORS.muted} style={{ fontFamily: "var(--font-body)" }}>
                        {n.sublabel}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          }
          if (n.kind === "end") {
            return <line key={n.id} x1={n.x} y1={n.y - 8} x2={n.x} y2={n.y + 8} stroke={live ? COLORS.live : COLORS.dead} strokeWidth={3} aria-hidden="true" />;
          }
          return <circle key={n.id} cx={n.x} cy={n.y} r={3} fill={live ? COLORS.live : COLORS.dead} aria-hidden="true" />;
        })}

      {deviceEdges.map((e) => {
        const g = edgeGeom(e, nodes);
        const live = Boolean(energization.nodeSource[e.from] || energization.nodeSource[e.to]);
        return (
          <DeviceNode
            key={e.id}
            id={e.id}
            kind={e.kind as "breaker" | "switch" | "tie"}
            geom={g}
            state={devices[e.id] ?? e.normal ?? "open"}
            live={live}
            label={e.label}
            trainingLabel={e.trainingLabel}
            caption={e.caption}
            labelAt={e.labelAt}
            selectable={selectable.includes(e.id)}
            emphasized={emphasized.includes(e.id)}
            changed={changedDeviceIds.includes(e.id)}
            compact={compact}
            onSelect={onSelectDevice}
          />
        );
      })}

      {showFault &&
        faultedEdges.map((id) => {
          const e = topology.edges.find((x) => x.id === id);
          if (!e) return null;
          const g = edgeGeom(e, nodes);
          return <FaultMarker key={id} x={g.mx} y={g.my} isolated={isolated(id)} />;
        })}
    </svg>
  );
}
