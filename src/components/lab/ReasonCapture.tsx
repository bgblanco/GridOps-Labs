import type { ReasonOption } from "@/lib/scenario/schema";

export interface ReasonCaptureProps {
  prompt: string;
  reasons: ReasonOption[];
  selected: string[];
  text: string;
  allowFreeText: boolean;
  onReasons: (ids: string[]) => void;
  onText: (t: string) => void;
}

export function ReasonCapture({ prompt, reasons, selected, text, allowFreeText, onReasons, onText }: ReasonCaptureProps) {
  const toggle = (id: string) => onReasons(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  return (
    <fieldset className="rise-in">
      <legend className="font-display text-xl font-semibold text-desk-ink">{prompt}</legend>
      <p className="mt-1 text-sm text-desk-muted">Pick one or more.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {reasons.map((r) => (
          <label key={r.id} className="choice">
            <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
            <span className="text-sm">{r.label}</span>
          </label>
        ))}
      </div>
      {allowFreeText && (
        <div className="mt-3">
          <label htmlFor="reason-text" className="field-label text-desk-ink">
            In your own words <span className="font-normal text-desk-muted">(optional)</span>
          </label>
          <input id="reason-text" className="field" maxLength={280} value={text} onChange={(e) => onText(e.target.value)} placeholder="What made this path the one?" />
        </div>
      )}
    </fieldset>
  );
}
