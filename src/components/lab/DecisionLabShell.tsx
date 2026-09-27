"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Scenario } from "@/lib/scenario/schema";
import {
  buildReplay,
  canAdvance,
  competencyEvidence,
  createInitialState,
  currentPhase,
  formatSimClock,
  getConsequence,
  getDecisionPoint,
  inspectionCoverage,
  labReducer,
  liveSystemView,
  type LabAction,
} from "@/lib/scenario/engine";
import { trackLogEntries } from "@/lib/analytics/observe";
import { OneLineCanvas } from "./oneline/OneLineCanvas";
import { SystemStatePanel } from "./SystemStatePanel";
import { InformationCard } from "./InformationCard";
import { FieldReportCard } from "./FieldReportCard";
import { AlarmCard } from "./AlarmCard";
import { DecisionPanel } from "./DecisionPanel";
import { ConsequencePanel } from "./ConsequencePanel";
import { DebriefPanel } from "./DebriefPanel";
import { ReplayTimeline } from "./ReplayTimeline";
import { CompetencyEvidence } from "./CompetencyEvidence";
import { FeedbackForm } from "./FeedbackForm";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { InfoQualityLegend } from "./InfoQuality";
import { StoryScene } from "./PixelScene";

function useLab(scenario: Scenario) {
  const reducer = useCallback((s: ReturnType<typeof createInitialState>, a: LabAction) => labReducer(scenario, s, a), [scenario]);
  const [state, dispatch] = useReducer(reducer, scenario, createInitialState);
  const tracked = useRef(0);
  useEffect(() => {
    if (state.log.length < tracked.current) tracked.current = 0; // reset
    const fresh = state.log.slice(tracked.current);
    if (fresh.length) trackLogEntries(fresh, scenario.metadata.id);
    tracked.current = state.log.length;
  }, [state.log, scenario.metadata.id]);
  return [state, dispatch] as const;
}

const fmtDuration = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
};

