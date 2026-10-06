import type {
  Consequence,
  DecisionOption,
  DecisionPoint,
  DeviceState,
  EvidencePredicate,
  LogType,
  Phase,
  Scenario,
} from "./schema";
import { computeEnergization, customersInterrupted } from "./topology";

/**
 * Decision Lab engine: a pure reducer over scenario data.
 * No React, no DOM, no analytics. The UI dispatches actions; analytics
 * observe the log (see src/lib/analytics).
 */

export interface LogEntry {
  seq: number;
  type: LogType;
  /** Real wall-clock ms (for time-to-decision) */
  at: number;
  /** Simulated scenario seconds since clock.start */
  sim: number;
  phaseId: string;
  /** Machine-readable subject, e.g. device or info id */
  ref?: string;
  /** Human-readable detail */
  detail?: string;
  /** Replay highlight lane */
  lane?: "info" | "device" | "decision" | "outcome" | "system";
}

export interface DecisionDraft {
  optionId?: string;
  reasonIds: string[];
  text: string;
}

export interface LabState {
  scenarioId: string;
  phaseIndex: number;
  started: boolean;
  devices: Record<string, DeviceState>;
  faultedEdges: string[];
  viewedInfo: string[];
  /** optionId -> inspected category ids */
  inspected: Record<string, string[]>;
  isolation: { opened: string[]; attempts: string[]; notes: string[] };
  draft: DecisionDraft;
  changedDecisionCount: number;
  submitted?: { optionId: string; reasonIds: string[]; text: string; at: number; timeToDecisionMs: number };
  consequenceId?: string;
  debriefAnswer?: string;
  completed: boolean;
  startedAt?: number;
  decisionPhaseEnteredAt?: number;
  sim: number;
  log: LogEntry[];
  /** Last engine message for the UI (e.g. isolation hint) */
  notice?: { tone: "info" | "caution" | "ok"; text: string };
}

export type LabAction =
  | { type: "START"; now: number }
  | { type: "NEXT"; now: number }
  | { type: "BACK"; now: number }
  | { type: "VIEW_INFO"; infoId: string; now: number }
  | { type: "SELECT_DEVICE"; deviceId: string; now: number }
  | { type: "RESTORE_NORMAL"; now: number }
  | { type: "INSPECT"; optionId: string; category: string; now: number }
  | { type: "CHOOSE_OPTION"; optionId: string; now: number }
  | { type: "SET_REASONS"; reasonIds: string[]; now: number }
  | { type: "SET_TEXT"; text: string }
  | { type: "SUBMIT_DECISION"; now: number }
  | { type: "ANSWER_DEBRIEF"; text: string; now: number }
  | { type: "COMPLETE"; now: number }
  | { type: "RESET" };

export function createInitialState(scenario: Scenario): LabState {
  return {
    scenarioId: scenario.metadata.id,
    phaseIndex: 0,
    started: false,
    devices: { ...scenario.initialState.devices },
    faultedEdges: [...scenario.initialState.faultedEdges],
    viewedInfo: [],
    inspected: {},
    isolation: { opened: [], attempts: [], notes: [] },
    draft: { reasonIds: [], text: "" },
    changedDecisionCount: 0,
    completed: false,
    sim: 0,
    log: [],
  };
}

export const currentPhase = (scenario: Scenario, state: LabState): Phase =>
  scenario.phases[Math.min(state.phaseIndex, scenario.phases.length - 1)];

export const getDecisionPoint = (scenario: Scenario, id: string): DecisionPoint => {
  const dp = scenario.decisionPoints.find((d) => d.id === id);
  if (!dp) throw new Error(`Decision point ${id} not found in ${scenario.metadata.id}`);
  return dp;
};

export const getConsequence = (scenario: Scenario, id?: string): Consequence | undefined =>
  scenario.consequences.find((c) => c.id === id);

export const allOptions = (scenario: Scenario): DecisionOption[] =>
  scenario.decisionPoints.flatMap((d) => d.options);

