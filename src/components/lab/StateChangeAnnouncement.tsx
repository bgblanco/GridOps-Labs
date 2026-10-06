/**
 * Concise, accessible status line for meaningful electrical changes. Always present as an
 * aria-live region so screen readers get one update per change (not per animation frame).
 * The `key` on the message re-triggers the entry animation on each new message.
 */
export function StateChangeAnnouncement({ message, tone = "ok" }: { message?: string; tone?: "ok" | "caution" | "info" }) {
  const color = tone === "caution" ? "var(--alarm)" : tone === "ok" ? "var(--live)" : "var(--desk-muted)";
  return (
    <div role="status" aria-live="polite" className="min-h-[1.5rem]">
      {message && (
        <p key={message} className="state-update flex items-baseline gap-2 text-sm">
          <span className="nameplate flex-none text-[0.62rem]" style={{ color }}>
            System state updated
          </span>
          <span className="text-desk-ink">{message}</span>
        </p>
      )}
    </div>
  );
}
