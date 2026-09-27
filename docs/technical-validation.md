# Technical validation register

Every value, rating, loading figure, and consequence in a Decision Lab is a
**fictional training value** for the fictional Summit Grid. None of it comes
from a real utility. Before public release, a qualified distribution
operations or engineering SME should review each item below and confirm it is
plausible, neutral, and not misleading as a teaching example.

In code, each item is marked with `sme(id, note)`, which sets
`status: "SME_VALIDATION_REQUIRED"`. `npm test` fails if any id in the
scenario config is missing from this file.

Status key: **Open** = not yet reviewed.

## DL-001 — The Easy Tie

Source: `src/lib/scenarios/dl-001.ts`

| ID | Item | Fictional value | What to validate | Status |
|---|---|---|---|---|
| DL001-RECLOSE | Breaker state description | CB-120 trips, recloses, locks out | Wording is generic and utility-neutral; no implied reclosing scheme | Open |
| DL001-CUSTOMERS | Customers per section | S1 640 · S2 180 · S3 520 · S3N 540 · S3S 360 (2,240 total) | Plausible proportions for a training feeder | Open |
| DL001-TRANSFER | Transferred load estimate | ≈ 165 A (pre-event load-side current) | Reasonable for 1,420 customers; cold-load pickup deliberately not modeled | Open |
| DL001-A-SOURCE | Feeder 121 breaker loading | 310 A of a 600 A fictional feeder limit | Plausible; intentionally the lowest of three to make TIE A attractive | Open |
| DL001-A-PATH | Mill Creek segment (hidden limit) | 230 A rating · 120 A existing · ≈ 285 A after transfer | The scenario's core limitation. Plausible for a smaller-conductor segment; arithmetic stated consistently | Open |
| DL001-A-BANK | Cedar Flat Bank 2 loading | 58% of rating | Plausible, not limiting | Open |
| DL001-A-ALARM | Calculated segment loading alarm | "EST 285 A / 230 A (124%)" | Real systems may not present this indication; confirm it reads as a training device, not a product claim | Open |
| DL001-A-CONSEQUENCE | TIE A outcome | Customers restored; segment above rating | Consequence stated only as an over-rating condition. No claim about protection response or conductor damage | Open |
| DL001-B-SOURCE | Feeder 122 breaker loading | 360 A of 600 A (≈ 525 A after) | Plausible margin | Open |
| DL001-B-PATH | Pine Ridge trunk | 450 A rating · 180 A existing · ≈ 345 A after | Plausible | Open |
| DL001-B-BANK | Pine Ridge Bank 1 | 64% before, ≈ 73% after | Plausible | Open |
| DL001-B-VOLTAGE | Long-path voltage note | "Not modeled in DL-001" | The caveat is sufficient and does not imply TIE B is automatically acceptable on a real system | Open |
| DL001-B-CONSEQUENCE | TIE B outcome | Restored within all fictional limits; abnormal configuration noted | TIE B is a defensible preferred path given the fictional values | Open |
| DL001-C-SOURCE | Feeder 123 breaker loading | 480 A of 600 A (≈ 645 A after) | Plausible; limit visible if inspected | Open |
| DL001-C-PATH | F123 trunk | 450 A rating | Plausible, not limiting | Open |
| DL001-C-BANK | Shared bank note | F123 shares Summit Bank 1 with F120 | Stated neutrally as a teaching point | Open |
| DL001-C-ALARM | Feeder loading alarm | "EST 645 A / 600 A LIMIT" | Reads as a training indication | Open |
| DL001-C-CONSEQUENCE | TIE C outcome | Customers restored; feeder above limit | Over-limit condition only; no claim about protection response | Open |

## Scenario-level assumptions (DL-001)

These are design choices rather than single values. Each should be reviewed.

| ID | Assumption | Why it's there | Status |
|---|---|---|---|
| DL001-MODEL-1 | Energization is connectivity only. No power flow, voltage, or protection is simulated. | Keeps the lab focused on path reasoning. All electrical outcomes are scenario data. | Open |
| DL001-MODEL-2 | Isolation is two device opens with no switching order, tagging, clearance, or verification steps. | Simplified to reach the decision point in 2–4 minutes. The debrief states this is not a switching procedure. | Open |
| DL001-MODEL-3 | Only single-tie pickup of the entire load side is offered. Splitting load across ties is not an option. | Keeps one decision point. Debrief scope notes call this out. | Open |
| DL001-MODEL-4 | Information labels: breaker/feeder/ties = INDICATED; crew report = REPORTED; normal configuration and ratings = KNOWN; fault location and customer count = INFERRED; transfer estimate = INFERRED. | Demonstrates the information model. Confirm each label is defensible. | Open |
| DL001-MODEL-5 | Device naming (CB-120, SW-1201, TIE-121, Summit Sub, Cedar Flat, Pine Ridge, Mill Creek) is invented. | Must not match any real utility's identifiers or place names in its service territory. Check against partner utilities before pilots. | Open |
| DL001-MODEL-6 | Competency evidence statements are behavior-based and generated from simple rules in the config. | Confirm the wording never implies a pass/fail or measures competence. | Open |

## Release checklist

- [ ] Every row above reviewed and marked **Validated** or changed.
- [ ] Reviewer name, role, and date recorded below.
- [ ] Any changed values updated in `dl-001.ts`, and `npm test` passes.

Reviewer log:

| Date | Reviewer | Role | Items reviewed | Notes |
|---|---|---|---|---|
| | | | | |
