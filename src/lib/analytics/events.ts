/**
 * Analytics event names. These are decoupled from the UI and from the engine:
 * the engine writes a log, and src/lib/analytics/observe.ts maps new log entries
 * to these names. Forms and instructional interactions call track() directly.
 *
 * Instructional (UI-fired) events: tieInspectionOpened (a tie's path opened),
 * pathInspected (a path category viewed), beforeCurrentViewed (Before/Current compared).
 * No personal or utility-specific data is collected.
 */
export type AnalyticsEventName =
  | "scenarioStarted"
  | "informationViewed"
  | "faultIsolationSelections"
  | "deviceSelected"
  | "tieDetailsViewed"
  | "tieInspectionOpened"
  | "pathInspected"
  | "beforeCurrentViewed"
  | "selectedTie"
  | "decisionReason"
  | "decisionTimestamp"
  | "changedDecision"
  | "scenarioCompleted"
  | "completedDebrief"
  | "feedbackStarted"
  | "feedbackSubmitted"
  | "emailSubmitted"
  | "challengeAnswered"
  | "contactSubmitted";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  scenarioId?: string;
  /** Anonymous per-tab session id. No personal data. */
  sessionId: string;
  at: string;
  props?: Record<string, string | number | boolean | string[] | undefined>;
}
