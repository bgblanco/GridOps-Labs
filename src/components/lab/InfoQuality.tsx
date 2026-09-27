import type { InfoQuality } from "@/lib/scenario/schema";

export const QUALITY_META: Record<InfoQuality, { color: string; glyph: string; meaning: string }> = {
  KNOWN: { color: "var(--q-known)", glyph: "■", meaning: "Established by record or direct confirmation" },
  INDICATED: { color: "var(--q-indicated)", glyph: "●", meaning: "What the control system shows" },
  REPORTED: { color: "var(--q-reported)", glyph: "▲", meaning: "Someone told you" },
  INFERRED: { color: "var(--q-inferred)", glyph: "◆", meaning: "Worked out from other information" },
  ASSUMED: { color: "var(--q-assumed)", glyph: "○", meaning: "Taken as true without checking" },
};

/** Information-quality chip. Glyph + text, so color is never the only signal. */
export function InfoQualityChip({ quality, size = "sm" }: { quality: InfoQuality; size?: "sm" | "md" }) {
  const m = QUALITY_META[quality];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border font-display font-semibold uppercase tracking-[0.12em] ${size === "md" ? "px-2 py-1 text-[0.8rem]" : "px-1.5 py-0.5 text-[0.7rem]"}`}
      style={{ color: m.color, borderColor: m.color }}
      title={m.meaning}
    >
      <span aria-hidden="true">{m.glyph}</span>
      {quality}
    </span>
  );
}

export function InfoQualityLegend({ show = ["KNOWN", "INDICATED", "REPORTED", "INFERRED", "ASSUMED"], tone = "desk" }: { show?: InfoQuality[]; tone?: "desk" | "page" }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {show.map((q) => (
        <div key={q} className="flex items-baseline gap-3">
          <dt className="w-[7.5rem] flex-none">
            {tone === "desk" ? (
              <InfoQualityChip quality={q} />
            ) : (
              <span className="nameplate text-ink">
                <span aria-hidden="true" className="mr-1.5">{QUALITY_META[q].glyph}</span>
                {q}
              </span>
            )}
          </dt>
          <dd className={tone === "desk" ? "text-sm text-desk-muted" : "text-sm text-muted"}>{QUALITY_META[q].meaning}</dd>
        </div>
      ))}
    </dl>
  );
}
