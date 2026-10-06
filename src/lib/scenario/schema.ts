/**
 * GridOps Decision Lab scenario schema.
 *
 * A scenario is pure data. The engine (./engine.ts) interprets it and the UI
 * (src/components/lab) renders it. A scenario designer should be able to write
 * DL-002 by authoring a new file in src/lib/scenarios without touching either.
 *
 * See docs/scenario-schema.md for the human-readable reference.
 */

/** Information quality model used across every Decision Lab. */
export type InfoQuality = "KNOWN" | "INDICATED" | "REPORTED" | "INFERRED" | "ASSUMED";

export const SME_VALIDATION_REQUIRED = "SME_VALIDATION_REQUIRED" as const;

/**
 * Marks a value or behavior that must be reviewed by a distribution
 * operations / engineering SME before public release. Every one of these is
 * listed in docs/technical-validation.md.
 */
export interface SmeValidation {
  status: typeof SME_VALIDATION_REQUIRED;
  /** Stable id, referenced from docs/technical-validation.md */
  id: string;
  note: string;
}

export const sme = (id: string, note: string): SmeValidation => ({
  status: SME_VALIDATION_REQUIRED,
  id,
  note,
});

/** Visual training levels. DL-001 uses "training". */
export type ViewLevel = "training" | "operating" | "advanced";

export type CompetencyId =
  | "SYSTEM_AWARENESS"
  | "ELECTRICAL_AWARENESS"
  | "INFORMATION_AWARENESS"
  | "OPERATIONAL_JUDGMENT"
  | "EXECUTION_DISCIPLINE"
  | "WORKLOAD_PRIORITIZATION";

// ---------------------------------------------------------------------------
// Topology
// ---------------------------------------------------------------------------

export type NodeKind = "source" | "junction" | "end";

export interface TopologyNode {
  id: string;
  kind: NodeKind;
  /** Canvas coordinates inside topology.viewBox */
  x: number;
  y: number;
  label?: string;
  sublabel?: string;
  /** Where to place the label relative to the node */
  labelAt?: "left" | "right" | "above" | "below";
}

export type EdgeKind = "line" | "breaker" | "switch" | "tie";
export type DeviceState = "open" | "closed";

export interface TopologyEdge {
  id: string;
  kind: EdgeKind;
  from: string;
  to: string;
  /** Feeder this edge normally belongs to, e.g. "F120" */
  feeder: string;
  /** Display id shown on the one-line (device id or section name) */
  label?: string;
  /** Friendly training label shown dominant in training view; the asset id stays in `label`. */
  trainingLabel?: string;
  /** Short caption under the label */
  caption?: string;
  labelAt?: "above" | "below" | "left" | "right";
  /** Normal (shelf) state for devices. Lines are always conducting. */
  normal?: DeviceState;
  /** Visible to the learner on the one-line? Hidden edges still conduct. */
  hidden?: boolean;
  /** Name of a highlight group, e.g. a limiting segment revealed by inspection */
  highlightGroup?: string;
  /** Restoration-path membership. An edge can sit on more than one tie's source→load path. */
  pathGroups?: string[];
}

export interface LoadBlock {
  id: string;
  /** Line edge the load is served from */
  edgeId: string;
  customers: number;
  label: string;
  /** Offset for the load marker along the edge (0..1) */
  at?: number;
  side?: "above" | "below";
}

export interface Topology {
  viewBox: { width: number; height: number };
  /** Keep early views simple: hide a feeder until the named phase */
  revealFeeders?: { feeder: string; atPhase: string }[];
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  loads: LoadBlock[];
}

// ---------------------------------------------------------------------------
// Information
// ---------------------------------------------------------------------------

export interface InformationItem {
  id: string;
  /** Category shown to learner, e.g. "Breaker state" */
  title: string;
  quality: InfoQuality;
  /** Who or what the information comes from */
  source: string;
  body: string;
  /** Optional short value, shown large */
  value?: string;
  validation?: SmeValidation;
}

