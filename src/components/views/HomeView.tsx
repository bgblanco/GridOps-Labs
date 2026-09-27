import Link from "next/link";
import { DecisionLabShell } from "@/components/lab/DecisionLabShell";
import { ChallengeCard } from "@/components/site/ChallengeCard";
import { HeroFeeder } from "@/components/site/HeroFeeder";
import { Section } from "@/components/site/Section";
import { SummitGridMap } from "@/components/site/SummitGridMap";
import { UtilityUseCaseCard } from "@/components/site/Cards";
import { challenges } from "@/lib/content/challenges";
import { COMPETENCY_LABELS, COMPETENCY_ORDER } from "@/lib/content/competencies";
import { CTA } from "@/lib/content/site";
import { homeUseCases } from "@/lib/content/useCases";
import { dl001 } from "@/lib/scenarios/dl-001";

export function HomeView() {
  return (
    <>
      {/* 1 — Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="nameplate text-accent-ink">Distribution operator training</p>
          <h1 className="mt-3 text-[clamp(2.5rem,6.2vw,4.3rem)] font-semibold leading-[1.02] text-ink">
            Practice the decisions before they happen on the desk.
          </h1>
          <p className="mt-5 font-display text-[1.35rem] font-medium leading-snug text-ink-2">Scenario-based proficiency training for electric distribution operations.</p>
          <p className="mt-4 max-w-[58ch] text-[1.05rem] leading-relaxed text-ink-2">
            GridOps Labs gives developing and experienced operators repeated practice working through restoration, abnormal conditions, conflicting information, loading, system configuration, and competing priorities.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#decision-lab" className="btn btn-primary">
              {CTA.primary.label}
            </Link>
            <Link href="/for-utilities" className="btn btn-ghost">
              For Utility Training Teams
            </Link>
          </div>
        </div>
        <HeroFeeder />
      </section>

      {/* 2 — Problem */}
      <Section
        id="problem"
        eyebrow="Why repetition"
        title="Some lessons shouldn't depend on waiting for the right outage."
        intro={
          <>
            <p>Operators learn an enormous amount on shift: from real events, from mentors, from on-the-job training. That experience can&apos;t be replaced.</p>
            <p>But the abnormal, rare, and high-value situations don&apos;t arrive on a training schedule. An apprentice might go a year without seeing the event that would have taught them the most.</p>
            <p>GridOps creates that exposure on purpose, as a repetition layer alongside the training utilities already run.</p>
          </>
        }
      />

      {/* 3 — Decision Lab */}
      <section id="decision-lab" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-24" aria-labelledby="lab-intro">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="nameplate text-accent-ink">Public Decision Lab</p>
            <h2 id="lab-intro" className="mt-2 text-[clamp(1.9rem,4.2vw,2.8rem)] font-semibold">
              Take the desk for one event.
            </h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-2">
              A feeder locks out on a fictional system. You assess, isolate, restore, and decide. Then you see what your decision did, and why. About {dl001.metadata.estimatedMinutes[0]}–{dl001.metadata.estimatedMinutes[1]} minutes. No account.
            </p>
          </div>
        </div>
        <DecisionLabShell scenario={dl001} headingLevel={3} />
      </section>

      {/* 4 — How it works */}
      <Section id="how" eyebrow="How GridOps works" title="Encounter. Decide. Understand.">
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            ["Encounter", "Experience an operating situation."],
            ["Decide", "Evaluate available information and make an operating decision."],
            ["Understand", "Review the consequences, assumptions, and reasoning behind the decision."],
          ].map(([t, b], i) => (
            <li key={t} className="border-t-2 border-ink pt-4">
              <p className="mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.04em]">{t}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5 — What we train */}
      <Section
        id="train"
        eyebrow="What we train"
        title="Six areas of operating judgment."
        intro={<p>Each Decision Lab looks for evidence in a few of these. No single scenario measures any of them on its own.</p>}
      >
        <dl className="mt-10 grid gap-px overflow-hidden rounded-[3px] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {COMPETENCY_ORDER.map((c) => (
            <div key={c} className="bg-surface p-5">
              <dt className="nameplate text-ink">{COMPETENCY_LABELS[c].name}</dt>
              <dd className="mt-2 text-[0.97rem] leading-relaxed text-ink-2">{COMPETENCY_LABELS[c].description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 6 — Summit Grid */}
      <Section id="summit-grid" eyebrow="The training environment" title="Summit Grid">
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="grid gap-4 text-[1.05rem] leading-relaxed text-ink-2">
            <p>Summit Grid is GridOps Labs&apos; fictional electric distribution training environment, operated by a fictional utility, Summit Electric.</p>
            <p>It&apos;s intentionally simplified where simplification helps learning. It isn&apos;t based on any one utility&apos;s SCADA, ADMS, maps, procedures, or equipment identifiers.</p>
            <p>That&apos;s what lets the reasoning transfer. Complexity is added progressively: training views first, then more realistic operating views with ratings, alarms, and competing information.</p>
            <p className="text-sm text-muted">We don&apos;t teach one utility&apos;s control system. We train the thinking behind the work.</p>
          </div>
          <div className="diagram-scroll rounded-[3px] border border-rule">
            <SummitGridMap />
          </div>
        </div>
      </Section>

      {/* 7 — Experience transfer */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6" aria-labelledby="transfer-title">
        <h2 id="transfer-title" className="max-w-4xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
          GridOps doesn&apos;t replace experienced operators. <span className="text-muted">It makes their experience easier to transfer.</span>
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            ["Experienced mentors provide", ["Local context", "Procedure", "Nuance", "Judgment", "Coaching"]],
            ["GridOps provides", ["Structured repetition", "Scenario exposure", "Consistent practice", "Replay", "Feedback", "A common training environment"]],
          ].map(([h, items]) => (
            <div key={h as string} className="border-t-2 border-ink pt-4">
              <h3 className="nameplate text-ink">{h as string}</h3>
              <ul className="mt-3 grid gap-1.5 text-[1.05rem] text-ink-2">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 8 — For utilities */}
      <Section id="utilities" eyebrow="For utility training teams" title="Where GridOps fits in a training program.">
        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {homeUseCases.map((u) => (
            <UtilityUseCaseCard key={u.title} useCase={u} />
          ))}
        </ul>
        <div className="mt-10">
          <Link href={CTA.secondary.href} className="btn btn-ink">
            {CTA.secondary.label}
          </Link>
        </div>
      </Section>

      {/* 9 — You're the operator */}
      <Section id="operator" eyebrow="You're the operator" title="One question. What would you do?">
        <div className="mt-8">
          <ChallengeCard challenge={challenges[0]} />
        </div>
      </Section>

      {/* 10 — Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <div className="on-desk rounded-[4px] bg-desk px-5 py-12 text-desk-ink sm:px-10 sm:py-16">
          <h2 className="max-w-3xl text-[clamp(2rem,4.8vw,3.2rem)] font-semibold leading-[1.05]">
            You can&apos;t schedule the next difficult operating condition. <span className="text-[var(--accent)]">You can practice for it.</span>
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#decision-lab" className="btn btn-primary">
              {CTA.primary.label}
            </Link>
            <Link href={CTA.conversation.href} className="btn btn-desk">
              {CTA.conversation.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
