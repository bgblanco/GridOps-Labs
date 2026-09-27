"use client";

import type { DecisionPoint } from "@/lib/scenario/schema";
import type { DecisionDraft } from "@/lib/scenario/engine";
import { EquipmentCard } from "./EquipmentCard";
import { ReasonCapture } from "./ReasonCapture";

export interface DecisionPanelProps {
  point: DecisionPoint;
  inspected: Record<string, string[]>;
  draft: DecisionDraft;
  onInspect: (optionId: string, category: string) => void;
  onChoose: (optionId: string) => void;
  onReasons: (ids: string[]) => void;
  onText: (t: string) => void;
  onSubmit: () => void;
}

export function DecisionPanel({ point, inspected, draft, onInspect, onChoose, onReasons, onText, onSubmit }: DecisionPanelProps) {
  const chosen = point.options.find((o) => o.id === draft.optionId);
  const ready = Boolean(chosen && draft.reasonIds.length);
  return (
    <div className="grid gap-5">
      <div>
        <h3 className="font-display text-2xl font-semibold text-desk-ink">{point.prompt}</h3>
        {point.context && <p className="mt-1 max-w-[62ch] text-sm text-desk-muted">{point.context}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-3 md:items-start">
        {point.options.map((o) => (
          <EquipmentCard
            key={o.id}
            option={o}
            inspected={inspected[o.id] ?? []}
            selected={draft.optionId === o.id}
            onInspect={onInspect}
            onChoose={onChoose}
          />
        ))}
      </div>
      {chosen && (
        <div className="rounded-[3px] border border-desk-rule bg-desk-2 p-4">
          <ReasonCapture
            prompt={point.reasonPrompt}
            reasons={point.reasons}
            selected={draft.reasonIds}
            text={draft.text}
            allowFreeText={point.allowFreeText}
            onReasons={onReasons}
            onText={onText}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" disabled={!ready} onClick={onSubmit}>
              Close {chosen.deviceId}
            </button>
            {!draft.reasonIds.length && <span className="text-sm text-desk-muted">Choose at least one reason to continue.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