export interface FieldReport {
  id: string;
  from: string;
  channel: string;
  quality: InfoQuality;
  message: string;
  note?: string;
}

export interface Alarm {
  id: string;
  quality: InfoQuality;
  severity: "caution" | "limit";
  text: string;
  deviceId?: string;
  validation?: SmeValidation;
}

// ---------------------------------------------------------------------------
// Decisions
// ---------------------------------------------------------------------------

export interface InspectionItem {
  /** Category id. Shared across options so the engine can ask
   *  "did they inspect the path category for every option?" */
  category: string;
  label: string;
  value: string;
  detail?: string;
  quality: InfoQuality;
  /** Rendered with emphasis when the learner opens it */
  flag?: "limit" | "caution";
  /** Highlight group to light up on the one-line while open */
  highlightGroup?: string;
  validation?: SmeValidation;
}

export interface DecisionOption {
  id: string;
  label: string;
  /** Friendly training label shown dominant in training view; the tie id stays in `deviceId`. */
  trainingLabel?: string;
  /** Restoration path group to light up on the one-line while this option is inspected. */
  pathGroup?: string;
  /** Device the engine closes when this option is executed */
  deviceId: string;
  /** One-line summary visible before inspection */
  summary: string;
  /** Surface-level cues visible before inspection (make the trap attractive) */
  cues: string[];
  inspection: InspectionItem[];
  consequenceId: string;
}

export interface ReasonOption {
  id: string;
  label: string;
}

export interface DecisionPoint {
  id: string;
  prompt: string;
  /** Short framing under the prompt */
  context?: string;
  reasonPrompt: string;
  options: DecisionOption[];
  reasons: ReasonOption[];
  allowFreeText: boolean;
}

export interface Consequence {
  id: string;
  /** Neutral outcome class. Never rendered as "correct"/"incorrect". */
  outcome: "suitable" | "limited";
  /** Short result label used in debrief */
  resultLabel: string;
  headline: string;
  /** Narrative steps shown in order while the decision executes */
  sequence: string[];
  alarms: Alarm[];
  explanation: string[];
  /** Highlight groups to mark on the one-line after execution */
  highlightGroups?: string[];
  /** Customers restored by the executed action */
  customersRestored: number;
  validation?: SmeValidation;
}

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

interface PhaseBase {
  id: string;
  /** Short name used in the progress rail */
  step: string;
  /** Short "what am I trying to accomplish right now" line, shown as Current Objective. */
  objective?: string;
}

export interface EventPhase extends PhaseBase {
  type: "event";
  headline: string;
  lines: string[];
  /** Shown after the lockout animation */
  afterText: string;
}

export interface ReviewPhase extends PhaseBase {
  type: "review";
  prompt: string;
  infoIds: string[];
  /** Views needed before Continue enables */
  minViews: number;
}

export interface ReportPhase extends PhaseBase {
  type: "report";
  reportId: string;
  prompt: string;
}

export interface IsolatePhase extends PhaseBase {
  type: "isolate";
  prompt: string;
  /** Devices the learner must open to isolate the fault */
  helpText?: string;
  requiredOpen: string[];
  /** Feedback when a learner selects a device that isn't part of the isolation */
  hints: Record<string, string>;
  defaultHint: string;
  successText: string;
}

export interface RestorePhase extends PhaseBase {
  type: "restore";
  prompt: string;
  close: string[];
  actionLabel: string;
  successText: string;
  /** Shown after restoration succeeds */
  afterText?: string;
}

export interface DecidePhase extends PhaseBase {
  type: "decide";
  decisionPointId: string;
}

export interface ConsequencePhase extends PhaseBase {
  type: "consequence";
}

export interface DebriefPhase extends PhaseBase {
  type: "debrief";
}

export type Phase =
  | EventPhase
  | ReviewPhase
  | ReportPhase
  | IsolatePhase
  | RestorePhase
  | DecidePhase
  | ConsequencePhase
  | DebriefPhase;

// ---------------------------------------------------------------------------
// Evidence rules (behavior-based, no scores)
// ---------------------------------------------------------------------------

