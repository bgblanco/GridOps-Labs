import Link from "next/link";
import { PageHeader, Section, Disclaimer } from "@/components/site/Section";
import { UtilityUseCaseCard } from "@/components/site/Cards";
import { utilityPageUseCases } from "@/lib/content/useCases";
import { CTA, site } from "@/lib/content/site";

export function ForUtilitiesView() {
  return (
    <>
      <PageHeader
        eyebrow="For utility training teams"
        title="A repetition layer for the decisions your operators don't see often enough."
        intro={
          <>
            <p>GridOps Labs builds scenario-based practice for distribution system operators. It sits alongside your qualification program, your mentors, and your procedures. It doesn&apos;t replace any of them.</p>
            <p>What it adds is exposure: structured, repeatable practice on restoration, abnormal conditions, conflicting information, and competing priorities, in a fictional environment where nothing real is at stake.</p>
          </>
        }
      />
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6">
        <Link href={CTA.conversation.href} className="btn btn-ink uppercase tracking-[0.06em]">
          {CTA.conversation.label}
        </Link>
        <Link href="/labs/dl-001" className="btn btn-ghost">
          Play DL-001 first
        </Link>
      </div>

      <Section id="support" eyebrow="What GridOps can support" title="Ways training teams can use it">
        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {utilityPageUseCases.map((u) => (
            <UtilityUseCaseCard key={u.title} useCase={u} />
          ))}
        </ul>
      </Section>

      <Section id="boundaries" eyebrow="Clear boundaries" title="What GridOps is not" tight>
        <ul className="mt-8 grid max-w-3xl gap-3 text-[1.05rem] leading-relaxed text-ink-2">
          {[
            "Not a qualification program. Your utility decides who is qualified to operate.",
            "Not a switching procedure or operating instruction. Scenarios teach reasoning on a fictional system.",
            "Not a replacement for SCADA, ADMS, or OMS vendor training, or for full operator training simulators.",
            "Not a copy of your system. Summit Grid is fictional so the reasoning transfers and your information stays yours.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden="true" className="mono text-muted">—</span>
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="learn-practice" eyebrow="Where it fits" title="Learn the concept. Practice the decision.">
        <div className="mt-8 grid gap-4 text-[1.05rem] leading-relaxed text-ink-2">
          <p className="max-w-[68ch]">GridOps Labs combines structured digital learning with operational practice. Foundational content can be delivered through Articulate 360 and Rise 360, then reinforced through Decision Labs inside Summit Grid — concept first, judgment second, debrief last.</p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[3px] border border-rule bg-rule md:grid-cols-3">
          {[
            ["Learn", "Concepts, terminology, equipment behavior, and operating principles — Articulate 360 / Rise 360."],
            ["Practice", "Grid state, SCADA, field reports, alarms, loading, and real operating decisions inside Decision Labs."],
            ["Debrief", "Consequences, information sources, assumptions, competencies, and reasoning."],
          ].map(([t, b]) => (
            <div key={t} className="bg-surface p-5">
              <h3 className="nameplate text-ink">{t}</h3>
              <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-2">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pilot" tone="raised" eyebrow="GridOps Pilot" title="A focused way to evaluate the method with your operators.">
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-4 text-[1.05rem] leading-relaxed text-ink-2">
            <p>A GridOps Pilot is a short, bounded engagement — roughly six to eight weeks — for a selected operator cohort to work through curated Decision Labs and discuss the reasoning together.</p>
            <p>Scope and terms are set with each utility. The goal is a clear, shared read on where scenario-based deliberate practice fits alongside your qualification program, mentors, and simulators.</p>
          </div>
          <div className="rounded-[3px] border border-rule bg-bg p-5">
            <h3 className="nameplate text-ink">Possible scope</h3>
            <ul className="mt-3 grid gap-2.5 text-[0.98rem] text-ink-2">
              {[
                "A selected operator cohort",
                "A curated set of Decision Labs",
                "Facilitator support for discussion",
                "Scenario and competency observations",
                "Operator feedback collected throughout",
                "A findings discussion at the end",
              ].map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="mono text-[var(--accent-ink)]">—</span>
                  {s}
                </li>
              ))}
            </ul>
            <Link href={CTA.pilot.href} className="btn btn-ink mt-5 w-full uppercase tracking-[0.06em]">
              {CTA.pilot.label}
            </Link>
          </div>
        </div>
        <Disclaimer className="mt-12 max-w-3xl" text={site.disclaimer} />
      </Section>
    </>
  );
}
