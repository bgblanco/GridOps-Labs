/**
 * Analytics event names. These are decoupled from the UI and from the engine:
 * the engine writes a log, and src/lib/analytics/observe.ts maps new log entries
 * to these names. Forms call track() directly for their own events.
 */
export type AnalyticsEventName =
  | "scenarioStarted"
  | "informationViewed"
  | "faultIsolationSelections"
  | "deviceSelected"
  | "tieDetailsViewed"
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