export type EvidencePredicate =
  | { kind: "inspectedCategoryForAll"; category: string }
  | { kind: "inspectedCategoryForNone"; category: string }
  | { kind: "inspectedAnyForOption"; optionId: string }
  | { kind: "inspectedAllOptions" }
  | { kind: "selectedOption"; optionIds: string[] }
  | { kind: "outcome"; outcome: Consequence["outcome"] }
  | { kind: "viewedInfo"; infoIds: string[]; mode: "all" | "any" | "none" }
  | { kind: "isolationFirstTry"; value: boolean }
  | { kind: "reasonIncludes"; reasonIds: string[] }
  | { kind: "changedDecision"; value: boolean }
  | { kind: "not"; predicate: EvidencePredicate }
  | { kind: "and"; predicates: EvidencePredicate[] };

export interface EvidenceRule {
  when: EvidencePredicate;
  text: string;
  /** "strength" = behavior worth repeating, "gap" = something to look at next time */
  tone: "strength" | "gap" | "neutral";
}

export interface CompetencyEvidenceConfig {
  competency: CompetencyId;
  rules: EvidenceRule[];
}

// ---------------------------------------------------------------------------
// Replay / clock
// ---------------------------------------------------------------------------

/** Simulated seconds each learner action advances the scenario clock. */
export interface ClockConfig {
  /** Scenario start, "HH:MM" 24h */
  start: string;
  costs: Partial<Record<LogType, number>>;
}

export type LogType =
  | "scenarioStarted"
  | "phaseEntered"
  | "informationViewed"
  | "fieldReportReceived"
  | "deviceSelected"
  | "deviceOperated"
  | "faultIsolated"
  | "normalSourceRestored"
  | "tieDetailsViewed"
  | "selectedTie"
  | "changedDecision"
  | "decisionReason"
  | "decisionSubmitted"
  | "consequenceShown"
  | "debriefAnswered"
  | "scenarioCompleted";

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

export interface ScenarioMetadata {
  id: string;            // "DL-001"
  slug: string;          // "dl-001"
  series: string;        // "GridOps Field Test"
  title: string;         // "The Easy Tie"
  status: "public-beta" | "in-development" | "draft";
  estimatedMinutes: [number, number];
  principle: string;
  principleDetail: string;
  summary: string;
  viewLevel: ViewLevel;
  competencies: CompetencyId[];
  /** Which judgment element(s) justify this lab (quality rule) */
  judgmentElements: string[];
}

export interface ScenarioEnvironment {
  utility: string;       // "Summit Electric"
  grid: string;          // "Summit Grid"
  fictional: true;
  /** Label for the status strip, e.g. "Feeder 120" */
  primaryFeeder: string;
  disclaimer: string;
  /** Scene-setting hero image for the event intro (public/ path). */
  heroImage?: string;
  heroImageAlt?: string;
}

export interface ScenarioInitialState {
  devices: Record<string, DeviceState>;
  faultedEdges: string[];
  /** Customers interrupted as the learner first sees the event */
  customersInterrupted: number;
  alarms: Alarm[];
}

export interface DebriefConfig {
  principle: string;
  principleDetail: string;
  reflectionPrompt: string;
  /** Short notes the debrief can show about what the lab does not model */
  scopeNotes: string[];
  /** Label each info/inspection id for the "inspected / not inspected" lists */
  inspectableLabels?: Record<string, string>;
}

export interface Scenario {
  metadata: ScenarioMetadata;
  environment: ScenarioEnvironment;
  topology: Topology;
  initialState: ScenarioInitialState;
  information: InformationItem[];
  reports: FieldReport[];
  phases: Phase[];
  decisionPoints: DecisionPoint[];
  consequences: Consequence[];
  competencies: CompetencyEvidenceConfig[];
  debrief: DebriefConfig;
  clock: ClockConfig;
  /** Replay labels per log type; {label} and {detail} tokens are filled in */
  replayLabels: Partial<Record<LogType, string>>;
  feedback: { scenarioQuestions: string[] };
}
