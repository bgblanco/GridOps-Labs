"use client";

import { useState } from "react";
import type { DecisionOption } from "@/lib/scenario/schema";
import { InfoQualityChip } from "./InfoQuality";

export interface EquipmentCardProps {
  option: DecisionOption;
  inspected: string[];
  selected: boolean;
  /** This tie's path is currently lit on the one-line. */
  pathActive?: boolean;
  locked?: boolean;
  /** Fired when the inspection panel is opened (lights the path on the map). */
  onExpand?: () => void;
  onInspect: (optionId: string, category: string) => void;
  onChoose: (optionId: string) => void;
}

/** Inspection card for one restoration path. Details reveal one category at a time. */
export function EquipmentCard({ option, inspected, selected, pathActive, locked, onExpand, onInspect, onChoose }: EquipmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `inspect-${option.id}`;
  const name = option.trainingLabel ?? option.label;
  const borderClass = selected ? "border-[var(--accent)]" : pathActive ? "border-[var(--select)]" : "border-desk-rule";
  return (
    <article
      className={`flex flex-col rounded-[3px] border bg-desk transition-colors ${borderClass}`}
      aria-label={`${name}, ${option.deviceId}`}
    >
      <header className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <h4 className="font-display text-xl font-semibold text-desk-ink">{name}</h4>
          <p className="mono text-sm text-desk-muted">{option.label} · {option.deviceId}</p>
        </div>
        <span className="nameplate rounded-[2px] border border-[var(--live)] px-1.5 py-0.5 text-[0.7rem] text-[var(--live)]">Available</span>
      </header>
      <p className="px-4 pt-2 text-sm text-desk-ink">{option.summary}</p>
      <ul className="px-4 pt-2 text-sm text-desk-muted">
        {option.cues.map((c) => (
          <li key={c} className="flex gap-2">
            <span aria-hidden="true">·</span>
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t border-desk-rule">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => {
            setExpanded((v) => {
              if (!v) onExpand?.();
              return !v;
            });
          }}
          className="flex min-h-[48px] w-full items-center justify-between px-4 text-left font-display font-semibold text-desk-ink hover:bg-desk-3"
        >
          <span>Inspect path</span>
          <span className="mono text-xs text-desk-muted">
            {inspected.length}/{option.inspection.length} viewed <span aria-hidden="true">{expanded ? "▴" : "▾"}</span>
          </span>
        </button>
        {expanded && (
          <ul id={panelId} className="grid gap-px border-t border-desk-rule bg-desk-rule">
            {option.inspection.map((it) => {
              const open = inspected.includes(it.category);
              const flagColor = it.flag === "limit" ? "var(--fault)" : it.flag === "caution" ? "var(--alarm)" : undefined;
              return (
                <li key={it.category} className="bg-desk">
                  {!open ? (
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => onInspect(option.id, it.category)}
                      className="flex min-h-[46px] w-full items-center justify-between gap-2 px-4 text-left text-sm text-desk-ink hover:bg-desk-3 disabled:opacity-50"
                    >
                      <span>{it.label}</span>
                      <span className="nameplate text-[0.68rem] text-desk-muted">Show</span>
                    </button>
                  ) : (
                    <div className="rise-in px-4 py-3" style={flagColor ? { boxShadow: `inset 3px 0 0 ${flagColor}` } : undefined}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-desk-muted">{it.label}</span>
                        <InfoQualityChip quality={it.quality} />
                      </div>
                      <p className="mono mt-1 text-[0.95rem]" style={{ color: flagColor ?? "var(--desk-ink)" }}>
                        {it.value}
                      </p>
                      {it.detail && <p className="mt-1 text-sm leading-relaxed text-desk-muted">{it.detail}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-auto border-t border-desk-rule p-3">
        <label className={`choice ${locked ? "opacity-60" : ""}`}>
          <input type="radio" name="restoration-path" value={option.id} checked={selected} disabled={locked} onChange={() => onChoose(option.id)} />
          <span className="font-display font-semibold">Select {name}</span>
        </label>
      </div>
    </article>
  );
}
