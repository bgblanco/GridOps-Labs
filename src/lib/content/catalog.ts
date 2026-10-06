import type { CompetencyId } from "../scenario/schema";

/**
 * GridOps scenario catalog — the curriculum metadata layer.
 *
 * This is deliberately separate from the playable `Scenario` data model
 * (src/lib/scenarios). The catalog describes the whole planned curriculum (dozens
 * of Decision Labs across eight operational domains) for browsing and planning.
 * A catalog entry only becomes playable when `status === "available"` and its
 * `slug` resolves to an authored scenario in src/lib/scenarios.
 *
 * Nothing here claims a planned scenario is complete. Status is the single source
 * of truth the UI uses to decide whether to offer "Try lab".
 */

export type DomainId =
  | "restoration"
  | "scada"
  | "field"
  | "alarms"
  | "loading"
  | "protection"
  | "workload"
  | "judgment";

export type Difficulty = "foundational" | "operational" | "advanced";

/** available = playable now · in-development = being built · planned = on the roadmap */
export type LabStatus = "available" | "in-development" | "planned";

export interface CatalogDomain {
  id: DomainId;
  name: string;
  /** Short chip label */
  short: string;
  blurb: string;
}

export const DOMAINS: CatalogDomain[] = [
  { id: "restoration", name: "Restoration & Switching", short: "Restoration", blurb: "Isolation, sectionalizing, alternate-source restoration, and returning to normal." },
  { id: "scada", name: "SCADA & Telecommunications", short: "SCADA & Telecom", blurb: "Stale indications, telemetry loss, failed control, and SCADA-vs-field disagreement." },
  { id: "field", name: "Field Communication & Coordination", short: "Field Coordination", blurb: "Conflicting or incomplete reports, device identification, and crew coordination." },
  { id: "alarms", name: "Alarm Management & Situational Awareness", short: "Alarms", blurb: "Alarm storms, buried critical alarms, and recognizing system-wide patterns." },
  { id: "loading", name: "Loading & System Configuration", short: "Loading", blurb: "Post-transfer loading, equipment limits, and electrically possible but operationally poor moves." },
  { id: "protection", name: "Protection & Abnormal Conditions", short: "Protection", blurb: "Lockouts, relay targets, recloser behavior, and protection that changes the plan." },
  { id: "workload", name: "Concurrent Events & Workload", short: "Workload", blurb: "Simultaneous events, competing priorities, interruptions, and triage." },
  { id: "judgment", name: "Information Quality & Operational Judgment", short: "Judgment", blurb: "Missing or conflicting information, uncertainty, and when not to operate." },
];

export const DOMAIN_LABEL: Record<DomainId, string> = Object.fromEntries(DOMAINS.map((d) => [d.id, d.name])) as Record<DomainId, string>;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  operational: "Operational",
  advanced: "Advanced",
};

export const DIFFICULTY_BLURB: Record<Difficulty, string> = {
  foundational: "One dominant problem, limited information, a clear objective.",
  operational: "Interacting variables, incomplete information, more than one reasonable option.",
  advanced: "Conflicting information, multiple events, competing priorities, no perfect option.",
};

export const STATUS_LABEL: Record<LabStatus, string> = {
  available: "Available",
  "in-development": "In development",
  planned: "Planned",
};

export interface CatalogScenario {
  id: string; // "DL-001"
  title: string;
  domain: DomainId;
  difficulty: Difficulty;
  status: LabStatus;
  summary: string;
  competencies: CompetencyId[];
  /** Set only when status === "available"; links to /labs/{slug}. */
  slug?: string;
  featured?: boolean;
  /** Story-layer concept art (public/ path). Scene-setting only. */
  image?: string;
  imageAlt?: string;
}

