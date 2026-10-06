"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Section, Disclaimer } from "@/components/site/Section";
import { EarlyAccessForm } from "@/components/lab/EarlyAccessForm";
import { InfoQualityLegend } from "@/components/lab/InfoQuality";
import { COMPETENCY_LABELS } from "@/lib/content/competencies";
import {
  catalog,
  DOMAINS,
  DOMAIN_LABEL,
  DIFFICULTY_LABEL,
  STATUS_LABEL,
  availableCount,
  type CatalogScenario,
  type DomainId,
  type Difficulty,
  type LabStatus,
} from "@/lib/content/catalog";
import { site } from "@/lib/content/site";

const STATUS_COLOR: Record<LabStatus, string> = {
  available: "var(--live)",
  "in-development": "var(--alarm)",
  planned: "var(--muted)",
};

type DomainFilter = "all" | DomainId;
type DiffFilter = "all" | Difficulty;

export function DecisionLabsView() {
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [difficulty, setDifficulty] = useState<DiffFilter>("all");

  const results = useMemo(
    () => catalog.filter((s) => (domain === "all" || s.domain === domain) && (difficulty === "all" || s.difficulty === difficulty)),
    [domain, difficulty],
  );
  const featured = catalog.filter((s) => s.image);

  return (
    <>
      <PageHeader
        eyebrow="Scenario Library"
        title="One grid. Dozens of problems."
        intro={
          <>
            <p>A curriculum of short Decision Labs on Summit Grid, each built around one operating judgment call — the problems that don&apos;t happen often enough to train on when they finally do.</p>
            <p>50+ scenarios planned across eight operational domains, three difficulty levels, and six competency areas. {availableCount === 1 ? "One is playable today" : `${availableCount} are playable today`}; the rest are in development or on the roadmap.</p>
          </>
        }
      />

      {/* Curriculum stats */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-rule bg-rule sm:grid-cols-4">
          {[
            ["50+", "Scenarios planned"],
            ["8", "Operational domains"],
            ["3", "Difficulty levels"],
            ["6", "Competency areas"],
          ].map(([n, l]) => (
            <div key={l} className="bg-surface p-4">
              <dt className="mono text-2xl font-semibold text-ink">{n}</dt>
              <dd className="mt-0.5 text-sm text-ink-2">{l}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Featured concept art */}
      <Section id="featured" eyebrow="A look at the labs" title="A few of the situations you'll practice." tight
        intro={<p>Concept scenes from Summit Grid. Each lab puts you on the desk for one of these moments.</p>}>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {featured.map((s) => (
            <FeaturedCard key={s.id} s={s} />
          ))}
        </ul>
      </Section>

      <Section id="library" eyebrow="Browse" title="The full curriculum." tight>
        {/* Filters */}
        <div className="grid gap-4">
          <FilterRow label="Domain">
            <Chip active={domain === "all"} onClick={() => setDomain("all")}>All</Chip>
            {DOMAINS.map((d) => (
              <Chip key={d.id} active={domain === d.id} onClick={() => setDomain(d.id)}>
                {d.short}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Level">
            <Chip active={difficulty === "all"} onClick={() => setDifficulty("all")}>All</Chip>
            {(["foundational", "operational", "advanced"] as Difficulty[]).map((d) => (
              <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                {DIFFICULTY_LABEL[d]}
              </Chip>
            ))}
          </FilterRow>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "scenario" : "scenarios"}
          {domain !== "all" ? ` · ${DOMAIN_LABEL[domain]}` : ""}
          {difficulty !== "all" ? ` · ${DIFFICULTY_LABEL[difficulty]}` : ""}
        </p>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <ScenarioCard key={s.id} s={s} />
          ))}
        </ul>
        {results.length === 0 && <p className="mt-6 text-ink-2">No scenarios match that combination yet.</p>}
      </Section>

      <Section id="information" eyebrow="The information model" title="Every piece of information says where it came from."
        intro={<p>Decision Labs label information by its source. The labels aren&apos;t a ranking of trust — they make it easier to notice what a decision is resting on.</p>} tight>
        <div className="mt-8 max-w-3xl rounded-[3px] border border-rule bg-surface p-5">
          <InfoQualityLegend tone="page" />
        </div>
      </Section>

      <Section id="field-test" eyebrow="GridOps Field Test" title="Get told when the next lab is ready." tight
        intro={<p>We release Decision Labs as they&apos;re built. Leave an email to hear when the next one is playable. You never need an address to play.</p>}>
        <div className="mt-6 max-w-xl">
          <EarlyAccessForm tone="page" idPrefix="ea-labs" />
        </div>
        <Disclaimer className="mt-12 max-w-3xl" text={site.disclaimer} />
      </Section>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="nameplate mr-1 w-16 flex-none text-[0.7rem] text-muted">{label}</span>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[38px] rounded-[3px] border px-3 text-sm transition-colors ${
        active ? "border-ink bg-ink text-bg" : "border-rule-strong text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FeaturedCard({ s }: { s: CatalogScenario }) {
  const playable = s.status === "available" && s.slug;
  return (
    <li className="flex flex-col overflow-hidden rounded-[4px] border border-rule bg-surface">
      <div className="relative aspect-video overflow-hidden border-b border-rule bg-desk">
        {/* Story-layer concept art — scene-setting only, not the interactive one-line. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.image} alt={s.imageAlt ?? s.title} width={1200} height={675} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <span
          className="nameplate absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[2px] border bg-[color-mix(in_srgb,#0d161c_80%,transparent)] px-1.5 py-0.5 text-[0.62rem]"
          style={{ color: STATUS_COLOR[s.status], borderColor: STATUS_COLOR[s.status] }}
        >
          <span aria-hidden="true">{s.status === "available" ? "●" : s.status === "in-development" ? "◐" : "○"}</span>
          {STATUS_LABEL[s.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="mono text-xs text-muted">{s.id}</span>
          <span className="mono text-[0.7rem] uppercase tracking-wide text-muted">{DOMAIN_LABEL[s.domain]} · {DIFFICULTY_LABEL[s.difficulty]}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[1.3rem] font-semibold leading-tight text-ink">{s.title}</h3>
        <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">{s.summary}</p>
        <div className="mt-4">
          {playable ? (
            <Link href={`/labs/${s.slug}`} className="btn btn-ink min-h-[40px] px-4 text-sm">Try lab</Link>
          ) : (
            <span className="text-sm text-muted">{s.status === "in-development" ? "In development" : "Planned"}</span>
          )}
        </div>
      </div>
    </li>
  );
}

function ScenarioCard({ s }: { s: CatalogScenario }) {
  const playable = s.status === "available" && s.slug;
  return (
    <li className="group relative flex flex-col rounded-[3px] border border-rule bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="mono text-xs text-muted">{s.id}</span>
        <span
          className="nameplate inline-flex items-center gap-1.5 rounded-[2px] border px-1.5 py-0.5 text-[0.62rem]"
          style={{ color: STATUS_COLOR[s.status], borderColor: STATUS_COLOR[s.status] }}
        >
          <span aria-hidden="true">{s.status === "available" ? "●" : s.status === "in-development" ? "◐" : "○"}</span>
          {STATUS_LABEL[s.status]}
        </span>
      </div>

      <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-tight text-ink">
        {playable ? (
          <Link href={`/labs/${s.slug}`} className="after:absolute after:inset-0 hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4">
            {s.title}
          </Link>
        ) : (
          s.title
        )}
      </h3>

      <p className="mono mt-1 text-[0.7rem] uppercase tracking-wide text-muted">
        {DOMAIN_LABEL[s.domain]} · {DIFFICULTY_LABEL[s.difficulty]}
      </p>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-2">{s.summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {s.competencies.slice(0, 3).map((c) => (
          <li key={c} className="rounded-[2px] border border-rule px-1.5 py-0.5 text-[0.68rem] text-muted">
            {COMPETENCY_LABELS[c].name}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {playable ? (
          <span className="btn btn-ink min-h-[40px] px-4 text-sm">Try lab</span>
        ) : (
          <span className="text-sm text-muted">{s.status === "in-development" ? "In development" : "Planned"}</span>
        )}
      </div>
    </li>
  );
}