function log(
  scenario: Scenario,
  state: LabState,
  entry: Omit<LogEntry, "seq" | "sim" | "phaseId" | "at"> & { at?: number },
): LabState {
  const cost = scenario.clock.costs[entry.type] ?? 0;
  const sim = state.sim + cost;
  const next: LogEntry = {
    seq: state.log.length + 1,
    sim,
    at: entry.at ?? Date.now(),
    phaseId: currentPhase(scenario, state).id,
    ...entry,
  };
  return { ...state, sim, log: [...state.log, next] };
}

function enterPhase(scenario: Scenario, state: LabState, index: number, now: number): LabState {
  const bounded = Math.max(0, Math.min(index, scenario.phases.length - 1));
  let next: LabState = { ...state, phaseIndex: bounded, notice: undefined };
  const phase = scenario.phases[bounded];
  next = log(scenario, next, { type: "phaseEntered", ref: phase.id, detail: phase.step, at: now, lane: "system" });
  if (phase.type === "report") {
    const report = scenario.reports.find((r) => r.id === phase.reportId);
    next = log(scenario, next, {
      type: "fieldReportReceived",
      ref: phase.reportId,
      detail: report ? `${report.from}: "${report.message}"` : undefined,
      at: now,
      lane: "info",
    });
  }
  if (phase.type === "decide" && !next.decisionPhaseEnteredAt) {
    next.decisionPhaseEnteredAt = now;
  }
  return next;
}

/** Can the learner move forward from the current phase? */
export function canAdvance(scenario: Scenario, state: LabState): boolean {
  const phase = currentPhase(scenario, state);
  switch (phase.type) {
    case "event":
      return state.started;
    case "review":
      return phase.infoIds.filter((id) => state.viewedInfo.includes(id)).length >= phase.minViews;
    case "report":
      return true;
    case "isolate":
      return phase.requiredOpen.every((id) => state.devices[id] === "open");
    case "restore":
      return phase.close.every((id) => state.devices[id] === "closed");
    case "decide":
      return Boolean(state.submitted);
    case "consequence":
      return Boolean(state.consequenceId);
    case "debrief":
      return false;
  }
}

