import Link from "next/link";
import { ChallengeCard } from "@/components/site/ChallengeCard";
import { PageHeader, Section } from "@/components/site/Section";
import type { Challenge } from "@/lib/content/challenges";
import { challenges } from "@/lib/content/challenges";

export function ChallengeView() {
  return (
    <>
      <PageHeader
        eyebrow="You're the operator"
        title="Public challenges"
        intro={<p>One situation, one question. There&apos;s no score. Pick an answer, then play the full scenario to see where it leads.</p>}
      />
      <Section tight>
        <ul className="grid gap-8">
          {challenges.map((c) => (
            <li key={c.id}>
              <ChallengeCard challenge={c} />
              <p className="mt-2 text-sm text-muted">
                <Link href={`/challenge/${c.id}`} className="underline underline-offset-4">Link to this challenge</Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function ChallengeDetailView({ challenge }: { challenge: Challenge }) {
  return (
    <>
      <PageHeader eyebrow="You're the operator" title={challenge.headline} />
      <Section tight>
        <ChallengeCard challenge={challenge} headingLevel={2} />
        <p className="mt-6">
          <Link href="/challenge" className="text-ink-2 underline underline-offset-4">All challenges</Link>
        </p>
      </Section>
    </>
  );
}
