import Link from "next/link";
import { WhitePaperCard } from "@/components/site/Cards";
import { PageHeader, Section } from "@/components/site/Section";
import { whitepapers, type WhitePaper } from "@/lib/content/whitepapers";
import { getScenario } from "@/lib/scenarios";

export function WhitePapersView() {
  return (
    <>
      <PageHeader
        eyebrow="GridOps White Papers"
        title="Notes on the reasoning behind the work."
        intro={<p>Short pieces on restoration, information, and judgment in distribution operations. General observations, not procedures.</p>}
      />
      <Section tight>
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {whitepapers.map((a) => (
            <WhitePaperCard key={a.slug} paper={a} />
          ))}
        </ul>
      </Section>
    </>
  );
}

export function WhitePaperView({ paper }: { paper: WhitePaper }) {
  const lab = paper.relatedLab ? getScenario(paper.relatedLab) : undefined;
  const others = whitepapers.filter((a) => a.slug !== paper.slug).slice(0, 3);
  return (
    <>
      <article className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <p className="nameplate text-accent-ink">
          <Link href="/white-papers" className="hover:underline">GridOps White Papers</Link> · {paper.topic}
        </p>
        <h1 className="mt-3 max-w-4xl text-[clamp(2.1rem,5vw,3.5rem)] font-semibold">{paper.title}</h1>
        <p className="mt-4 max-w-[58ch] font-display text-[1.35rem] leading-snug text-ink-2">{paper.dek}</p>
        <p className="mt-3 text-sm text-muted">{paper.readMinutes} min read</p>
        <div className="mt-10 grid max-w-[65ch] gap-5 text-[1.1rem] leading-[1.7] text-ink">
          {paper.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {lab && (
          <aside className="on-desk mt-12 max-w-3xl rounded-[4px] bg-desk p-5 text-desk-ink sm:p-6">
            <p className="nameplate text-[0.72rem] text-[var(--accent)]">Related Decision Lab</p>
            <p className="mt-2 font-display text-2xl font-semibold">{lab.metadata.id} — {lab.metadata.title}</p>
            <p className="mt-2 text-sm text-desk-muted">{lab.metadata.summary}</p>
            <Link href={`/labs/${lab.metadata.slug}`} className="btn btn-primary mt-4">Play {lab.metadata.id}</Link>
          </aside>
        )}
      </article>
      <Section eyebrow="More White Papers" tight>
        <ul className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {others.map((a) => (
            <WhitePaperCard key={a.slug} paper={a} />
          ))}
        </ul>
      </Section>
    </>
  );
}
