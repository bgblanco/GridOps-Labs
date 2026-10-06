# Brand and UI principles

## Voice

Written by someone who has worked the desk. Direct sentences. Plain words.

- Say "Practice difficult operating decisions," not "Leverage a multidimensional competency ecosystem."
- Never: revolutionary, groundbreaking, game-changing, industry-leading, best-in-class, AI-powered.
- Never invent customers, testimonials, logos, statistics, partnerships, results, certifications, or endorsements.
- Don't criticize utility training. GridOps is a repetition layer alongside it.
- Summit Electric and Summit Grid are always identified as fictional.

## Two visual layers

**Technical layer** — the one-line, device states, values, alarms, information labels. Crisp vectors, mono numerals, exact labels. Anything a learner reasons from lives here.

**Story layer** — illustrated scene-setting art (e.g. the Summit Grid hero and scenario concept images in `public/scenarios`). Static images, scene-setting only. Never carries information that must be read precisely; the interactive one-line is the technical layer.

## Palette

Tokens are in `src/app/globals.css`. Light and dark themes redefine the same tokens.

| Token | Light | Use |
|---|---|---|
| `--bg` | `#edf0f0` | Page ground, cool drafting vellum |
| `--surface` | `#f8fafa` | Raised panels on the page |
| `--ink` | `#0f1b24` | Text and rules |
| `--desk` / `--desk-2` | `#0d161c` / `#14212a` | Operating desk panels (hero, labs). Dark in both themes. |
| `--accent` | `#f0b429` | Hard-hat amber. Primary buttons and emphasis on the desk. On light pages, amber is a fill only; amber text uses `--accent-ink`. |
| `--live` | `#57c7b1` | Energized / healthy |
| `--dead` | `#53646e` | De-energized (always dashed as well) |
| `--fault` | `#ec6a43` | Fault, limit exceeded |
| `--alarm` | `#f0b429` | Caution / attention |
| `--select` | `#3d7fe0` | Learner selection / inspection — the map path highlight |
| `--q-inferred` / `--q-assumed` | purples | Inferred / assumed information |

### Semantic color rule

Color communicates meaning; it is not decoration. Every strong color answers **"why is this
colored?"** — energized, de-energized, fault, caution, selection/inspection, or an
information-quality badge. If there is no semantic reason, the element stays neutral
(charcoal / off-white / the desk greys). We do not turn the one-line into rainbow SCADA.

State is never color-only: de-energized lines are dashed, devices show OPEN/CLOSED text,
information labels carry glyphs (■ ● ▲ ◆ ○), alarms carry ▲/◆, and an inspected restoration
path is drawn as a distinct blue glow **and** described in the diagram's `<desc>`.

## Type

- **Barlow Semi Condensed** — headlines and nameplate labels (uppercase, tracked), echoing equipment tags.
- **IBM Plex Sans** — body.
- **IBM Plex Mono** — device ids, clock, values, anything that lines up.

## Layout

- Pages read like an operations binder: left-aligned, generous, section eyebrows as nameplates.
- The desk panel is the one strong object on each page. Everything around it stays quiet.
- Cards only where an element is a separate object (a tie, an alarm, a report). Lists of use cases and articles are rule-topped, not boxed.

## Interaction and accessibility

- 44–48px minimum touch targets. Visible focus rings (blue on page, amber on desk).
- Devices on the one-line are keyboard-operable and duplicated in a plain device list.
- The one-line scrolls horizontally inside its own container on small screens; the page never does.
- Motion is limited to energized flow, the fault pulse, the lockout transition, and the consequence sequence. All of it stops under `prefers-reduced-motion`.
- Forms warn against confidential or utility-specific information above the first field.

## Visual modes: editorial vs. operational

The site is not one endless dark interface. Two modes, chosen by content:

- **Editorial (light).** Marketing and explanatory content — the homepage problem/how/
  competencies/for-utilities bands, White Papers, About. Light neutral surfaces
  (`--bg` / `--surface`), generous whitespace, easy reading. `Section tone="raised"` renders
  a full-bleed light editorial band; the default `page` tone is flush on the page ground.
- **Operational (dark).** The Decision Lab and desk panels use the dark operating workspace
  (`--desk*`). The dark interface means one thing psychologically: **you are now operating.**
  Leaving the lab / debrief returns to the editorial site style.

A `Section` is never dark; the dark treatment is reserved for the lab and `on-desk` panels.

## Decision Lab conventions

The one-line is the **primary teaching surface**, not decoration. When a learner's action
changes the grid, the change must be shown, focused, and explained.

- **Layout.** Desktop is a two-column operational workspace: a sticky left column (Current
  Objective, status strip, state announcement, the one-line, and an optional Before/Current
  comparison) beside a scrolling right column (situation, information, controls,
  consequence). A compact System Changes feed runs full-width beneath. Mobile stacks to one
  column with a collapsible sticky map that auto-focuses after a meaningful change.
- **Current Objective.** A persistent short line ("Isolate the reported faulted section")
  driven by `phase.objective`. The learner always knows what they're trying to do now.
- **Progress rail.** Reads as a switching sequence (completed ✓ / current / upcoming), not a
  gaming progress bar.
- **Map state, glanceable.** Energized = solid teal + flow; de-energized = dashed slate;
  fault = orange-red pulse; selected/inspected path = blue glow; caution/limit = amber. Open
  vs. closed is also shown by switch-blade geometry and OPEN/CLOSED text.
- **Friendly labels.** In `viewLevel: "training"`, devices show a dominant friendly label
  (e.g. *North Isolation*, *Near Tie*) with the asset id (`SW-1201`, `TIE-121`) beneath.
  Friendly labels are presentation only (`trainingLabel` on the edge/option); the underlying
  identifiers never change, so advanced views can expose raw asset ids.
- **State-change feedback.** A meaningful electrical change (device operation or outcome)
  triggers: a ~1s blue change-focus ring on the changed device, an aria-live "System state
  updated" announcement, and a new row in the System Changes feed (built from the engine log
  via `systemChanges`, never hard-coded). Info views and selections do **not** trigger this.
- **Restoration-path inspection.** All ties read as AVAILABLE and are never pre-colored — the
  scenario trains *available ≠ suitable*. Inspecting a tie lights its complete fictional
  source→tie→interrupted-load path in blue (`pathGroups`) and reveals the existing
  inspection data; it does not reveal the hidden limitation before the learner looks.
- **Consequence-driven feedback.** No "correct/incorrect". The map updates first, then a
  short "New condition" status, then the explanation ("What did you miss?" for a limited
  outcome). The system teaches the result.

## Motion

Motion is limited to energized flow, the fault pulse, the lockout transition, the
consequence sequence, and the one-shot change-focus ring / state-update entry. All motion
stops under `prefers-reduced-motion`; reduced motion keeps the change ring visible as a
static highlight plus the text announcement, so cause→effect is never motion-only.

## Don'ts

No stock photos, photorealistic linemen, neon grids, heavy gradients, glassmorphism, or dashboard clutter. No real utility screens, one-lines, naming schemes, or procedures. No rainbow SCADA — strong color only where it carries meaning.
