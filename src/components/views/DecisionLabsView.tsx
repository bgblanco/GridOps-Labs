import Link from "next/link";
import { PageHeader, Section, Disclaimer } from "@/components/site/Section";
import { EarlyAccessForm } from "@/components/lab/EarlyAccessForm";
import { InfoQualityLegend } from "@/components/lab/InfoQuality";
import { COMPETENCY_LABELS } from "@/lib/content/competencies";
import { plannedLabs, scenarios } from "@/lib/scenarios";
import { site } from "@/lib/content/site";

export function DecisionLabsView() {
  return (
    <>
      <PageHeader
        eyebrow="Decision Labs"
        title="Short operating scenarios built around one judgment call."
        intro={
          <>
            <p>A Decision Lab puts you on the desk for a single event on Summit Grid. You gather information, make a decision, and see what it does. Then you review what you looked at, what you didn&apos;t, and why the outcome went the way it did.</p>
            <p>Every lab has to contain at least one real judgment element: a reasonable choice that turns out poorly, an obvious option with a hidden consequence, information that&apos;s incomplete unless you look for it, or a good reason to wait. If a scenario can be answered by recalling a rule, it isn&apos;t a Decision Lab.</p>
          </>
        }
      />

      <Section id="available" eyebrow="Available now" title="Public beta" tight>
        <ul className="mt-8 grid gap-4">
          {scenarios.map((s) => (
            <li key={s.metadata.id} className="on-desk grid gap-5 rounded-[4px] border border-desk-rule bg-desk-2 p-5 text-desk-ink sm:p-7 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="nameplate text-[0.72rem] text-[var(--accent)]">{s.metadata.series} · Public beta</p>
                <h3 className="mt-2 font-display text-3xl font-semibold">
                  {s.metadata.id} — {s.metadata.title}
                </h3>
                <p className="mt-3 max-w-[58ch] leading-relaxed text-desk-muted">{s.metadata.summary}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/labs/${s.metadata.slug}`} className="btn btn-primary">
                    Start {s.metadata.id}
                  </Link>
                </div>
              </div>
              <dl className="grid content-start gap-3 text-sm">
                <div>
                  <dt className="text-desk-muted">Time</dt>
                  <dd>{s.metadata.estimatedMinutes[0]}–{s.metadata.estimatedMinutes[1]} minutes</dd>
                </div>
                <div>
                  <dt className="text-desk-muted">Environment</dt>
                  <dd>{s.environment.grid} (fictional) · Training view</dd>
                </div>
                <div>
                  <dt className="text-desk-muted">Evidence looked for</dt>
                  <dd>{s.metadata.competencies.map((c) => COMPETENCY_LABELS[c].name).join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-desk-muted">Judgment element</dt>
                  <dd>{s.metadata.judgmentElements[0]}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="in-development" eyebrow="In development" title="Scenario concepts we're building next" tight
        intro={<p>These are planned concepts, not yet playable. Field Test feedback shapes which ones come first.</p>}>
        <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {plannedLabs.map((l) => (
            <li key={l.id} className="border-t border-rule-strong pt-4">
              <p className="mono text-sm text-muted">{l.id} · Concept</p>
              <h3 className="mt-1 font-display text-[1.4rem] font-semibold">{l.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-2">{l.premise}</p>
              <p className="mt-2 text-sm text-muted">{l.judgment}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="information" eyebrow="The information model" title="Every piece of information says where it came from."
        intro={<p>Decision Labs label information by its source. The labels aren&apos;t a ranking of trust. They make it easier to notice what a decision is resting on.</p>} tight>
        <div className="mt-8 max-w-3xl rounded-[3px] border border-rule bg-surface p-5">
          <InfoQualityLegend tone="page" />
        </div>
      </Section>

      <Section id="field-test" eyebrow="GridOps Field Test" title="Join GridOps Field Test" tight
        intro={<p>Get an email when the next Decision Lab is ready to try. You never need an address to play.</p>}>
        <div className="mt-6 max-w-xl">
          <EarlyAccessForm tone="page" idPrefix="ea-labs" />
        </div>
        <Disclaimer className="mt-12 max-w-3xl" text={site.disclaimer} />
      </Section>
    </>
  );
}
