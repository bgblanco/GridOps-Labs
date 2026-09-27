# GridOps Labs

Website and public Decision Lab (DL-001 — The Easy Tie) for GridOps Labs, scenario-based proficiency training for electric distribution operators.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also type-checks and lints)
npm run typecheck
npm run lint
npm test             # engine branch tests + SME register check
```

Node 20+. Deploys as a standard Next.js app (e.g. Vercel). All pages are statically generated.

## Configuration

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SUBMIT_ENDPOINT` — optional. When set, feedback, Field Test sign-ups, and contact messages are POSTed as JSON (`{ kind, scenarioId, createdAt, data }`) to this URL. When unset, they're kept in the visitor's browser only and the UI says so.
- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata and the sitemap.

## Where things live

```
src/app/                    routes (thin wrappers around views)
src/components/views/       page content
src/components/site/        header, footer, hero animation, cards, Summit Grid map
src/components/lab/         Decision Lab UI (shell, one-line, panels, forms)
src/lib/scenario/           schema, engine, topology (energization)
src/lib/scenarios/          scenario data: dl-001.ts, registry
src/lib/analytics/          event names, pluggable tracker, engine-log observer
src/lib/submissions/        local / HTTP submission sink
src/lib/content/            site copy, white papers, challenges, use cases
docs/                       schema, DL-001 design, brand, SME validation register
tests/engine.test.ts        every DL-001 branch, reset, SME coverage
```

## Editing content

- Scenario values, text, and consequences: `src/lib/scenarios/dl-001.ts`. Mark anything needing expert review with `sme(...)` and list it in `docs/technical-validation.md`.
- Founder note and site-wide copy: `src/lib/content/site.ts`.
- White papers: `src/lib/content/whitepapers.ts`.

## Analytics

Events (`scenarioStarted`, `informationViewed`, `tieDetailsViewed`, `selectedTie`, `decisionReason`, `feedbackSubmitted`, …) go to a bounded sessionStorage buffer by default. Register another adapter with `registerAnalyticsAdapter()` to forward them. No personal data is collected.

## Disclaimer

Summit Grid is a fictional training environment. GridOps Labs provides educational training content and does not replace employer operating procedures, qualification requirements, safety rules, or authorization to operate electrical systems.