export function DecisionLabShell({ scenario, headingLevel = 2 }: { scenario: Scenario; headingLevel?: 2 | 3 }) {
  const [state, dispatch] = useLab(scenario);
  const [lockoutShown, setLockoutShown] = useState(false);
  const [highlight, setHighlight] = useState<string[]>([]);
  const phase = currentPhase(scenario, state);
  const view = liveSystemView(scenario, state);
  const panelRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const now = () => Date.now();
  const H = headingLevel === 2 ? "h2" : "h3";
  const { metadata: meta, environment: env } = scenario;

  // Event animation: energized → interrupted
  useEffect(() => {
    if (!state.started) {
      setLockoutShown(false);
      return;
    }
    const t = window.setTimeout(() => setLockoutShown(true), 1400);
    return () => window.clearTimeout(t);
  }, [state.started]);

  // Keep the active panel in view on small screens when the phase changes
  const lastPhase = useRef(state.phaseIndex);
  useEffect(() => {
    if (lastPhase.current !== state.phaseIndex && state.phaseIndex > 0) {
      const el = phase.type === "debrief" ? shellRef.current : panelRef.current;
      const rect = el?.getBoundingClientRect();
      if (rect && (rect.top < 0 || rect.top > window.innerHeight * 0.7)) el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    lastPhase.current = state.phaseIndex;
  }, [state.phaseIndex, phase.type]);

  useEffect(() => {
    if (phase.type === "debrief" && !state.completed) dispatch({ type: "COMPLETE", now: Date.now() });
  }, [phase.type, state.completed, dispatch]);

  const consequence = getConsequence(scenario, state.consequenceId);

  // What the one-line should show right now
  const preEvent = phase.type === "event" && !lockoutShown;
  const devices = preEvent ? { ...state.devices, ...Object.fromEntries(scenario.topology.edges.filter((e) => e.normal).map((e) => [e.id, e.normal!])) } : state.devices;
  const faulted = preEvent ? [] : state.faultedEdges;
  const phaseIdx = state.phaseIndex;
  const reportIdx = scenario.phases.findIndex((p) => p.type === "report");
  const showFault = reportIdx >= 0 && phaseIdx >= reportIdx;
  const hideFeeders = (scenario.topology.revealFeeders ?? [])
    .filter((r) => phaseIdx < scenario.phases.findIndex((p) => p.id === r.atPhase))
    .map((r) => r.feeder);
  const decidePhase = scenario.phases.find((p) => p.type === "decide");
  const dp = decidePhase && decidePhase.type === "decide" ? getDecisionPoint(scenario, decidePhase.decisionPointId) : undefined;
  const chosenOption = dp?.options.find((o) => o.id === state.submitted?.optionId);
  const selectable =
    phase.type === "isolate"
      ? scenario.topology.edges.filter((e) => e.kind !== "line" && !hideFeeders.includes(e.feeder)).map((e) => e.id).filter((id) => state.devices[id] !== "open" || !phase.requiredOpen.includes(id))
      : phase.type === "restore" && !canAdvance(scenario, state)
        ? phase.close
        : [];
  const emphasized = phase.type === "decide" && state.draft.optionId ? [getDecisionPoint(scenario, phase.decisionPointId).options.find((o) => o.id === state.draft.optionId)!.deviceId] : [];
  const highlightGroups = phase.type === "consequence" || phase.type === "debrief" ? (consequence?.highlightGroups ?? []) : phase.type === "decide" ? highlight : [];

  const feederStatus = preEvent
    ? { text: "Energized", tone: "live" as const }
    : view.customersInterrupted >= scenario.initialState.customersInterrupted
      ? { text: "Locked out", tone: "fault" as const }
      : consequence
        ? { text: "Abnormal config", tone: "mixed" as const }
        : { text: "Partly restored", tone: "mixed" as const };

  const onSelectDevice = (id: string) => {
    if (phase.type === "isolate") dispatch({ type: "SELECT_DEVICE", deviceId: id, now: now() });
    if (phase.type === "restore") dispatch({ type: "RESTORE_NORMAL", now: now() });
  };

  const advance = () => dispatch({ type: "NEXT", now: now() });
  const reset = () => {
    setHighlight([]);
    dispatch({ type: "RESET" });
    shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const coverage = useMemo(() => inspectionCoverage(scenario, state), [scenario, state]);

  return (
    <section ref={shellRef} className="on-desk scroll-mt-20 overflow-hidden rounded-[4px] border border-desk-rule bg-desk-2 text-desk-ink" aria-label={`${meta.series}: ${meta.id} ${meta.title}`}>
      {/* Header bar */}
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-desk-rule bg-desk px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="nameplate text-[0.7rem] text-[var(--accent)]">{meta.series}</p>
          <H className="font-display text-lg font-semibold text-desk-ink sm:text-xl">
            {meta.id} — {meta.title}
          </H>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-desk-muted">
            {env.grid} · <span className="nameplate text-[0.7rem]">Public beta</span>
          </span>
          {state.started && (
            <button type="button" onClick={reset} className="btn btn-desk min-h-[40px] px-3 text-sm">
              Restart
            </button>
          )}
        </div>
      </header>

      {/* Progress rail */}
      <nav aria-label="Scenario progress" className="diagram-scroll border-b border-desk-rule">
        <ol className="flex min-w-max">
          {scenario.phases.map((p, i) => {
            const status = i < phaseIdx ? "done" : i === phaseIdx ? "current" : "todo";
            return (
              <li
                key={p.id}
                aria-current={status === "current" ? "step" : undefined}
                className={`flex items-center gap-2 border-r border-desk-rule px-3 py-2 text-xs sm:px-4 ${status === "current" ? "bg-desk-3 text-desk-ink" : status === "done" ? "text-desk-ink" : "text-desk-muted"}`}
              >
                <span className="mono" style={{ color: status === "current" ? "var(--accent)" : undefined }}>
                  {status === "done" ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <span className="nameplate text-[0.7rem]">{p.step}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Intro (event phase, not started) */}
      {phase.type === "event" && !state.started && (
        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1.1fr_1fr] md:items-center">
          <StoryScene story={phase.story ?? "storm-substation"} className="order-first overflow-hidden rounded-[3px] border border-desk-rule md:order-last" caption={`${env.grid} · east service area · ${scenario.clock.start}`} />
          <div>
            <p className="nameplate text-desk-muted">{env.utility}</p>
            <p className="mono mt-2 text-5xl text-desk-ink sm:text-6xl">{scenario.clock.start}</p>
            <p className="mt-2 font-display text-3xl font-bold uppercase tracking-[0.03em] text-[var(--fault)]">{phase.headline}</p>
            <div className="mt-4 grid gap-1 text-desk-muted">
              {phase.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="mt-5 text-sm text-desk-muted">
              {meta.estimatedMinutes[0]}–{meta.estimatedMinutes[1]} minutes · No account needed · Fictional system
            </p>
            <button type="button" className="btn btn-primary mt-4" onClick={() => dispatch({ type: "START", now: now() })}>
              Take the desk
            </button>
          </div>
        </div>
      )}

      {/* Live desk */}
      {state.started && (
        <>
          <SystemStatePanel feederLabel={env.primaryFeeder} clock={formatSimClock(scenario.clock.start, state.sim)} customersOut={preEvent ? 0 : view.customersInterrupted} feederStatus={feederStatus.text} statusTone={feederStatus.tone} />
          {phase.type !== "event" && phase.type !== "debrief" && phase.story && (
            <StoryScene story={phase.story} variant="banner" className="border-b border-desk-rule" />
          )}
          {phase.type !== "debrief" && (
            <div className="diagram-scroll border-b border-desk-rule">
              <OneLineCanvas
                scenario={scenario}
                devices={devices}
                faultedEdges={faulted}
                showFault={showFault}
                selectable={selectable}
                emphasized={emphasized}
                highlightGroups={highlightGroups}
                onSelectDevice={onSelectDevice}
                hideFeeders={hideFeeders}
                title={`${env.grid} one-line, ${env.primaryFeeder}. ${view.customersInterrupted.toLocaleString("en-US")} customers interrupted.`}
                description="Fictional training one-line. Solid teal lines are energized; dashed lines are de-energized."
              />
            </div>
          )}

          <div ref={panelRef} className="scroll-mt-20 p-4 sm:p-6">
            {state.notice && (phase.type === "isolate" || phase.type === "restore") && (
              <p role="status" className="rise-in mb-4 rounded-[3px] border px-3 py-2 text-sm" style={{ borderColor: state.notice.tone === "caution" ? "var(--alarm)" : state.notice.tone === "ok" ? "var(--live)" : "var(--desk-rule)", color: state.notice.tone === "caution" ? "var(--alarm)" : "var(--desk-ink)" }}>
                {state.notice.text}
              </p>
            )}

            {phase.type === "event" && (
              <div className="grid gap-4">
                {lockoutShown ? (
                  <>
                    {scenario.initialState.alarms.map((a) => (
                      <AlarmCard key={a.id} alarm={a} fresh />
                    ))}
                    <p className="max-w-[60ch] text-desk-muted">{phase.afterText}</p>
                    <div>
                      <button type="button" className="btn btn-primary" onClick={advance}>
                        Begin assessment
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-desk-muted" aria-live="polite">
                    {env.primaryFeeder} in normal configuration…
                  </p>
                )}
              </div>
            )}

            {phase.type === "review" && (
              <div className="grid gap-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold">{phase.prompt}</h3>
                  <p className="mt-1 text-sm text-desk-muted">Open as many as you like. Each one is labeled with where the information comes from.</p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {phase.infoIds.map((id) => {
                    const item = scenario.information.find((i) => i.id === id)!;
                    return <InformationCard key={id} item={item} open={state.viewedInfo.includes(id)} onOpen={(infoId) => dispatch({ type: "VIEW_INFO", infoId, now: now() })} />;
                  })}
                </div>
                <details className="rounded-[3px] border border-desk-rule bg-desk px-4 py-3 text-sm">
                  <summary className="cursor-pointer font-display font-semibold">How GridOps labels information</summary>
                  <div className="mt-3">
                    <InfoQualityLegend />
                  </div>
                </details>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" className="btn btn-primary" disabled={!canAdvance(scenario, state)} onClick={advance}>
                    Continue
                  </button>
                  {!canAdvance(scenario, state) && <span className="text-sm text-desk-muted">Review at least one item to continue.</span>}
                </div>
              </div>
            )}

            {phase.type === "report" && (
              <div className="grid gap-5">
                <h3 className="font-display text-2xl font-semibold">{phase.prompt}</h3>
                <FieldReportCard report={scenario.reports.find((r) => r.id === phase.reportId)!} />
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-primary" onClick={advance}>
                    Isolate the fault
                  </button>
                  <button type="button" className="btn btn-desk" onClick={() => dispatch({ type: "BACK", now: now() })}>
                    Back to assessment
                  </button>
                </div>
              </div>
            )}

            {phase.type === "isolate" && (
              <div className="grid gap-4">
                <h3 className="font-display text-2xl font-semibold">{phase.prompt}</h3>
                {phase.helpText && <p className="text-sm text-desk-muted">{phase.helpText}</p>}
                <DeviceList
                  scenario={scenario}
                  ids={scenario.topology.edges.filter((e) => e.kind !== "line" && !hideFeeders.includes(e.feeder)).map((e) => e.id)}
                  devices={state.devices}
                  onSelect={onSelectDevice}
                  done={canAdvance(scenario, state)}
                />
                {canAdvance(scenario, state) && (
                  <div>
                    <button type="button" className="btn btn-primary" onClick={advance}>
                      Continue to restoration
                    </button>
                  </div>
                )}
              </div>
            )}

            {phase.type === "restore" && (
              <div className="grid gap-4">
                <h3 className="font-display text-2xl font-semibold">{phase.prompt}</h3>
                {!canAdvance(scenario, state) ? (
                  <div>
                    <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "RESTORE_NORMAL", now: now() })}>
                      {phase.actionLabel}
                    </button>
                  </div>
                ) : (
                  <div className="rise-in grid gap-4">
                    <dl className="grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-desk-rule bg-desk-rule">
                      <div className="bg-desk p-3">
                        <dt className="nameplate text-[0.68rem] text-desk-muted">Source side</dt>
                        <dd className="font-display text-lg font-semibold text-[var(--live)]">Restored</dd>
                      </div>
                      <div className="bg-desk p-3">
                        <dt className="nameplate text-[0.68rem] text-desk-muted">Still interrupted</dt>
                        <dd className="mono text-lg">{view.customersInterrupted.toLocaleString("en-US")}</dd>
                      </div>
                    </dl>
                    {phase.afterText && <p className="max-w-[62ch] text-desk-muted">{phase.afterText}</p>}
                    <div>
                      <button type="button" className="btn btn-primary" onClick={advance}>
                        Review alternate sources
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {phase.type === "decide" && (
              <DecisionPanel
                point={getDecisionPoint(scenario, phase.decisionPointId)}
                inspected={state.inspected}
                draft={state.draft}
                onInspect={(optionId, category) => {
                  dispatch({ type: "INSPECT", optionId, category, now: now() });
                  const item = getDecisionPoint(scenario, phase.decisionPointId).options.find((o) => o.id === optionId)?.inspection.find((i) => i.category === category);
                  setHighlight(item?.highlightGroup ? [item.highlightGroup] : []);
                }}
                onChoose={(optionId) => dispatch({ type: "CHOOSE_OPTION", optionId, now: now() })}
                onReasons={(reasonIds) => dispatch({ type: "SET_REASONS", reasonIds, now: now() })}
                onText={(text) => dispatch({ type: "SET_TEXT", text })}
                onSubmit={() => dispatch({ type: "SUBMIT_DECISION", now: now() })}
              />
            )}

            {phase.type === "consequence" && consequence && <ConsequencePanel consequence={consequence} onContinue={advance} />}

            {phase.type === "debrief" && consequence && state.submitted && (
              <div className="grid gap-10">
                <DebriefPanel
                  inspected={coverage.filter((c) => c.viewed)}
                  notInspected={coverage.filter((c) => !c.viewed)}
                  selectedPath={`${chosenOption?.label} (${chosenOption?.deviceId})`}
                  reasons={state.submitted.reasonIds.map((r) => dp?.reasons.find((x) => x.id === r)?.label ?? r)}
                  reasonText={state.submitted.text || undefined}
                  result={consequence.resultLabel}
                  resultTone={consequence.outcome}
                  timeToDecision={fmtDuration(state.submitted.timeToDecisionMs)}
                  principle={scenario.debrief.principle}
                  principleDetail={scenario.debrief.principleDetail}
                  reflectionPrompt={scenario.debrief.reflectionPrompt}
                  scopeNotes={scenario.debrief.scopeNotes}
                  savedAnswer={state.debriefAnswer}
                  onAnswer={(text) => dispatch({ type: "ANSWER_DEBRIEF", text, now: now() })}
                />

                <section aria-labelledby="replay-h">
                  <h3 id="replay-h" className="nameplate text-desk-muted">Replay</h3>
                  <p className="mt-1 mb-4 text-sm text-desk-muted">Everything you did, in order.</p>
                  <ReplayTimeline rows={buildReplay(scenario, state)} />
                </section>

                <section aria-labelledby="evidence-h">
                  <h3 id="evidence-h" className="nameplate text-desk-muted">Evidence observed in this scenario</h3>
                  <div className="mt-4">
                    <CompetencyEvidence blocks={competencyEvidence(scenario, state)} />
                  </div>
                </section>

                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-desk" onClick={reset}>
                    Run it again
                  </button>
                </div>

                <section aria-labelledby="fb-h" className="rounded-[3px] border border-desk-rule bg-desk p-4 sm:p-6">
                  <h3 id="fb-h" className="nameplate text-[var(--accent)]">Help us improve this scenario</h3>
                  <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-desk-muted">
                    GridOps Labs is actively collecting feedback from distribution professionals while the Decision Lab methodology is being developed.
                  </p>
                  <div className="mt-5">
                    <FeedbackForm scenarioId={meta.id} />
                  </div>
                </section>

                <section aria-labelledby="ea-h" className="border-t border-desk-rule pt-8">
                  <h3 id="ea-h" className="font-display text-2xl font-semibold">Want to try the next GridOps Field Test?</h3>
                  <div className="mt-4 max-w-xl">
                    <EarlyAccessForm scenarioId={meta.id} idPrefix={`ea-${meta.slug}`} />
                  </div>
                </section>
              </div>
            )}
          </div>
        </>
      )}

      <footer className="border-t border-desk-rule bg-desk px-4 py-3 text-xs leading-relaxed text-desk-muted sm:px-5">{env.disclaimer}</footer>
    </section>
  );
}

function DeviceList({ scenario, ids, devices, onSelect, done }: { scenario: Scenario; ids: string[]; devices: Record<string, string>; onSelect: (id: string) => void; done: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Devices on the one-line">
      {ids.map((id) => {
        const e = scenario.topology.edges.find((x) => x.id === id)!;
        const st = devices[id] ?? e.normal;
        return (
          <li key={id}>
            <button type="button" disabled={done} onClick={() => onSelect(id)} className="btn btn-desk min-h-[44px] px-3 text-sm">
              <span className="mono">{e.label}</span>
              <span className="nameplate text-[0.65rem]" style={{ color: st === "open" ? "var(--desk-muted)" : "var(--live)" }}>
                {st}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
