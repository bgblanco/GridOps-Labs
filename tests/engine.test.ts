/* Engine branch tests for DL-001. Run: npm test */
import assert from "node:assert/strict";
import { dl001 } from "../src/lib/scenarios/dl-001";
import {
  buildReplay,
  canAdvance,
  competencyEvidence,
  createInitialState,
  currentPhase,
  inspectionCoverage,
  labReducer,
  liveSystemView,
  type LabAction,
  type LabState,
} from "../src/lib/scenario/engine";
import { SME_VALIDATION_REQUIRED } from "../src/lib/scenario/schema";
import { readFileSync } from "node:fs";

let t = 1_000_000;
const now = () => (t += 1000);
const run = (s: LabState, ...actions: LabAction[]) => actions.reduce((acc, a) => labReducer(dl001, acc, a), s);

function toDecision(opts: { wrongIsolation?: boolean; view?: string[] } = {}) {
  let s = createInitialState(dl001);
  s = run(s, { type: "START", now: now() }, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "review");
  assert.equal(canAdvance(dl001, s), false, "review needs a view first");
  for (const id of opts.view ?? ["info-breaker"]) s = run(s, { type: "VIEW_INFO", infoId: id, now: now() });
  s = run(s, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "report");
  s = run(s, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "isolate");
  if (opts.wrongIsolation) {
    s = run(s, { type: "SELECT_DEVICE", deviceId: "TIE-121", now: now() });
    assert.equal(s.notice?.tone, "caution");
    assert.equal(s.devices["TIE-121"], "open", "tie must not operate during isolation");
  }
  s = run(s, { type: "SELECT_DEVICE", deviceId: "SW-1201", now: now() });
  assert.equal(canAdvance(dl001, s), false);
  s = run(s, { type: "SELECT_DEVICE", deviceId: "SW-1202", now: now() });
  assert.equal(canAdvance(dl001, s), true);
  s = run(s, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "restore");
  assert.equal(liveSystemView(dl001, s).customersInterrupted, 2240);
  s = run(s, { type: "RESTORE_NORMAL", now: now() });
  assert.equal(liveSystemView(dl001, s).customersInterrupted, 1600, "section 1 restored");
  s = run(s, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "decide");
  return s;
}

// Branch A without inspecting
{
  let s = toDecision({ wrongIsolation: true });
  s = run(s, { type: "SUBMIT_DECISION", now: now() });
  assert.equal(s.submitted, undefined, "cannot submit without option and reason");
  s = run(s, { type: "CHOOSE_OPTION", optionId: "A", now: now() }, { type: "SET_REASONS", reasonIds: ["closest"], now: now() }, { type: "SUBMIT_DECISION", now: now() });
  assert.equal(currentPhase(dl001, s).type, "consequence");
  assert.equal(s.consequenceId, "cons-A");
  assert.equal(liveSystemView(dl001, s).customersInterrupted, 180, "only the faulted section remains out");
  const ev = competencyEvidence(dl001, s);
  const texts = ev.flatMap((e) => e.observations.map((o) => o.text)).join("\n");
  assert.match(texts, /without opening a path or conductor rating/);
  assert.match(texts, /before reviewing one or more available source-path details/);
  assert.match(texts, /wasn't needed to isolate/);
  assert.match(texts, /proximity or simple switching/);
  const replay = buildReplay(dl001, s);
  assert.equal(replay[0].time, "02:37");
  assert.ok(replay.some((r) => r.label.includes("Selected TIE-121")), "replay shows wrong device pick");
  assert.ok(replay.some((r) => r.label.includes("TIE A closed")));
  assert.ok(!replay.some((r) => r.label.startsWith("Inspected")), "no inspections recorded");
  s = run(s, { type: "NEXT", now: now() });
  assert.equal(currentPhase(dl001, s).type, "debrief");
  s = run(s, { type: "ANSWER_DEBRIEF", text: "Check conductor ratings", now: now() }, { type: "COMPLETE", now: now() });
  assert.ok(s.completed);
  console.log("✓ branch A (no inspection)");
}

// Branch B after full inspection, with changed decision
{
  let s = toDecision({ view: ["info-normal", "info-fault"] });
  for (const o of ["A", "B", "C"]) for (const c of ["source", "path", "upstream"]) s = run(s, { type: "INSPECT", optionId: o, category: c, now: now() });
  s = run(s, { type: "CHOOSE_OPTION", optionId: "A", now: now() }, { type: "CHOOSE_OPTION", optionId: "B", now: now() });
  assert.equal(s.changedDecisionCount, 1);
  s = run(s, { type: "SET_REASONS", reasonIds: ["capacity"], now: now() }, { type: "SET_TEXT", text: "Mill Creek is undersized", }, { type: "SUBMIT_DECISION", now: now() });
  assert.equal(s.consequenceId, "cons-B");
  assert.ok(s.submitted!.timeToDecisionMs > 0);
  const texts = competencyEvidence(dl001, s).flatMap((e) => e.observations.map((o) => o.text)).join("\n");
  assert.match(texts, /complete path rating for every tie/);
  assert.match(texts, /within every limit/);
  assert.match(texts, /changed your selection/);
  assert.match(texts, /with no extra selections/);
  const cov = inspectionCoverage(dl001, s);
  assert.ok(cov.filter((c) => c.viewed).length === 2 + 9);
  const replay = buildReplay(dl001, s);
  assert.ok(replay.some((r) => r.label.startsWith("Changed selection")));
  assert.equal(replay.filter((r) => r.label.startsWith("Inspected")).length, 9);
  console.log("✓ branch B (full inspection, changed decision)");
}

// Branch C and A-with-path-viewed
{
  let s = toDecision();
  s = run(s, { type: "INSPECT", optionId: "C", category: "path", now: now() });
  s = run(s, { type: "CHOOSE_OPTION", optionId: "C", now: now() }, { type: "SET_REASONS", reasonIds: ["strongest"], now: now() }, { type: "SUBMIT_DECISION", now: now() });
  assert.equal(s.consequenceId, "cons-C");
  const texts = competencyEvidence(dl001, s).flatMap((e) => e.observations.map((o) => o.text)).join("\n");
  assert.match(texts, /some ties, but not all/);
  console.log("✓ branch C (partial inspection)");

  let a = toDecision();
  for (const o of ["A", "B", "C"]) a = run(a, { type: "INSPECT", optionId: o, category: "path", now: now() });
  a = run(a, { type: "CHOOSE_OPTION", optionId: "A", now: now() }, { type: "SET_REASONS", reasonIds: ["lowest-loading"], now: now() }, { type: "SUBMIT_DECISION", now: now() });
  const at = competencyEvidence(dl001, a).flatMap((e) => e.observations.map((o) => o.text)).join("\n");
  assert.match(at, /still selected TIE A/);
  assert.match(at, /limit was farther along the path/);
  console.log("✓ branch A (path viewed, chose anyway)");
}

// Reset
{
  let s = toDecision();
  s = run(s, { type: "RESET" });
  assert.deepEqual(s, createInitialState(dl001));
  console.log("✓ reset");
}

// Every SME flag documented
{
  const ids = new Set<string>();
  JSON.stringify(dl001, (_k, v) => {
    if (v && typeof v === "object" && v.status === SME_VALIDATION_REQUIRED) ids.add(v.id);
    return v;
  });
  const doc = readFileSync(new URL("../docs/technical-validation.md", import.meta.url), "utf8");
  const missing = [...ids].filter((id) => !doc.includes(id));
  assert.deepEqual(missing, [], `SME items missing from docs: ${missing.join(", ")}`);
  console.log(`✓ ${ids.size} SME validation items documented`);
}
