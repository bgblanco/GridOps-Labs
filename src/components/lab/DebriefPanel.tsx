"use client";

import { useState } from "react";

export interface DebriefPanelProps {
  inspected: { id: string; label: string; group: string }[];
  notInspected: { id: string; label: string; group: string }[];
  selectedPath: string;
  reasons: string[];
  reasonText?: string;
  result: string;
  resultTone: "suitable" | "limited";
  timeToDecision: string;
  principle: string;
  principleDetail: string;
  reflectionPrompt: string;
  scopeNotes: string[];
  savedAnswer?: string;
  onAnswer: (text: string) => void;
}

function grouped(rows: DebriefPanelProps["inspected"]) {
  const m = new Map<string, string[]>();
  for (const r of rows) {
    const label = r.label.includes(" · ") ? r.label.split(" · ")[1] : r.label;
    m.set(r.group, [...(m.get(r.group) ?? []), label]);
  }
  return [...m.entries()];
}

export function DebriefPanel(p: DebriefPanelProps) {
  const [answer, setAnswer] = useState(p.savedAnswer ?? "");
  return (
    <div className="grid gap-8">
      <section aria-labelledby="your-decision">
        <h3 id="your-decision" className="nameplate text-desk-muted">Your decision</h3>
        <dl className="mt-3 grid gap-px overflow-hidden rounded-[3px] border border-desk-rule bg-desk-rule text-sm">
          {[
            ["Selected restoration path", p.selectedPath],
            ["Reason selected", p.reasons.join("; ") + (p.reasonText ? ` — “${p.reasonText}”` : "")],
            ["Result", p.result],
            ["Time to decision", p.timeToDecision],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 bg-desk px-4 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <dt className="text-desk-muted">{k}</dt>
              <dd className="text-desk-ink" style={k === "Result" ? { color: p.resultTone === "limited" ? "var(--fault)" : "var(--live)" } : undefined}>
                {v}
              </dd>
            </div>
          ))}
          <div className="grid gap-1 bg-desk px-4 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
            <dt className="text-desk-muted">Information inspected</dt>
            <dd className="text-desk-ink">
              {p.inspected.length ? (
                <ul className="grid gap-1">
                  {grouped(p.inspected).map(([g, items]) => (
                    <li key={g}>
                      <span className="font-semibold">{g}:</span> {items.join(", ")}
                    </li>
                  ))}
                </ul>
              ) : (
                "None"
              )}
            </dd>
          </div>
          <div className="grid gap-1 bg-desk px-4 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
            <dt className="text-desk-muted">Information not inspected</dt>
            <dd className="text-desk-muted">
              {p.notInspected.length ? (
                <ul className="grid gap-1">
                  {grouped(p.notInspected).map(([g, items]) => (
                    <li key={g}>
                      <span className="font-semibold text-desk-ink">{g}:</span> {items.join(", ")}
                    </li>
                  ))}
                </ul>
              ) : (
                "You opened every available detail."
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="border-y border-desk-rule py-8 text-center">
        <p className="font-display text-[clamp(2rem,6vw,3.6rem)] font-bold uppercase leading-none tracking-[0.02em] text-[var(--accent)]">{p.principle}</p>
        <p className="mx-auto mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-desk-ink">{p.principleDetail}</p>
      </section>

      <section aria-labelledby="reflect">
        <h3 id="reflect" className="font-display text-xl font-semibold text-desk-ink">
          {p.reflectionPrompt}
        </h3>
        <p className="mt-1 text-sm text-desk-muted">There isn&apos;t one right list. Write what you&apos;d actually check.</p>
        {p.savedAnswer ? (
          <p className="mt-3 rounded-[3px] border border-desk-rule bg-desk p-3 text-sm text-desk-ink">{p.savedAnswer}</p>
        ) : (
          <form
            className="mt-3 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (answer.trim()) p.onAnswer(answer);
            }}
          >
            <label htmlFor="debrief-answer" className="sr-only">
              {p.reflectionPrompt}
            </label>
            <textarea id="debrief-answer" className="field" maxLength={600} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="For example: path ratings between the source and the tie, and how the transfer estimate was made." />
            <div>
              <button type="submit" className="btn btn-desk" disabled={!answer.trim()}>
                Save my answer
              </button>
            </div>
          </form>
        )}
        <ul className="mt-5 grid gap-2 text-sm leading-relaxed text-desk-muted">
          {p.scopeNotes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true">—</span>
              {n}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
