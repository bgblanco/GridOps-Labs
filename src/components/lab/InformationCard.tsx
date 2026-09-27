import type { InformationItem } from "@/lib/scenario/schema";
import { InfoQualityChip } from "./InfoQuality";

/** An information category the learner can open. Tracks nothing itself. */
export function InformationCard({ item, open, onOpen }: { item: InformationItem; open: boolean; onOpen: (id: string) => void }) {
  return (
    <div className={`border ${open ? "border-desk-muted bg-desk-3" : "border-desk-rule bg-desk"} rounded-[3px] transition-colors`}>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-display text-[1.05rem] font-semibold">{item.title}</span>
        {open ? <InfoQualityChip quality={item.quality} /> : <span className="nameplate text-desk-muted">Review</span>}
      </button>
      {open && (
        <div className="rise-in border-t border-desk-rule px-4 pb-4 pt-3">
          {item.value && <p className="mono text-[1.02rem] text-desk-ink">{item.value}</p>}
          <p className="mt-1.5 text-sm leading-relaxed text-desk-muted">{item.body}</p>
          <p className="mt-2 text-xs text-desk-muted">Source: {item.source}</p>
        </div>
      )}
    </div>
  );
}
