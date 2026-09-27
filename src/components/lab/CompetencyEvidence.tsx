import type { CompetencyId } from "@/lib/scenario/schema";
import { COMPETENCY_LABELS } from "@/lib/content/competencies";

export interface EvidenceBlock {
  competency: CompetencyId;
  observations: { text: string; tone: "strength" | "gap" | "neutral" }[];
}

const TONE = {
  strength: { glyph: "+", label: "Observed", color: "var(--live)" },
  gap: { glyph: "△", label: "To look at", color: "var(--alarm)" },
  neutral: { glyph: "·", label: "Noted", color: "var(--desk-muted)" },
};

export function CompetencyEvidence({ blocks }: { blocks: EvidenceBlock[] }) {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-[3px] border border-desk-rule bg-desk-rule sm:grid-cols-2">
        {blocks.map((b) => (
          <section key={b.competency} className="bg-desk p-4">
            <h4 className="nameplate text-desk-ink">{COMPETENCY_LABELS[b.competency].name}</h4>
            {b.observations.length ? (
              <ul className="mt-2 grid gap-2">
                {b.observations.map((o, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-desk-ink">
                    <span aria-hidden="true" className="mono flex-none" style={{ color: TONE[o.tone].color }}>
                      {TONE[o.tone].glyph}
                    </span>
                    <span>
                      <span className="sr-only">{TONE[o.tone].label}: </span>
                      {o.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-desk-muted">No specific behavior observed for this area in this run.</p>
            )}
          </section>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-desk-muted">
        These are observations of what you did in one short scenario. They are not scores, and one scenario does not measure competence.
      </p>
    </div>
  );
}
