import Link from "next/link";
import { PageHeader, Section, Disclaimer } from "@/components/site/Section";
import { CTA, site } from "@/lib/content/site";

export function AboutView() {
  return (
    <>
      <PageHeader
        eyebrow="About GridOps Labs"
        title="Built around a simple observation."
        intro={
          <>
            <p>Operators are often taught how systems and equipment are expected to behave.</p>
            <p>Real operations also require judgment when information conflicts, equipment behaves differently than expected, conditions change, and multiple priorities compete for attention.</p>
            <p>GridOps Labs exists to create repeatable practice around those decisions.</p>
          </>
        }
      />

      <Section eyebrow="What we believe" title="The principles behind the labs.">
        <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {[
            ["Train the gap between expected and observed.", "The hardest moments on the desk are when the system doesn't do what the training said it would. That gap is what GridOps practices."],
            ["Different grids. Different tools. Same responsibility.", "We don't teach one utility's control system. We train the thinking behind the work, so it carries from one system to the next."],
            ["Experience, made easier to transfer.", "Mentors carry context no scenario can. GridOps gives them a shared, repeatable starting point for passing it on."],
            ["Modernization and proficiency move together.", "New SCADA, ADMS, and OMS tools change what operators see. The judgment behind the decision has to keep pace."],
          ].map(([t, b]) => (
            <div key={t} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-[1.4rem] font-semibold leading-tight">{t}</dt>
              <dd className="mt-2 leading-relaxed text-ink-2">{b}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section eyebrow={site.founder.heading} tight>
        <div className="mt-4 grid max-w-[65ch] gap-4 text-[1.07rem] leading-relaxed text-ink-2">
          {site.founder.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>The work draws on a mix of distribution operations, control-system, and software experience, applied to scenario-based training. GridOps Labs is developed by Sentinel Peak Solutions.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={CTA.primary.href} className="btn btn-primary">{CTA.primary.label}</Link>
          <Link href={CTA.conversation.href} className="btn btn-ghost">{CTA.conversation.label}</Link>
        </div>
        <Disclaimer className="mt-12 max-w-3xl" text={site.disclaimer} />
      </Section>
    </>
  );
}
