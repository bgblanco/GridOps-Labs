import type { FieldReport } from "@/lib/scenario/schema";
import { InfoQualityChip } from "./InfoQuality";

export function FieldReportCard({ report }: { report: FieldReport }) {
  return (
    <article className="rise-in overflow-hidden rounded-[3px] border border-desk-rule bg-desk" aria-label={`Field report from ${report.from}`}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-desk-rule px-4 py-2.5">
        <span className="nameplate text-desk-ink">Field crew</span>
        <span className="flex items-center gap-2">
          <span className="text-xs text-desk-muted">Information type</span>
          <InfoQualityChip quality={report.quality} size="md" />
        </span>
      </header>
      <div className="border-l-[3px] border-[var(--q-reported)] p-4">
        <p className="text-xs text-desk-muted">
          {report.from} · {report.channel}
        </p>
        <blockquote className="mt-1 font-display text-[1.35rem] font-semibold leading-snug text-desk-ink">“{report.message}”</blockquote>
        {report.note && <p className="mt-3 text-sm leading-relaxed text-desk-muted">{report.note}</p>}
      </div>
    </article>
  );
}
