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

**Story layer** — restrained pixel scenes (storm, substation, crew, dark houses). Scene-setting only. Never carries information that must be read precisely.

## Palette

Tokens are in `src/app/globals.css`. Light and dark themes redefine the same tokens.

| Token | Light | Use |
|---|---|---|
| `--bg` | `#edf0f0` | Page ground, cool drafting vellum |
| `--surface` | `#f8fafa` | Raised panels on the page |
| `--ink` | `#0f1b24` | Text and rules |
| `--desk` / `--desk-2` | `#0d161c` / `#14212a` | Operating desk panels (hero, labs). Dark in both themes. |
| `--accent` | `#f0b429` | Hard-hat amber. Primary buttons and emphasis on the desk. On light pages, amber is a fill only; amber text uses `--accent-ink`. |
| `--live` | `#57c7b1` | Energized |
| `--dead` | `#53646e` | De-energized (always dashed as well) |
| `--fault` | `#ec6a43` | Fault, limit exceeded |
| `--alarm` | `#f0b429` | Caution |

State is never color-only: de-energized lines are dashed, devices show OPEN/CLOSED text, information labels carry glyphs (■ ● ▲ ◆ ○), alarms carry ▲/◆.

## Type

- **Barlow Semi Condensed** — headlines and nameplate labels (uppercase, tracked), echoing equipment tags.
- **IBM Plex Sans** — body.
- **IBM Plex Mono** — device ids, clock, values, anything that lines up.
- **Silkscreen** — pixel captions in the story layer only.

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

## Don'ts

No stock photos, photorealistic linemen, neon grids, heavy gradients, glassmorphism, or dashboard clutter. No real utility screens, one-lines, naming schemes, or procedures.