export function labReducer(scenario: Scenario, state: LabState, action: LabAction): LabState {
  const phase = currentPhase(scenario, state);

  switch (action.type) {
    case "RESET":
      return createInitialState(scenario);

    case "START": {
      if (state.started) return state;
      let next: LabState = { ...state, started: true, startedAt: action.now };
      next = log(scenario, next, {
        type: "scenarioStarted",
        detail: scenario.phases[0].type === "event" ? scenario.phases[0].headline : scenario.metadata.title,
        at: action.now,
        lane: "system",
      });
      return next;
    }

    case "NEXT": {
      if (!canAdvance(scenario, state)) return state;
      return enterPhase(scenario, state, state.phaseIndex + 1, action.now);
    }

    case "BACK": {
      // Only allowed back into read-only phases; never undo operated devices.
      if (state.phaseIndex === 0) return state;
      const prev = scenario.phases[state.phaseIndex - 1];
      if (!["review", "report"].includes(prev.type)) return state;
      return { ...state, phaseIndex: state.phaseIndex - 1, notice: undefined };
    }

    case "VIEW_INFO": {
      if (state.viewedInfo.includes(action.infoId)) return state;
      const item = scenario.information.find((i) => i.id === action.infoId);
      if (!item) return state;
      const next = { ...state, viewedInfo: [...state.viewedInfo, action.infoId] };
      return log(scenario, next, {
        type: "informationViewed",
        ref: item.id,
        detail: `${item.title} (${item.quality})`,
        at: action.now,
        lane: "info",
      });
    }

    case "SELECT_DEVICE": {
      if (phase.type !== "isolate") return state;
      const edge = scenario.topology.edges.find((e) => e.id === action.deviceId);
      if (!edge || edge.kind === "line") return state;
      const label = edge.label ?? edge.id;
      let next: LabState = {
        ...state,
        isolation: { ...state.isolation, attempts: [...state.isolation.attempts, edge.id] },
      };
      next = log(scenario, next, { type: "deviceSelected", ref: edge.id, detail: label, at: action.now, lane: "device" });

      if (phase.requiredOpen.includes(edge.id)) {
        if (state.devices[edge.id] === "open") {
          return { ...next, notice: { tone: "info", text: `${label} is already open.` } };
        }
        next = { ...next, devices: { ...next.devices, [edge.id]: "open" } };
        next.isolation = { ...next.isolation, opened: [...next.isolation.opened, edge.id] };
        next = log(scenario, next, { type: "deviceOperated", ref: edge.id, detail: `${label} opened`, at: action.now, lane: "device" });
        const done = phase.requiredOpen.every((id) => next.devices[id] === "open");
        if (done) {
          next = log(scenario, next, {
            type: "faultIsolated",
            detail: phase.requiredOpen.map((id) => scenario.topology.edges.find((e) => e.id === id)?.label ?? id).join(" and ") + " open",
            at: action.now,
            lane: "outcome",
          });
          return { ...next, notice: { tone: "ok", text: phase.successText } };
        }
        return { ...next, notice: { tone: "ok", text: `${label} opened. Select the device on the other side of the reported fault.` } };
      }

      const hint = phase.hints[edge.id] ?? phase.defaultHint;
      return {
        ...next,
        isolation: { ...next.isolation, notes: [...next.isolation.notes, hint] },
        notice: { tone: "caution", text: hint },
      };
    }

    case "RESTORE_NORMAL": {
      if (phase.type !== "restore") return state;
      if (phase.close.every((id) => state.devices[id] === "closed")) return state;
      const devices = { ...state.devices };
      for (const id of phase.close) devices[id] = "closed";
      const energized = computeEnergization(scenario, devices, state.faultedEdges);
      if (energized.energizedFaults.length) {
        return { ...state, notice: { tone: "caution", text: "That would re-energize the faulted section. Isolation is not complete." } };
      }
      let next: LabState = { ...state, devices };
      const labels = phase.close.map((id) => scenario.topology.edges.find((e) => e.id === id)?.label ?? id).join(", ");
      next = log(scenario, next, { type: "deviceOperated", ref: phase.close.join(","), detail: `${labels} closed`, at: action.now, lane: "device" });
      const out = customersInterrupted(scenario, energized, state.faultedEdges);
      next = log(scenario, next, {
        type: "normalSourceRestored",
        detail: `${out.toLocaleString("en-US")} customers remain interrupted`,
        at: action.now,
        lane: "outcome",
      });
      return { ...next, notice: { tone: "ok", text: phase.successText } };
    }

    case "INSPECT": {
      if (phase.type !== "decide" || state.submitted) return state;
      const seen = state.inspected[action.optionId] ?? [];
      if (seen.includes(action.category)) return state;
      const option = allOptions(scenario).find((o) => o.id === action.optionId);
      const item = option?.inspection.find((i) => i.category === action.category);
      if (!option || !item) return state;
      const next = { ...state, inspected: { ...state.inspected, [action.optionId]: [...seen, action.category] } };
      return log(scenario, next, {
        type: "tieDetailsViewed",
        ref: `${option.id}:${item.category}`,
        detail: `${option.label} · ${item.label}`,
        at: action.now,
        lane: "info",
      });
    }

    case "CHOOSE_OPTION": {
      if (phase.type !== "decide" || state.submitted) return state;
      if (state.draft.optionId === action.optionId) return state;
      const option = allOptions(scenario).find((o) => o.id === action.optionId);
      if (!option) return state;
      const changed = Boolean(state.draft.optionId);
      let next: LabState = {
        ...state,
        draft: { ...state.draft, optionId: action.optionId },
        changedDecisionCount: state.changedDecisionCount + (changed ? 1 : 0),
      };
      if (changed) {
        const prev = allOptions(scenario).find((o) => o.id === state.draft.optionId);
        next = log(scenario, next, {
          type: "changedDecision",
          ref: option.id,
          detail: `${prev?.label ?? "Previous"} → ${option.label}`,
          at: action.now,
          lane: "decision",
        });
      } else {
        next = log(scenario, next, { type: "selectedTie", ref: option.id, detail: option.label, at: action.now, lane: "decision" });
      }
      return next;
    }

    case "SET_REASONS":
      if (state.submitted) return state;
      return { ...state, draft: { ...state.draft, reasonIds: action.reasonIds } };

    case "SET_TEXT":
      if (state.submitted) return state;
      return { ...state, draft: { ...state.draft, text: action.text.slice(0, 280) } };

    case "SUBMIT_DECISION": {
      if (phase.type !== "decide" || state.submitted) return state;
      const { optionId, reasonIds, text } = state.draft;
      if (!optionId || reasonIds.length === 0) return state;
      const dp = getDecisionPoint(scenario, phase.decisionPointId);
      const option = dp.options.find((o) => o.id === optionId)!;
      const reasons = reasonIds.map((r) => dp.reasons.find((x) => x.id === r)?.label ?? r);
      let next: LabState = {
        ...state,
        submitted: {
          optionId,
          reasonIds,
          text: text.trim(),
          at: action.now,
          timeToDecisionMs: action.now - (state.decisionPhaseEnteredAt ?? state.startedAt ?? action.now),
        },
      };
      next = log(scenario, next, {
        type: "decisionReason",
        ref: reasonIds.join(","),
        detail: reasons.join("; ") + (text.trim() ? ` — "${text.trim()}"` : ""),
        at: action.now,
        lane: "decision",
      });
      // Execute: close the selected tie
      next = { ...next, devices: { ...next.devices, [option.deviceId]: "closed" }, consequenceId: option.consequenceId };
      next = log(scenario, next, {
        type: "decisionSubmitted",
        ref: option.id,
        detail: `${option.label} closed`,
        at: action.now,
        lane: "decision",
      });
      const consequence = getConsequence(scenario, option.consequenceId);
      next = log(scenario, next, {
        type: "consequenceShown",
        ref: consequence?.id,
        detail: consequence?.resultLabel,
        at: action.now,
        lane: "outcome",
      });
      return enterPhase(scenario, next, next.phaseIndex + 1, action.now);
    }

    case "ANSWER_DEBRIEF": {
      const text = action.text.trim().slice(0, 600);
      if (!text) return state;
      const next = { ...state, debriefAnswer: text };
      return log(scenario, next, { type: "debriefAnswered", detail: text, at: action.now, lane: "info" });
    }

    case "COMPLETE": {
      if (state.completed) return state;
      const next = { ...state, completed: true };
      return log(scenario, next, { type: "scenarioCompleted", at: action.now, lane: "system" });
    }
  }
}

