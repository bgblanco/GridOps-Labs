"use client";

import { useEffect, useState } from "react";
import type { Consequence } from "@/lib/scenario/schema";
import { AlarmCard } from "./AlarmCard";

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Executes the decision visibly, then explains. Never shows correct/incorrect. */
export function ConsequencePanel({ consequence, onContinue }: { consequence: Consequence; onContinue: () => void }) {
  const total = consequence.sequence.length + 1; // +1 = alarms/explanation
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStep(total);
      return;
    }
    if (step >= total) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 350 : 900);
    return () => window.clearTimeout(t);
  }, [step, total]);

  const revealed = step > consequence.sequence.length;
  return (
    <div className="grid gap-5" aria-live="polite">
      <ol className="grid gap-2">
        {consequence.sequence.slice(0, step).map((line, i) => (
          <li key={i} className="rise-in flex items-baseline gap-3">
            <span className="mono w-6 flex-none text-sm text-desk-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-desk-ink">{line}</span>
          </li>
        ))}
      </ol>

      {revealed && (
        <div className="rise-in grid gap-4">
          <div className="grid gap-2">
            {consequence.alarms.map((a) => (
              <AlarmCard key={a.id} alarm={a} fresh />
            ))}
          </div>
          <div className="rounded-[3px] border border-desk-rule bg-desk p-4 sm:p-5">
            <p className="nameplate text-desk-muted">What happened</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-desk-ink">{consequence.headline}</h3>
            <div className="mt-3 grid max-w-[68ch] gap-2.5 text-[0.98rem] leading-relaxed text-desk-ink">
              {consequence.explanation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-xs text-desk-muted">Fictional training values. This scenario demonstrates reasoning, not a real-world switching procedure.</p>
          </div>
          <div>
            <button type="button" className="btn btn-primary" onClick={onContinue}>
              Go to debrief
            </button>
          </div>
        </div>
      )}
      {!revealed && (
        <div>
          <button type="button" className="btn btn-desk" onClick={() => setStep(total)}>
            Skip ahead
          </button>
        </div>
      )}
    </div>
  );
}
