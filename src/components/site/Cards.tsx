import Link from "next/link";
import type { WhitePaper } from "@/lib/content/whitepapers";
import type { UseCase } from "@/lib/content/useCases";

export function UtilityUseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <li className="border-t border-rule-strong pt-4">
      <h3 className="font-display text-[1.2rem] font-semibold">{useCase.title}</h3>
      <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink-2">{useCase.body}</p>
    </li>
  );
}

export function WhitePaperCard({ paper }: { paper: WhitePaper }) {
  return (
    <li className="group relative flex flex-col border-t border-rule-strong pt-4">
      <p className="nameplate text-muted">
        {paper.topic} · {paper.readMinutes} min read
      </p>
      <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-tight">
        <Link href={`/white-papers/${paper.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-[var(--accent)] group-hover:decoration-2 group-hover:underline-offset-4">
          {paper.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-2">{paper.dek}</p>
    </li>
  );
}