// ---------------------------------------------------------------------------
// Derived views
// ---------------------------------------------------------------------------

export function evaluatePredicate(scenario: Scenario, state: LabState, p: EvidencePredicate): boolean {
  const options = allOptions(scenario);
  const inspected = (optId: string) => state.inspected[optId] ?? [];
  switch (p.kind) {
    case "inspectedCategoryForAll":
      return options.every((o) => inspected(o.id).includes(p.category));
    case "inspectedCategoryForNone":
      return options.every((o) => !inspected(o.id).includes(p.category));
    case "inspectedAnyForOption":
      return inspected(p.optionId).length > 0;
    case "inspectedAllOptions":
      return options.every((o) => inspected(o.id).length > 0);
    case "selectedOption":
      return Boolean(state.submitted && p.optionIds.includes(state.submitted.optionId));
    case "outcome":
      return getConsequence(scenario, state.consequenceId)?.outcome === p.outcome;
    case "viewedInfo": {
      const hits = p.infoIds.filter((id) => state.viewedInfo.includes(id)).length;
      return p.mode === "all" ? hits === p.infoIds.length : p.mode === "any" ? hits > 0 : hits === 0;
    }
    case "isolationFirstTry": {
      const iso = scenario.phases.find((ph) => ph.type === "isolate");
      if (!iso || iso.type !== "isolate") return false;
      const firstTry = state.isolation.attempts.slice(0, iso.requiredOpen.length).every((a) => iso.requiredOpen.includes(a));
      return firstTry === p.value;
    }
    case "reasonIncludes":
      return Boolean(state.submitted?.reasonIds.some((r) => p.reasonIds.includes(r)));
    case "changedDecision":
      return state.changedDecisionCount > 0 === p.value;
    case "not":
      return !evaluatePredicate(scenario, state, p.predicate);
    case "and":
      return p.predicates.every((x) => evaluatePredicate(scenario, state, x));
  }
}

export function competencyEvidence(scenario: Scenario, state: LabState) {
  return scenario.competencies.map((c) => ({
    competency: c.competency,
    observations: c.rules.filter((r) => evaluatePredicate(scenario, state, r.when)).map((r) => ({ text: r.text, tone: r.tone })),
  }));
}