// Competency shortcuts, to keep the table readable.
const SYS: CompetencyId = "SYSTEM_AWARENESS";
const ELE: CompetencyId = "ELECTRICAL_AWARENESS";
const INF: CompetencyId = "INFORMATION_AWARENESS";
const JUD: CompetencyId = "OPERATIONAL_JUDGMENT";
const EXE: CompetencyId = "EXECUTION_DISCIPLINE";
const WRK: CompetencyId = "WORKLOAD_PRIORITIZATION";

/**
 * The seeded curriculum: 64 scenarios across eight domains. One is playable today
 * (DL-001); the rest are in development or planned. Titles and premises are the
 * roadmap, not a claim of completion.
 */
export const catalog: CatalogScenario[] = [
  // 1 — Restoration & Switching (10)
  { id: "DL-001", slug: "dl-001", title: "The Easy Tie", domain: "restoration", difficulty: "operational", status: "available", featured: true, summary: "A feeder locks out. The closest tie is available — but available is not the same as suitable.", competencies: [SYS, ELE, INF, JUD] },
  { id: "DL-002", title: "The Backfeed Question", domain: "restoration", difficulty: "operational", status: "planned", summary: "A customer generator backfeeds the line through an optional interlock. Assume energized until proven dead.", competencies: [SYS, ELE], image: "/scenarios/backfeed.jpg", imageAlt: "Pixel illustration: a lineworker tests for backfeed from a customer's generator during a storm." },
  { id: "DL-003", title: "One More Section", domain: "restoration", difficulty: "foundational", status: "planned", summary: "Pick up customers section by section without over-reaching the source.", competencies: [SYS, JUD] },
  { id: "DL-004", title: "Restore Now or Verify First", domain: "restoration", difficulty: "operational", status: "in-development", summary: "Customers are out and a quick close is tempting — before the field confirms.", competencies: [JUD, INF, EXE] },
  { id: "DL-005", title: "The Alternate Path", domain: "restoration", difficulty: "operational", status: "planned", summary: "Two ties can restore the load. The path, not the tie, decides it.", competencies: [ELE, JUD] },
  { id: "DL-006", title: "Normal Is Not Restored", domain: "restoration", difficulty: "operational", status: "in-development", summary: "Customers are back on, but the system is still in an abnormal configuration.", competencies: [SYS, JUD] },
  { id: "DL-007", title: "Parallel for a Moment", domain: "restoration", difficulty: "advanced", status: "planned", summary: "Closing a normally-open tie parallels two feeders. You saw a tie; the grid saw a parallel.", competencies: [ELE, EXE], image: "/scenarios/parallel.jpg", imageAlt: "Pixel illustration: a normally-open tie between two feeders, about to be closed into a parallel." },
  { id: "DL-008", title: "The Last Customer Block", domain: "restoration", difficulty: "foundational", status: "planned", summary: "The final isolated block can only come back after a repair. Sequence the rest.", competencies: [SYS, JUD] },
  { id: "DL-009", title: "Return to Normal", domain: "restoration", difficulty: "operational", status: "planned", summary: "The repair is done. Restore the normal configuration without a second interruption.", competencies: [SYS, EXE] },
  { id: "DL-010", title: "The Unexpected Bottleneck", domain: "restoration", difficulty: "advanced", status: "planned", summary: "The obvious restoration overloads a segment no one was watching.", competencies: [ELE, SYS, JUD] },

  // 2 — SCADA & Telecommunications (8)
  { id: "DL-011", title: "Frozen in Time", domain: "scada", difficulty: "operational", status: "planned", summary: "An analog hasn't moved in an hour. Is the system steady, or is the point stale?", competencies: [INF, SYS] },
  { id: "DL-012", title: "Control Failed", domain: "scada", difficulty: "operational", status: "planned", summary: "A remote open didn't take. Decide the next move with the device state uncertain.", competencies: [INF, EXE] },
  { id: "DL-013", title: "The Quiet RTU", domain: "scada", difficulty: "foundational", status: "planned", summary: "An RTU drops off. What can you still trust downstream of it?", competencies: [INF, SYS] },
  { id: "DL-014", title: "Closed on the Screen", domain: "scada", difficulty: "operational", status: "in-development", summary: "SCADA says the switch is open; the field says closed. Status is not the same as state.", competencies: [INF, SYS, JUD], image: "/scenarios/status-vs-state.jpg", imageAlt: "Pixel illustration: SCADA shows a switch open while the field switch reads closed." },
  { id: "DL-015", title: "Partial Visibility", domain: "scada", difficulty: "operational", status: "planned", summary: "Half the feeder's points are reporting. Act, or wait for the rest?", competencies: [INF, JUD] },
  { id: "DL-016", title: "The Missing Analog", domain: "scada", difficulty: "foundational", status: "planned", summary: "The loading value you need isn't there. Infer it, or get it another way.", competencies: [INF, ELE] },
  { id: "DL-017", title: "Communications Lost", domain: "scada", difficulty: "advanced", status: "planned", summary: "A regional comms outage removes both visibility and control at once.", competencies: [INF, SYS, WRK] },
  { id: "DL-018", title: "Status Without Control", domain: "scada", difficulty: "operational", status: "planned", summary: "You can see the device but can't operate it remotely. Plan around it.", competencies: [INF, EXE] },

  // 3 — Field Communication & Coordination (8)
  { id: "DL-019", title: "“It's Open”", domain: "field", difficulty: "foundational", status: "planned", summary: "A one-word report. Open where, and confirmed how?", competencies: [INF, EXE] },
  { id: "DL-020", title: "Wrong Device, Right Number", domain: "field", difficulty: "operational", status: "planned", summary: "The device number matches — on a different feeder.", competencies: [EXE, SYS] },
  { id: "DL-021", title: "Patrol Complete", domain: "field", difficulty: "foundational", status: "planned", summary: "“Patrol complete, nothing found” — on a line that still won't hold.", competencies: [INF, JUD] },
  { id: "DL-022", title: "Radio Cutout", domain: "field", difficulty: "operational", status: "planned", summary: "A switching instruction is half-heard. Confirm before anyone acts.", competencies: [EXE, INF] },
  { id: "DL-023", title: "Conflicting Reports", domain: "field", difficulty: "operational", status: "planned", summary: "Two crews describe the same device two different ways.", competencies: [INF, JUD] },
  { id: "DL-024", title: "The Crew Handoff", domain: "field", difficulty: "operational", status: "planned", summary: "A new crew takes over mid-event. What did the last crew actually leave open?", competencies: [EXE, SYS] },
  { id: "DL-025", title: "Which Switch?", domain: "field", difficulty: "foundational", status: "planned", summary: "Two switches share a pole and nearly share a name.", competencies: [EXE, INF] },
  { id: "DL-026", title: "Confirm Before Acting", domain: "field", difficulty: "operational", status: "planned", summary: "The plan is sound; the device state it rests on is unconfirmed.", competencies: [EXE, JUD] },

  // 4 — Alarm Management & Situational Awareness (8)
  { id: "DL-027", title: "First Alarm Isn't the Cause", domain: "alarms", difficulty: "operational", status: "planned", summary: "The first alarm to land is rarely the first thing that happened.", competencies: [SYS, JUD] },
  { id: "DL-028", title: "47 Alarms", domain: "alarms", difficulty: "advanced", status: "planned", summary: "An alarm storm hits — hundreds active. Find the one that actually matters.", competencies: [WRK, SYS], image: "/scenarios/alarm-storm.jpg", imageAlt: "Pixel illustration: a control room facing hundreds of active alarms during a storm, one critical alarm highlighted." },
  { id: "DL-029", title: "One Alarm in the Noise", domain: "alarms", difficulty: "operational", status: "planned", summary: "A single critical alarm is buried among nuisance alarms.", competencies: [WRK, SYS] },
  { id: "DL-030", title: "Clear Doesn't Mean Normal", domain: "alarms", difficulty: "foundational", status: "planned", summary: "The alarms cleared. The system is still not in a normal state.", competencies: [SYS, JUD] },
  { id: "DL-031", title: "Two Feeders, One Minute", domain: "alarms", difficulty: "advanced", status: "planned", summary: "Two feeder events arrive almost together. Which gets attention first?", competencies: [WRK, JUD] },
  { id: "DL-032", title: "The Repeating Alarm", domain: "alarms", difficulty: "operational", status: "planned", summary: "The same alarm keeps re-arming. Signal, or distraction?", competencies: [SYS, WRK] },
  { id: "DL-033", title: "Event Before Alarm", domain: "alarms", difficulty: "operational", status: "planned", summary: "A customer call precedes the telemetry. Trust it yet?", competencies: [INF, JUD] },
  { id: "DL-034", title: "What Changed First?", domain: "alarms", difficulty: "advanced", status: "planned", summary: "Reconstruct the sequence to find the root, not the symptom.", competencies: [SYS, INF] },

  // 5 — Loading & System Configuration (8)
  { id: "DL-035", title: "Ninety-Four Percent", domain: "loading", difficulty: "operational", status: "planned", summary: "A transfer lands a feeder at 94% of rating. Acceptable, or too close?", competencies: [ELE, JUD] },
  { id: "DL-036", title: "The Hidden Bottleneck", domain: "loading", difficulty: "operational", status: "planned", summary: "The breaker has room; a mid-line segment does not.", competencies: [ELE, SYS] },
  { id: "DL-037", title: "After the Transfer", domain: "loading", difficulty: "operational", status: "planned", summary: "Load rises after a transfer that was fine at the time.", competencies: [ELE, JUD] },
  { id: "DL-038", title: "Load Keeps Rising", domain: "loading", difficulty: "operational", status: "planned", summary: "The evening climb pushes an abnormal configuration toward its limit.", competencies: [ELE, WRK] },
  { id: "DL-039", title: "Alternate Source Limit", domain: "loading", difficulty: "operational", status: "planned", summary: "The alternate source can reach the load but not carry all of it.", competencies: [ELE, JUD] },
  { id: "DL-040", title: "The Regulator Problem", domain: "loading", difficulty: "advanced", status: "planned", summary: "A transfer changes what a voltage regulator is being asked to do.", competencies: [ELE, SYS] },
  { id: "DL-041", title: "The Evening Peak", domain: "loading", difficulty: "foundational", status: "planned", summary: "A move that works at 2 a.m. may not work at 6 p.m.", competencies: [ELE, JUD] },
  { id: "DL-042", title: "Restored Isn't Normal", domain: "loading", difficulty: "operational", status: "in-development", summary: "Hours after a transfer, the temporary configuration is carrying more than planned.", competencies: [ELE, SYS, JUD] },

  // 6 — Protection & Abnormal Conditions (8)
  { id: "DL-043", title: "Locked Out Again", domain: "protection", difficulty: "operational", status: "planned", summary: "A feeder locks out a second time after a successful close.", competencies: [SYS, ELE] },
  { id: "DL-044", title: "The Relay Target", domain: "protection", difficulty: "operational", status: "planned", summary: "A relay target narrows — or misleads — the search for the fault.", competencies: [SYS, INF] },
  { id: "DL-045", title: "Ground or Sensitive Ground", domain: "protection", difficulty: "advanced", status: "planned", summary: "The protection indication points to a particular kind of fault.", competencies: [ELE, SYS] },
  { id: "DL-046", title: "The Recloser That Didn't", domain: "protection", difficulty: "operational", status: "planned", summary: "A recloser should have cycled. It didn't. What does that tell you?", competencies: [SYS, JUD] },
  { id: "DL-047", title: "Second Trip", domain: "protection", difficulty: "operational", status: "planned", summary: "The second trip changes the restoration plan.", competencies: [SYS, JUD] },
  { id: "DL-048", title: "Protection Changed the Plan", domain: "protection", difficulty: "advanced", status: "planned", summary: "A protection detail makes the obvious restoration the wrong one.", competencies: [ELE, JUD] },
  { id: "DL-049", title: "Fuse or Feeder?", domain: "protection", difficulty: "foundational", status: "planned", summary: "Is this a fused-lateral event or a feeder event? It drives everything.", competencies: [SYS, JUD] },
  { id: "DL-050", title: "Unexpected Operation", domain: "protection", difficulty: "operational", status: "planned", summary: "A device operated that no one expected to operate.", competencies: [SYS, INF] },

  // 7 — Concurrent Events & Workload (6)
  { id: "DL-051", title: "Two Calls at Once", domain: "workload", difficulty: "operational", status: "in-development", summary: "A second lockout lands while you're mid-restoration on the first.", competencies: [WRK, JUD] },
  { id: "DL-052", title: "Planned Work Meets an Outage", domain: "workload", difficulty: "operational", status: "planned", summary: "A clearance is in progress when an unrelated outage hits.", competencies: [WRK, EXE] },
  { id: "DL-053", title: "Three Crews Waiting", domain: "workload", difficulty: "operational", status: "planned", summary: "Three crews want actions at once. Order them well.", competencies: [WRK, EXE] },
  { id: "DL-054", title: "Shift Change", domain: "workload", difficulty: "foundational", status: "planned", summary: "Hand off an active event without losing state.", competencies: [WRK, EXE] },
  { id: "DL-055", title: "The Second Event", domain: "workload", difficulty: "advanced", status: "planned", summary: "A second event mid-inspection splits your attention.", competencies: [WRK, SYS] },
  { id: "DL-056", title: "One Desk, Too Much Information", domain: "workload", difficulty: "advanced", status: "planned", summary: "Everything is arriving at once. Triage before you act.", competencies: [WRK, JUD] },

  // 8 — Information Quality & Operational Judgment (8)
  { id: "DL-057", title: "The Case for Waiting", domain: "judgment", difficulty: "operational", status: "in-development", summary: "Every option restores customers. One piece of information hasn't come back yet.", competencies: [JUD, INF] },
  { id: "DL-058", title: "Known, Indicated, Reported", domain: "judgment", difficulty: "foundational", status: "planned", summary: "Sort what you know from what you've only been told.", competencies: [INF, SYS] },
  { id: "DL-059", title: "What Do We Actually Know?", domain: "judgment", difficulty: "operational", status: "planned", summary: "Separate established fact from inference before you act.", competencies: [INF, JUD] },
  { id: "DL-060", title: "The Missing Confirmation", domain: "judgment", difficulty: "operational", status: "planned", summary: "The plan rests on a confirmation that never came.", competencies: [INF, EXE] },
  { id: "DL-061", title: "Confidence Isn't Certainty", domain: "judgment", difficulty: "operational", status: "planned", summary: "A confident report is still a report, not a confirmation.", competencies: [INF, JUD] },
  { id: "DL-062", title: "When Not to Operate", domain: "judgment", difficulty: "advanced", status: "planned", summary: "The strongest move on the board is to hold.", competencies: [JUD, SYS] },
  { id: "DL-063", title: "Assumed Open", domain: "judgment", difficulty: "operational", status: "planned", summary: "A device treated as open was never confirmed open.", competencies: [INF, EXE] },
  { id: "DL-064", title: "Escalate or Continue", domain: "judgment", difficulty: "operational", status: "planned", summary: "Handle it at the desk, or escalate now?", competencies: [JUD, WRK] },
];

export const catalogCount = catalog.length;
export const availableCount = catalog.filter((s) => s.status === "available").length;

export const catalogByDomain = (id: DomainId) => catalog.filter((s) => s.domain === id);
export const getCatalogScenario = (id: string) => catalog.find((s) => s.id.toLowerCase() === id.toLowerCase());
