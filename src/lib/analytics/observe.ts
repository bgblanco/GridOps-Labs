import type { LogEntry } from "../scenario/engine";
import type { AnalyticsEventName } from "./events";
import { track } from "./tracker";

/** Maps engine log entries to analytics events. */
const map: Partial<Record<LogEntry["type"], AnalyticsEventName>> = {
  scenarioStarted: "scenarioStarted",
  informationViewed: "informationViewed",
  deviceSelected: "deviceSelected",
  faultIsolated: "faultIsolationSelections",
  tieDetailsViewed: "tieDetailsViewed",
  selectedTie: "selectedTie",
  changedDecision: "changedDecision",
  decisionReason: "decisionReason",
  decisionSubmitted: "decisionTimestamp",
  debriefAnswered: "completedDebrief",
  scenarioCompleted: "scenarioCompleted",
};

export function trackLogEntries(entries: LogEntry[], scenarioId: string) {
  for (const e of entries) {
    const name = map[e.type];
    if (!name) continue;
    track(name, { ref: e.ref, phase: e.phaseId, sim: e.sim }, scenarioId);
  }
}