/** Every inspectable detail in the scenario, flagged viewed/not viewed. */
export function inspectionCoverage(scenario: Scenario, state: LabState) {
  const infoRows = scenario.information.map((i) => ({
    id: i.id,
    label: i.title,
    group: "Initial assessment",
    viewed: state.viewedInfo.includes(i.id),
  }));
  const optionRows = allOptions(scenario).flatMap((o) =>
    o.inspection.map((it) => ({
      id: `${o.id}:${it.category}`,
      label: `${o.label} · ${it.label}`,
      group: o.label,
      viewed: (state.inspected[o.id] ?? []).includes(it.category),
    })),
  );
  return [...infoRows, ...optionRows];
}

export function formatSimClock(start: string, simSeconds: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 3600 + m * 60 + simSeconds;
  const hh = Math.floor(total / 3600) % 24;
  const mm = Math.floor((total % 3600) / 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export interface ReplayRow {
  seq: number;
  time: string;
  label: string;
  detail?: string;
  lane: NonNullable<LogEntry["lane"]>;
}

/** Replay built strictly from the learner's own log. */
export function buildReplay(scenario: Scenario, state: LabState): ReplayRow[] {
  return state.log
    .filter((e) => scenario.replayLabels[e.type] !== undefined)
    .map((e) => ({
      seq: e.seq,
      time: formatSimClock(scenario.clock.start, e.sim),
      label: (scenario.replayLabels[e.type] ?? e.type).replace("{detail}", e.detail ?? ""),
      detail: e.detail,
      lane: e.lane ?? "system",
    }));
}

/** The learner's current objective, from the active phase. Presentation only. */
export function objectiveForPhase(scenario: Scenario, state: LabState): string | undefined {
  return currentPhase(scenario, state).objective;
}

export interface SystemChangeRow {
  seq: number;
  time: string;
  label: string;
  detail?: string;
  lane: NonNullable<LogEntry["lane"]>;
}

/**
 * Compact, in-scenario "System Changes" feed: the operations and outcomes the learner
 * has caused, newest first. Built strictly from the engine log — never fabricated.
 * Distinct from buildReplay (the full debrief timeline).
 */
export function systemChanges(scenario: Scenario, state: LabState): SystemChangeRow[] {
  const labels: Partial<Record<LogType, string>> = {
    deviceOperated: "{detail}",
    faultIsolated: "Fault section isolated · {detail}",
    normalSourceRestored: "Restored from normal source · {detail}",
    decisionSubmitted: "Restoration path executed · {detail}",
    consequenceShown: "Result · {detail}",
    scenarioStarted: "{detail}",
  };
  return state.log
    .filter((e) => labels[e.type] !== undefined)
    .map((e) => ({
      seq: e.seq,
      time: formatSimClock(scenario.clock.start, e.sim),
      label: (labels[e.type] ?? e.type).replace("{detail}", e.detail ?? ""),
      detail: e.detail,
      lane: e.lane ?? "system",
    }))
    .reverse();
}

/**
 * Seq of the most recent meaningful electrical change (a device operation or an outcome).
 * The UI uses this to trigger change-focus and before/current snapshots. Info views and
 * selections do not advance it. 0 when nothing has changed yet.
 */
export function meaningfulChangeSeq(state: LabState): number {
  for (let i = state.log.length - 1; i >= 0; i--) {
    const e = state.log[i];
    if (e.lane === "device" || e.lane === "outcome") return e.seq;
  }
  return 0;
}

/** The device ids operated by the most recent device operation (for change-focus). */
export function lastChangedDevices(state: LabState): string[] {
  for (let i = state.log.length - 1; i >= 0; i--) {
    if (state.log[i].type === "deviceOperated") return (state.log[i].ref ?? "").split(",").filter(Boolean);
  }
  return [];
}

export function liveSystemView(scenario: Scenario, state: LabState) {
  const energization = computeEnergization(scenario, state.devices, state.faultedEdges);
  const out = state.started || state.phaseIndex > 0
    ? customersInterrupted(scenario, energization, state.faultedEdges)
    : 0;
  return { energization, customersInterrupted: out };
}
