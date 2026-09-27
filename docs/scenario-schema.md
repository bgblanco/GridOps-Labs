# Decision Lab scenario schema

A Decision Lab is three separate layers:

| Layer | Where | Responsibility |
|---|---|---|
| Scenario data | `src/lib/scenarios/*.ts` | Topology, information, phases, decisions, consequences, evidence rules, debrief. Pure data. |
| Simulation engine | `src/lib/scenario/engine.ts`, `topology.ts` | A pure reducer that interprets the data: device operations, energization by connectivity, logging, the simulated clock, evidence, replay. No React, no DOM, no analytics. |
| UI | `src/components/lab/*` | Renders whatever the engine and data describe. `DecisionLabShell` switches on phase `type`, never on scenario id. |

Analytics observe the engine log (`src/lib/analytics/observe.ts`); they are not called from the engine.

Types live in `src/lib/scenario/schema.ts`. That file is the source of truth; this page explains it.

## Adding a scenario

1. Copy `src/lib/scenarios/dl-001.ts` to `dl-002.ts` and edit the data.
2. Add it to the `scenarios` array in `src/lib/scenarios/index.ts`.
3. Mark every fictional value that needs expert review with `sme(id, note)` and add the id to `docs/technical-validation.md`.
4. It is live at `/labs/dl-002`. Nothing in the UI changes.

A scenario must pass the **quality rule**: at least one real judgment element (reasonable wrong choice, hidden consequence, incomplete or conflicting information, changing conditions, competing priorities, unexpected equipment behavior, an assumption to challenge, or a valid reason not to act). Record it in `metadata.judgmentElements`.

## Top-level structure

```ts
interface Scenario {
  metadata        // id, slug, series, title, status, time, principle, view level, competencies, judgment elements
  environment     // utility, grid, fictional: true, primaryFeeder label, disclaimer
  topology        // nodes, edges (lines + devices), loads, viewBox, revealFeeders
  initialState    // device states after the initiating event, faulted edges, initial alarms
  information     // InformationItem[] the learner can review
  reports         // FieldReport[] delivered in report phases
  phases          // ordered Phase[]; the lab walks them in order
  decisionPoints  // DecisionPoint[] referenced by decide phases
  consequences    // Consequence[] referenced by decision options
  competencies    // evidence rules per competency
  debrief         // principle, reflection prompt, scope notes
  clock           // start time and simulated seconds per logged action
  replayLabels    // how each log type reads in the replay; {detail} is filled in
  feedback        // scenario-specific feedback questions
}
```

## Topology

- **Nodes** have `x`, `y` in `viewBox` units and a `kind`: `source`, `junction`, or `end`.
- **Edges** connect two nodes. `kind: "line"` always conducts. `breaker`, `switch`, and `tie` conduct only when their state is `closed`. `normal` is the shelf state.
- **Loads** attach customers to a line edge. Customer counts come only from here.
- `highlightGroup` on an edge lets an inspection item or consequence light it up.
- `revealFeeders` hides a feeder until a phase, so early views stay simple.

Energization is computed by breadth-first search from every source across conducting edges (`topology.ts`). This is connectivity, **not power flow**. Loading, voltage, and protection outcomes are stated in scenario data, not calculated.

## Information quality

Every `InformationItem`, `FieldReport`, `InspectionItem`, and `Alarm` carries a `quality`:

`KNOWN` · `INDICATED` · `REPORTED` · `INFERRED` · `ASSUMED`

The UI always shows the label with a glyph so color is never the only cue.

## Phases

| type | Learner does | Advances when | Key fields |
|---|---|---|---|
| `event` | Reads the initiating event, starts | Started | `headline`, `lines`, `afterText`, `story` |
| `review` | Opens information items | `minViews` reached | `prompt`, `infoIds`, `minViews` |
| `report` | Reads a field report | Always | `reportId`, `prompt` |
| `isolate` | Selects devices to open | Every `requiredOpen` device is open | `requiredOpen`, `hints`, `defaultHint`, `successText`, `helpText` |
| `restore` | Closes devices from the normal source | Every `close` device is closed and no fault is re-energized | `close`, `actionLabel`, `successText`, `afterText` |
| `decide` | Inspects options, chooses, gives reasons | Decision submitted | `decisionPointId` |
| `consequence` | Watches the decision execute | Consequence shown | — |
| `debrief` | Reviews decision, replay, evidence, gives feedback | Terminal | — |

New phase types need an engine case and a UI branch; everything else is data.

## Decisions

A `DecisionPoint` has `options`, `reasons`, and prompts. Each `DecisionOption` has:

- `deviceId` the engine closes when executed
- `cues`: what's visible before inspection (use these to make the trap attractive)
- `inspection`: `InspectionItem[]` keyed by a shared `category` (`source`, `transfer`, `path`, `upstream`, `note` in DL-001). Shared categories let evidence rules ask "did they check the path for every option?"
- `consequenceId`

`Consequence.outcome` is `suitable` or `limited`. The UI never renders correct/incorrect.

## Evidence rules

Each competency has a list of `{ when, text, tone }`. Every rule whose predicate is true is shown. Predicates:

`inspectedCategoryForAll`, `inspectedCategoryForNone`, `inspectedAnyForOption`, `inspectedAllOptions`, `selectedOption`, `outcome`, `viewedInfo` (`all` / `any` / `none`), `isolationFirstTry`, `reasonIncludes`, `changedDecision`, `not`, `and`.

Keep text behavioral ("You reviewed…", "You chose before…"). No scores.

## Log, clock, replay

Every learner action appends a `LogEntry` with a sequence number, wall-clock time (for time-to-decision), and simulated seconds. `clock.costs` sets how many simulated seconds each log type adds. The replay is built only from the log, so it always matches what the learner did.

## View levels

`metadata.viewLevel` is `training` for DL-001. `operating` and `advanced` are reserved: components already accept richer data (ratings, alarms, captions), and harder levels are expected to reduce `cues`, raise `minViews` to 0, and add conflicting information rather than change the UI.
