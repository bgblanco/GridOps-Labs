import { sme, type Scenario } from "../scenario/schema";

/**
 * DL-001 — The Easy Tie
 *
 * EVERYTHING in this file is a FICTIONAL TRAINING VALUE for the fictional
 * Summit Grid. Device ids, feeder numbers, substation names, customer counts,
 * loading, ratings and consequences are illustrative and are not taken from
 * any real utility. Values that need SME review before public release are
 * marked with sme(...) → SME_VALIDATION_REQUIRED and listed in
 * docs/technical-validation.md.
 */

const TRANSFER_AMPS = 165;

export const dl001: Scenario = {
  metadata: {
    id: "DL-001",
    slug: "dl-001",
    series: "GridOps Field Test",
    title: "The Easy Tie",
    status: "public-beta",
    estimatedMinutes: [2, 4],
    principle: "Available does not mean suitable.",
    principleDetail:
      "The important question is not whether a tie is available. It is whether the complete restoration path is appropriate for the intended transfer.",
    summary:
      "Feeder 120 locks out at 02:37. Isolate the reported fault, restore what you can from the normal source, then choose how to pick up the rest.",
    viewLevel: "training",
    competencies: ["SYSTEM_AWARENESS", "ELECTRICAL_AWARENESS", "INFORMATION_AWARENESS", "OPERATIONAL_JUDGMENT"],
    judgmentElements: [
      "An obvious choice with a hidden consequence",
      "A reasonable wrong decision",
      "Incomplete information unless the learner looks for it",
    ],
  },

  environment: {
    utility: "Summit Electric",
    grid: "Summit Grid",
    fictional: true,
    primaryFeeder: "Feeder 120",
    disclaimer:
      "Summit Grid is a fictional training environment. GridOps Labs provides educational training content and does not replace employer operating procedures, qualification requirements, safety rules, or authorization to operate electrical systems.",
    heroImage: "/summit-grid-hero.jpg",
    heroImageAlt:
      "Summit Electric distribution system at night in a storm: Feeder 120 is in CB-120 lockout with 1,842 customers interrupted, a normally-open tie reaches alternate source Feeder 88 — the tie is available, but is the path?",
  },

  topology: {
    viewBox: { width: 1000, height: 390 },
    revealFeeders: [{ feeder: "F121", atPhase: "ph-decide" }],
    nodes: [
      { id: "src120", kind: "source", x: 40, y: 170, label: "SUMMIT SUB", sublabel: "Bank 1", labelAt: "above" },
      { id: "n1", kind: "junction", x: 150, y: 170 },
      { id: "n2", kind: "junction", x: 300, y: 170 },
      { id: "n3", kind: "junction", x: 360, y: 170 },
      { id: "n4", kind: "junction", x: 500, y: 170 },
      { id: "n5", kind: "junction", x: 560, y: 170 },
      { id: "n6", kind: "junction", x: 740, y: 170 },
      { id: "n6n", kind: "junction", x: 740, y: 70 },
      { id: "n7", kind: "junction", x: 850, y: 70 },
      { id: "n6s", kind: "junction", x: 740, y: 250 },
      { id: "n8", kind: "junction", x: 850, y: 250 },
      { id: "src122", kind: "source", x: 960, y: 70, label: "F122", sublabel: "Pine Ridge Sub", labelAt: "below" },
      { id: "src123", kind: "source", x: 960, y: 250, label: "F123", sublabel: "Summit Sub · Bank 1", labelAt: "below" },
      { id: "src121", kind: "source", x: 40, y: 330, label: "CEDAR FLAT SUB", sublabel: "Bank 2", labelAt: "below" },
      { id: "m1", kind: "junction", x: 150, y: 330 },
      { id: "m2", kind: "junction", x: 340, y: 330 },
      { id: "m3", kind: "junction", x: 560, y: 330 },
      { id: "m4", kind: "end", x: 700, y: 330 },
    ],
    edges: [
      // Feeder 120. `pathGroups` mark the interrupted load side each tie would pick up.
      { id: "CB-120", kind: "breaker", from: "src120", to: "n1", feeder: "F120", label: "CB-120", trainingLabel: "Feeder Breaker", normal: "closed", labelAt: "below" },
      { id: "S1", kind: "line", from: "n1", to: "n2", feeder: "F120", label: "Section 1" },
      { id: "SW-1201", kind: "switch", from: "n2", to: "n3", feeder: "F120", label: "SW-1201", trainingLabel: "North Isolation", normal: "closed", labelAt: "below" },
      { id: "S2", kind: "line", from: "n3", to: "n4", feeder: "F120", label: "Section 2" },
      { id: "SW-1202", kind: "switch", from: "n4", to: "n5", feeder: "F120", label: "SW-1202", trainingLabel: "South Isolation", normal: "closed", labelAt: "below" },
      { id: "S3", kind: "line", from: "n5", to: "n6", feeder: "F120", label: "Section 3", pathGroups: ["path-A", "path-B", "path-C"] },
      { id: "S3n", kind: "line", from: "n6", to: "n6n", feeder: "F120", pathGroups: ["path-A", "path-B", "path-C"] },
      { id: "S4", kind: "line", from: "n6n", to: "n7", feeder: "F120", label: "Section 3N", pathGroups: ["path-A", "path-B", "path-C"] },
      { id: "S3s", kind: "line", from: "n6", to: "n6s", feeder: "F120", pathGroups: ["path-A", "path-B", "path-C"] },
      { id: "S5", kind: "line", from: "n6s", to: "n8", feeder: "F120", label: "Section 3S", pathGroups: ["path-A", "path-B", "path-C"] },
      // Ties (normally open)
      { id: "TIE-121", kind: "tie", from: "n5", to: "m3", feeder: "TIE", label: "TIE-121", caption: "TIE A", trainingLabel: "Near Tie", normal: "open", labelAt: "right", pathGroups: ["path-A"] },
      { id: "TIE-122", kind: "tie", from: "n7", to: "src122", feeder: "TIE", label: "TIE-122", caption: "TIE B", trainingLabel: "West Tie", normal: "open", labelAt: "above", pathGroups: ["path-B"] },
      { id: "TIE-123", kind: "tie", from: "n8", to: "src123", feeder: "TIE", label: "TIE-123", caption: "TIE C", trainingLabel: "South Tie", normal: "open", labelAt: "above", pathGroups: ["path-C"] },
      // Feeder 121 (alternate source for TIE A)
      { id: "CB-121", kind: "breaker", from: "src121", to: "m1", feeder: "F121", label: "CB-121", normal: "closed", labelAt: "above", pathGroups: ["path-A"] },
      { id: "F121-A", kind: "line", from: "m1", to: "m2", feeder: "F121", label: "Feeder 121", pathGroups: ["path-A"] },
      { id: "F121-B", kind: "line", from: "m2", to: "m3", feeder: "F121", label: "Mill Creek segment", highlightGroup: "tieA-path", pathGroups: ["path-A"] },
      { id: "F121-C", kind: "line", from: "m3", to: "m4", feeder: "F121" },
    ],
    loads: [
      { id: "L1", edgeId: "S1", customers: 640, label: "640", at: 0.5, side: "above" },
      { id: "L2", edgeId: "S2", customers: 180, label: "180", at: 0.5, side: "above" },
      { id: "L3", edgeId: "S3", customers: 520, label: "520", at: 0.55, side: "above" },
      { id: "L4", edgeId: "S4", customers: 540, label: "540", at: 0.5, side: "above" },
      { id: "L5", edgeId: "S5", customers: 360, label: "360", at: 0.5, side: "above" },
    ],
  },

  initialState: {
    devices: {
      "CB-120": "open",
      "SW-1201": "closed",
      "SW-1202": "closed",
      "TIE-121": "open",
      "TIE-122": "open",
      "TIE-123": "open",
      "CB-121": "closed",
    },
    faultedEdges: ["S2"],
    customersInterrupted: 2240,
    alarms: [{ id: "al-lockout", quality: "INDICATED", severity: "limit", text: "CB-120 LOCKOUT", deviceId: "CB-120" }],
  },

  information: [
    {
      id: "info-breaker",
      title: "Breaker state",
      quality: "INDICATED",
      source: "SCADA status",
      value: "CB-120 open · lockout",
      body: "CB-120 indicates open after completing its reclosing sequence. A lockout alarm is active. This is what the control system is telling you, not a field confirmation.",
      validation: sme("DL001-RECLOSE", "Generic description of a feeder breaker reclosing to lockout. Confirm wording is utility-neutral."),
    },
    {
      id: "info-feeder",
      title: "Feeder status",
      quality: "INDICATED",
      source: "SCADA analogs",
      value: "Feeder 120 de-energized",
      body: "No voltage or current is indicated downstream of CB-120. All three sections of Feeder 120 appear de-energized.",
    },
    {
      id: "info-fault",
      title: "Fault location",
      quality: "INFERRED",
      source: "Protection operation",
      value: "Somewhere on Feeder 120",
      body: "The breaker operation tells you there was a fault downstream of CB-120. It doesn't tell you where. A crew has been dispatched to patrol.",
    },
    {
      id: "info-customers",
      title: "Customer interruption",
      quality: "INFERRED",
      source: "Connectivity model",
      value: "≈ 2,240 customers",
      body: "Estimated from the connectivity model for the whole feeder. Outage calls will lag behind this number.",
      validation: sme("DL001-CUSTOMERS", "Fictional customer counts per section (640 / 180 / 520 / 540 / 360). Confirm proportions are plausible for a training feeder."),
    },
    {
      id: "info-alternate",
      title: "Alternate source availability",
      quality: "INDICATED",
      source: "SCADA status",
      value: "3 normally-open ties",
      body: "TIE-121, TIE-122 and TIE-123 all indicate open and available. Details for each tie can be reviewed once the fault is isolated.",
    },
    {
      id: "info-normal",
      title: "Normal configuration",
      quality: "KNOWN",
      source: "System record",
      value: "Summit Sub · Bank 1",
      body: "Feeder 120 is normally fed from Summit Sub, Bank 1, through CB-120. SW-1201 and SW-1202 are normally closed. All three ties are normally open.",
    },
  ],

  reports: [
    {
      id: "rpt-crew",
      from: "Field crew · Truck 7",
      channel: "Radio",
      quality: "REPORTED",
      message: "Fault located between the two sectionalizing devices.",
      note: "The crew describes damage between SW-1201 and SW-1202. A trusted report is still a report: it tells you where to act, not what state the devices are in.",
    },
  ],

  phases: [
    {
      id: "ph-event",
      type: "event",
      step: "Event",
      objective: "Take the desk and size up the event.",
      headline: "Feeder 120 lockout",
      lines: ["Storm cell over the east service area.", "CB-120 has tripped, reclosed, and locked out."],
      afterText: "Feeder 120 has locked out. About 2,240 customers are without power. You're on the desk.",
    },
    {
      id: "ph-review",
      type: "review",
      step: "Assess",
      objective: "Assess what you know before you operate anything.",
      prompt: "What would you like to review first?",
      infoIds: ["info-breaker", "info-feeder", "info-fault", "info-customers", "info-alternate", "info-normal"],
      minViews: 1,
    },
    { id: "ph-report", type: "report", step: "Report", objective: "Take the crew's report from the field.", reportId: "rpt-crew", prompt: "The patrol crew calls in." },
    {
      id: "ph-isolate",
      type: "isolate",
      step: "Isolate",
      objective: "Isolate the reported faulted section.",
      prompt: "Select the two sectionalizing devices on either side of the reported fault to open them.",
      helpText: "Tap a device on the one-line, or use the list below. The crew's report puts the fault in Section 2.",
      requiredOpen: ["SW-1201", "SW-1202"],
      hints: {
        "CB-120": "CB-120 is already open. It's the feeder breaker, not a device bounding the reported fault.",
        "TIE-121": "Ties are normally open. They're for restoration, not isolation.",
        "TIE-122": "Ties are normally open. They're for restoration, not isolation.",
        "TIE-123": "Ties are normally open. They're for restoration, not isolation.",
        "CB-121": "CB-121 is on Feeder 121. It isn't part of isolating this fault.",
      },
      defaultHint: "That device isn't one of the two bounding the reported fault.",
      successText: "Fault isolated. Section 2 is bounded by open devices on both sides.",
    },
    {
      id: "ph-restore",
      type: "restore",
      step: "Restore",
      objective: "Restore customers that can be supplied from the normal source.",
      prompt: "Section 1 is between the breaker and the isolated fault. Restore it from the normal source.",
      close: ["CB-120"],
      actionLabel: "Close CB-120",
      successText: "Section 1 restored from Summit Sub. The load side is still out.",
      afterText: "180 of those customers are in the faulted section and stay out until repairs. The other 1,420 are beyond SW-1202 and can be picked up from an alternate source.",
    },
    { id: "ph-decide", type: "decide", step: "Decide", objective: "Evaluate the alternate paths, then select one.", decisionPointId: "dp-alternate" },
    { id: "ph-result", type: "consequence", step: "Result", objective: "See what your decision did to the system." },
    { id: "ph-debrief", type: "debrief", step: "Debrief", objective: "Review your reasoning." },
  ],

  decisionPoints: [
    {
      id: "dp-alternate",
      prompt: "Select the restoration path you would use.",
      context: "Three normally-open ties can pick up the 1,420 interrupted customers beyond SW-1202. Inspect whatever you want before you choose. Nothing operates until you execute.",
      reasonPrompt: "Why did you choose this restoration path?",
      allowFreeText: true,
      reasons: [
        { id: "closest", label: "Closest available tie" },
        { id: "lowest-loading", label: "Lowest existing loading" },
        { id: "strongest", label: "Strongest available path" },
        { id: "capacity", label: "Equipment / conductor capacity" },
        { id: "simplest", label: "Simplest switching" },
        { id: "source-config", label: "Source configuration" },
        { id: "other", label: "Other" },
      ],
      options: [
        {
          id: "A",
          label: "TIE A",
          trainingLabel: "Near Tie",
          pathGroup: "path-A",
          deviceId: "TIE-121",
          summary: "TIE-121 to Feeder 121 from Cedar Flat Sub.",
          cues: ["Closest to the interrupted section", "One close picks up all 1,420 customers"],
          consequenceId: "cons-A",
          inspection: [
            {
              category: "source",
              label: "Existing source loading",
              value: "CB-121 · 310 A of 600 A",
              detail: "Feeder 121 breaker loading before the transfer. Lowest of the three alternate feeders.",
              quality: "INDICATED",
              validation: sme("DL001-A-SOURCE", "Fictional F121 breaker loading 310 A against a fictional 600 A feeder limit."),
            },
            {
              category: "transfer",
              label: "Estimated transferred load",
              value: `≈ ${TRANSFER_AMPS} A`,
              detail: "Feeder 120 load-side demand just before the event, from historical data. Actual pickup may differ.",
              quality: "INFERRED",
              validation: sme("DL001-TRANSFER", "Fictional pre-event load-side current of 165 A. Cold-load pickup is not modeled."),
            },
            {
              category: "path",
              label: "Path / conductor rating",
              value: "Mill Creek segment · 230 A",
              detail: "The transfer would flow through a smaller-conductor segment of Feeder 121 between Cedar Flat and TIE-121. It already carries about 120 A. After the transfer: about 285 A.",
              quality: "KNOWN",
              flag: "limit",
              highlightGroup: "tieA-path",
              validation: sme("DL001-A-PATH", "Fictional 230 A segment rating, 120 A existing flow, ~285 A after transfer. This is the scenario's hidden limitation."),
            },
            {
              category: "upstream",
              label: "Upstream equipment",
              value: "Cedar Flat Bank 2 · 58% of rating",
              detail: "Substation transformer loading before the transfer.",
              quality: "INDICATED",
              validation: sme("DL001-A-BANK", "Fictional bank loading 58%."),
            },
            {
              category: "note",
              label: "System note",
              value: "Closest tie",
              detail: "TIE-121 connects directly at SW-1202, right at the edge of the interrupted section.",
              quality: "KNOWN",
            },
          ],
        },
        {
          id: "B",
          label: "TIE B",
          trainingLabel: "West Tie",
          pathGroup: "path-B",
          deviceId: "TIE-122",
          summary: "TIE-122 to Feeder 122 from Pine Ridge Sub.",
          cues: ["At the far end of Section 3N", "One close picks up all 1,420 customers"],
          consequenceId: "cons-B",
          inspection: [
            {
              category: "source",
              label: "Existing source loading",
              value: "CB-122 · 360 A of 600 A",
              detail: "Feeder 122 breaker loading before the transfer.",
              quality: "INDICATED",
              validation: sme("DL001-B-SOURCE", "Fictional F122 breaker loading 360 A against a fictional 600 A limit (~525 A after transfer)."),
            },
            {
              category: "transfer",
              label: "Estimated transferred load",
              value: `≈ ${TRANSFER_AMPS} A`,
              detail: "Feeder 120 load-side demand just before the event, from historical data. Actual pickup may differ.",
              quality: "INFERRED",
              validation: sme("DL001-TRANSFER", "Fictional pre-event load-side current of 165 A. Cold-load pickup is not modeled."),
            },
            {
              category: "path",
              label: "Path / conductor rating",
              value: "Pine Ridge trunk · 450 A",
              detail: "Trunk conductor all the way to TIE-122. Existing flow about 180 A; about 345 A after the transfer.",
              quality: "KNOWN",
              validation: sme("DL001-B-PATH", "Fictional 450 A trunk rating, 180 A existing, ~345 A after transfer."),
            },
            {
              category: "upstream",
              label: "Upstream equipment",
              value: "Pine Ridge Bank 1 · 64% of rating",
              detail: "Substation transformer loading before the transfer.",
              quality: "INDICATED",
              validation: sme("DL001-B-BANK", "Fictional bank loading 64% before transfer, ~73% after."),
            },
            {
              category: "note",
              label: "System note",
              value: "Longest path",
              detail: "The electrical path from Pine Ridge is the longest of the three. Voltage at the far end is not modeled in DL-001 and would need to be checked on a real system.",
              quality: "KNOWN",
              flag: "caution",
              validation: sme("DL001-B-VOLTAGE", "Scenario deliberately does not model voltage drop. Confirm the note is appropriate and not misleading."),
            },
          ],
        },
        {
          id: "C",
          label: "TIE C",
          trainingLabel: "South Tie",
          pathGroup: "path-C",
          deviceId: "TIE-123",
          summary: "TIE-123 to Feeder 123 from Summit Sub, Bank 1.",
          cues: ["At the far end of Section 3S", "One close picks up all 1,420 customers"],
          consequenceId: "cons-C",
          inspection: [
            {
              category: "source",
              label: "Existing source loading",
              value: "CB-123 · 480 A of 600 A",
              detail: "Feeder 123 breaker loading before the transfer. About 645 A after the transfer.",
              quality: "INDICATED",
              flag: "limit",
              validation: sme("DL001-C-SOURCE", "Fictional F123 breaker loading 480 A against a fictional 600 A limit (~645 A after transfer)."),
            },
            {
              category: "transfer",
              label: "Estimated transferred load",
              value: `≈ ${TRANSFER_AMPS} A`,
              detail: "Feeder 120 load-side demand just before the event, from historical data. Actual pickup may differ.",
              quality: "INFERRED",
              validation: sme("DL001-TRANSFER", "Fictional pre-event load-side current of 165 A. Cold-load pickup is not modeled."),
            },
            {
              category: "path",
              label: "Path / conductor rating",
              value: "F123 trunk · 450 A",
              detail: "Trunk conductor to TIE-123. The path itself is not the constraint.",
              quality: "KNOWN",
              validation: sme("DL001-C-PATH", "Fictional 450 A trunk rating on F123."),
            },
            {
              category: "upstream",
              label: "Upstream equipment",
              value: "Summit Bank 1 · shared with F120",
              detail: "Feeder 123 is fed from the same substation bank as Feeder 120. The transfer puts that load back on the bank it came from.",
              quality: "KNOWN",
              flag: "caution",
              validation: sme("DL001-C-BANK", "Shared-bank note. Confirm the teaching point is stated neutrally."),
            },
            {
              category: "note",
              label: "System note",
              value: "Heaviest feeder",
              detail: "Feeder 123 serves a commercial corridor and runs heavier than its neighbors overnight.",
              quality: "KNOWN",
            },
          ],
        },
      ],
    },
  ],

  consequences: [
    {
      id: "cons-A",
      outcome: "limited",
      resultLabel: "Restored through TIE A · path above rating",
      headline: "Customers restored. The path is over its rating.",
      sequence: [
        "TIE-121 closed.",
        "1,420 customers restored through Feeder 121.",
        "Mill Creek segment loading rises to an estimated 285 A.",
      ],
      alarms: [
        {
          id: "al-a",
          quality: "INDICATED",
          severity: "limit",
          text: "F121 MILL CREEK SEG · EST 285 A / 230 A (124%)",
          validation: sme("DL001-A-ALARM", "Fictional calculated-loading alarm. Real systems may or may not present this indication."),
        },
      ],
      explanation: [
        "TIE-121 was available. It was closest, needed one close, and Feeder 121 had the lowest breaker loading of the three.",
        "The limit wasn't at the breaker. It was in the path: a smaller-conductor segment between Cedar Flat and the tie that now carries its own load plus the transfer.",
        "In this fictional scenario the customers are back on, and a segment is running above its rating. That's a new condition someone has to manage, usually with fewer options than before the close.",
      ],
      highlightGroups: ["tieA-path"],
      customersRestored: 1420,
      validation: sme("DL001-A-CONSEQUENCE", "Consequence is stated as an over-rating condition only. No claim is made about protection response or conductor damage."),
    },
    {
      id: "cons-B",
      outcome: "suitable",
      resultLabel: "Restored through TIE B · within fictional limits",
      headline: "Customers restored within the limits shown.",
      sequence: [
        "TIE-122 closed.",
        "1,420 customers restored through Feeder 122.",
        "CB-122 about 525 A of 600 A. Pine Ridge trunk about 345 A of 450 A.",
      ],
      alarms: [
        {
          id: "al-b",
          quality: "KNOWN",
          severity: "caution",
          text: "F120 LOAD SIDE ON ABNORMAL CONFIGURATION · FED FROM F122",
        },
      ],
      explanation: [
        "TIE-122 wasn't the closest option, and nothing about it looked easier than TIE-121.",
        "Across the complete path (breaker, trunk conductor, and substation bank) the transfer stayed within every fictional limit in this scenario.",
        "Restored doesn't mean normal. Feeder 120's load side is now fed from Pine Ridge. That configuration has to be tracked until Section 2 is repaired and normal is restored. Far-end voltage is not modeled here and would need checking on a real system.",
      ],
      customersRestored: 1420,
      validation: sme("DL001-B-CONSEQUENCE", "Confirm that TIE B is a defensible preferred path given the fictional values, and that the voltage caveat is sufficient."),
    },
    {
      id: "cons-C",
      outcome: "limited",
      resultLabel: "Restored through TIE C · feeder above limit",
      headline: "Customers restored. Feeder 123 is over its limit.",
      sequence: [
        "TIE-123 closed.",
        "1,420 customers restored through Feeder 123.",
        "CB-123 loading rises to an estimated 645 A.",
      ],
      alarms: [
        {
          id: "al-c",
          quality: "INDICATED",
          severity: "limit",
          text: "CB-123 · EST 645 A / 600 A LIMIT",
          validation: sme("DL001-C-ALARM", "Fictional feeder loading alarm."),
        },
      ],
      explanation: [
        "TIE-123 was available and its path conductor had room.",
        "The constraint was at the source. Feeder 123 was already the heaviest of the three, and the transfer put its breaker past the fictional feeder limit.",
        "Feeder 123 also shares Summit Bank 1 with Feeder 120, so this choice doesn't spread load to a different substation.",
      ],
      customersRestored: 1420,
      validation: sme("DL001-C-CONSEQUENCE", "Consequence is stated as an over-limit condition only. No claim is made about protection response."),
    },
  ],

  competencies: [
    {
      competency: "SYSTEM_AWARENESS",
      rules: [
        { when: { kind: "isolationFirstTry", value: true }, tone: "strength", text: "You isolated the reported fault by opening the devices on both sides of it, with no extra selections." },
        { when: { kind: "isolationFirstTry", value: false }, tone: "gap", text: "You selected at least one device that wasn't needed to isolate the reported fault before finishing isolation." },
        { when: { kind: "viewedInfo", infoIds: ["info-normal"], mode: "all" }, tone: "strength", text: "You reviewed the normal configuration before operating anything." },
      ],
    },
    {
      competency: "ELECTRICAL_AWARENESS",
      rules: [
        { when: { kind: "inspectedCategoryForAll", category: "path" }, tone: "strength", text: "You reviewed the complete path rating for every tie before selecting a restoration source." },
        {
          when: { kind: "and", predicates: [{ kind: "not", predicate: { kind: "inspectedCategoryForAll", category: "path" } }, { kind: "not", predicate: { kind: "inspectedCategoryForNone", category: "path" } }] },
          tone: "gap",
          text: "You reviewed path ratings for some ties, but not all of them, before choosing.",
        },
        { when: { kind: "inspectedCategoryForNone", category: "path" }, tone: "gap", text: "You chose a restoration path without opening a path or conductor rating for any tie." },
        {
          when: { kind: "and", predicates: [{ kind: "selectedOption", optionIds: ["A"] }, { kind: "inspectedCategoryForAll", category: "path" }] },
          tone: "neutral",
          text: "You opened the Mill Creek segment rating and still selected TIE A. That reasoning is worth talking through with a mentor.",
        },
      ],
    },
    {
      competency: "INFORMATION_AWARENESS",
      rules: [
        {
          when: { kind: "and", predicates: [{ kind: "inspectedCategoryForAll", category: "source" }, { kind: "inspectedCategoryForAll", category: "path" }, { kind: "inspectedCategoryForAll", category: "upstream" }] },
          tone: "strength",
          text: "You reviewed source, path, and upstream details for every tie before deciding.",
        },
        {
          when: { kind: "not", predicate: { kind: "and", predicates: [{ kind: "inspectedCategoryForAll", category: "source" }, { kind: "inspectedCategoryForAll", category: "path" }, { kind: "inspectedCategoryForAll", category: "upstream" }] } },
          tone: "gap",
          text: "You made a decision before reviewing one or more available source-path details.",
        },
        { when: { kind: "viewedInfo", infoIds: ["info-fault"], mode: "all" }, tone: "neutral", text: "You checked what was known about the fault location before the crew's report came in." },
      ],
    },
    {
      competency: "OPERATIONAL_JUDGMENT",
      rules: [
        { when: { kind: "outcome", outcome: "suitable" }, tone: "strength", text: "You chose a path that kept the transfer within every limit shown in this scenario." },
        {
          when: { kind: "and", predicates: [{ kind: "outcome", outcome: "limited" }, { kind: "reasonIncludes", reasonIds: ["closest", "simplest"] }] },
          tone: "gap",
          text: "Your stated reason was proximity or simple switching. Both are real considerations. In this scenario, neither reflected the limit in the path.",
        },
        {
          when: { kind: "and", predicates: [{ kind: "outcome", outcome: "limited" }, { kind: "reasonIncludes", reasonIds: ["lowest-loading"] }] },
          tone: "gap",
          text: "You chose on existing source loading. The breaker had margin; the limit was farther along the path.",
        },
        { when: { kind: "changedDecision", value: true }, tone: "neutral", text: "You changed your selection before submitting it." },
      ],
    },
  ],

  debrief: {
    principle: "Available does not mean suitable.",
    principleDetail:
      "The important question is not whether a tie is available. It is whether the complete restoration path is appropriate for the intended transfer.",
    reflectionPrompt: "What information would you verify before making this decision on another system?",
    scopeNotes: [
      "DL-001 does not model splitting the load across more than one tie, cold-load pickup, voltage, or protection on the alternate feeder. Each can change the decision on a real system.",
      "Switching here is simplified to show the reasoning. It is not a switching procedure. Follow your utility's procedures, switching orders, and authorization requirements.",
    ],
  },

  clock: {
    start: "02:37",
    costs: {
      informationViewed: 20,
      fieldReportReceived: 110,
      deviceSelected: 15,
      deviceOperated: 40,
      normalSourceRestored: 20,
      tieDetailsViewed: 12,
      selectedTie: 10,
      changedDecision: 10,
      decisionReason: 5,
      decisionSubmitted: 40,
      consequenceShown: 60,
    },
  },

  replayLabels: {
    scenarioStarted: "Feeder 120 lockout",
    informationViewed: "Reviewed {detail}",
    fieldReportReceived: "Field report received",
    deviceSelected: "Selected {detail}",
    deviceOperated: "{detail}",
    faultIsolated: "Fault isolated · {detail}",
    normalSourceRestored: "Normal-source restoration · {detail}",
    tieDetailsViewed: "Inspected {detail}",
    selectedTie: "Selected {detail}",
    changedDecision: "Changed selection · {detail}",
    decisionReason: "Reason given",
    decisionSubmitted: "Restoration path executed · {detail}",
    consequenceShown: "Result · {detail}",
    scenarioCompleted: "Debrief completed",
  },

  feedback: {
    scenarioQuestions: [
      "Was anything unrealistic?",
      "What information would you want before making this decision?",
      "Was anything important missing?",
    ],
  },
};
