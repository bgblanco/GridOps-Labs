import type { Alarm } from "@/lib/scenario/schema";
import { InfoQualityChip } from "./InfoQuality";

export function AlarmCard({ alarm, fresh }: { alarm: Alarm; fresh?: boolean }) {
  const limit = alarm.severity === "limit";
  return (
    <div
      role="status"
      className={`flex flex-wrap items-center justify-between gap-2 rounded-[2px] border px-3 py-2 ${fresh ? "rise-in" : ""}`}
      style={{ borderColor: limit ? "var(--fault)" : "var(--alarm)", background: "var(--desk)" }}
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className={limit && fresh ? "blink" : ""} style={{ color: limit ? "var(--fault)" : "var(--alarm)" }}>
          {limit ? "▲" : "◆"}
        </span>
        <span className="mono text-[0.84rem] tracking-wide" style={{ color: limit ? "var(--fault)" : "var(--alarm)" }}>
          {alarm.text}
        </span>
      </span>
      <InfoQualityChip quality={alarm.quality} />
    </div>
  );
}
