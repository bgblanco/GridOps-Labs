# DL-001 — The Easy Tie · design notes

**Series:** GridOps Field Test · **Environment:** Summit Grid (fictional) · **Status:** Public beta · **Time:** 2–4 minutes

## Principle

> Available does not mean suitable.

The important question is not whether a tie is available. It is whether the complete restoration path is appropriate for the intended transfer.

## Judgment element

An obvious choice with a hidden consequence. TIE A is the closest tie, needs one close, and its source breaker has the lowest loading of the three. Its limitation is further along the path, in a segment of smaller conductor, and only shows up if the learner opens the path rating.

## Flow

| # | Phase | What happens | What's tracked |
|---|---|---|---|
| 1 | Event | 02:37. Storm scene, then Feeder 120 goes from energized to locked out. | `scenarioStarted` |
| 2 | Assess | "What would you like to review first?" Six items: breaker state, feeder status, fault location, customer interruption, alternate source availability, normal configuration. F121 is hidden to keep the view simple. | `informationViewed` per item |
| 3 | Report | Field crew: "Fault located between the two sectionalizing devices." Labeled REPORTED. | `fieldReportReceived` |
| 4 | Isolate | Learner selects SW-1201 and SW-1202 on the one-line (or the device list). Wrong picks get a hint and nothing operates. | `deviceSelected`, `faultIsolated` |
| 5 | Restore | Close CB-120. Section 1 (640 customers) comes back. 1,600 remain out: 180 faulted, 1,420 restorable. | `normalSourceRestored` |
| 6–7 | Decide | Three cards, all AVAILABLE. Each expands into five categories revealed one at a time. Learner picks a tie, then reasons (multi-select) and optional text. | `tieDetailsViewed`, `selectedTie`, `changedDecision`, `decisionReason`, time to decision |
| 8 | Result | The tie closes, customers restore, then the limitation or the within-limits state is revealed with an alarm. | `consequenceShown` |
| 9–11 | Debrief | Decision summary with inspected / not inspected lists, the principle, a reflection prompt, replay, evidence per competency, feedback, early access. | `scenarioCompleted`, `debriefAnswered` |

## The three paths (fictional values)

| | TIE A · TIE-121 | TIE B · TIE-122 | TIE C · TIE-123 |
|---|---|---|---|
| Alternate source | F121 · Cedar Flat Bank 2 | F122 · Pine Ridge Bank 1 | F123 · Summit Bank 1 |
| Surface cues | Closest, one close | Far end of 3N, one close | Far end of 3S, one close |
| Source loading | 310 / 600 A (lowest) | 360 / 600 A | 480 / 600 A → ≈ 645 A **over** |
| Path | Mill Creek segment 230 A, ≈ 285 A after → **over** | Trunk 450 A, ≈ 345 A after | Trunk 450 A |
| Upstream | Bank 58% | Bank 64% | Shares bank with F120 (caution) |
| Note | Closest tie | Longest path; voltage not modeled (caution) | Heaviest feeder |
| Outcome | `limited` | `suitable` | `limited` |

Transferred load is ≈ 165 A for all three. All values are listed for SME review in `technical-validation.md`.

## Design decisions

- **No correct/incorrect.** The decision executes and the learner watches its effect. Neutral outcome classes only.
- **TIE A is designed to be chosen.** Its visible cues and its lowest breaker loading pull toward it. The reason "Lowest existing loading" is a deliberate second trap.
- **TIE C's limit is visible at the source.** It rewards anyone who checks loading but not the path, and gives a second distinct lesson.
- **TIE B is not "easy."** It is the longest path and carries a voltage caveat, so choosing it still invites discussion.
- **Process matters more than pick.** The debrief lists what was and wasn't opened, and evidence statements respond to inspection behavior independently of the outcome (e.g. choosing TIE A after viewing its limit gets a neutral "worth talking through").
- **Information model.** DL-001 shows KNOWN, INDICATED, REPORTED, and INFERRED. ASSUMED appears in the legend.
- **Story vs. technical layer.** A static illustrated scene (the Summit Grid hero) sets the event. The one-line, values, and alarms are always crisp vector and mono type.

## Presentation layer (training view)

DL-001 runs at `viewLevel: "training"`, so the UI shows friendly dual labels over the asset
ids. These are presentation only — the scenario ids, engine logic, and electrical values are
unchanged (no new SME items):

| Asset id | Training label |
|---|---|
| `SW-1201` | North Isolation |
| `SW-1202` | South Isolation |
| `TIE-121` (option A) | Near Tie |
| `TIE-122` (option B) | West Tie |
| `TIE-123` (option C) | South Tie |
| `CB-120` | Feeder Breaker |

Each phase carries a short `objective` ("Isolate the reported faulted section", "Restore
customers that can be supplied from the normal source", "Evaluate the alternate paths, then
select one"). Each tie carries a `pathGroup` (`path-A/B/C`); inspecting a tie lights its
complete source→tie→interrupted-load path in blue on the one-line. Tie A keeps its hidden
Mill Creek limit (`highlightGroup: "tieA-path"`) separate from the blue path glow, so the
trap is not revealed before inspection.

## Out of scope (stated in the debrief)

Load splitting across ties, cold-load pickup, voltage, protection on the alternate feeder, and real switching procedure.

## Ideas for DL-001 at Operating view

Hide surface cues, remove `minViews`, add a conflicting indication on TIE-122's state, and add a second event arriving during inspection.
