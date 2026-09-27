/** Fictional Summit Grid overview. Schematic only; no geography. */
export function SummitGridMap() {
  const L = "var(--ink-2)";
  const subs = [
    { id: "summit", x: 110, y: 200, name: "SUMMIT SUB", feeders: "F120 · F123", anchor: "start" as const, lx: 76, ly: 250 },
    { id: "cedar", x: 110, y: 370, name: "CEDAR FLAT SUB", feeders: "F121", anchor: "start" as const, lx: 76, ly: 420 },
    { id: "pine", x: 820, y: 290, name: "PINE RIDGE SUB", feeders: "F122", anchor: "end" as const, lx: 854, ly: 340 },
  ];
  const ties = [
    { x: 400, y: 285, t: "TIE A", vertical: true },
    { x: 690, y: 290, t: "TIE B", vertical: false },
    { x: 640, y: 90, t: "TIE C", vertical: true },
  ];
  return (
    <svg viewBox="0 0 900 450" role="img" aria-labelledby="sgm-t sgm-d" className="block h-auto w-full">
      <title id="sgm-t">Summit Grid overview</title>
      <desc id="sgm-d">A fictional distribution system with three substations, four feeders, and three normally-open ties connecting Feeder 120 to its neighbors.</desc>
      <defs>
        <pattern id="sgm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--rule)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="900" height="450" fill="var(--surface)" />
      <rect width="900" height="450" fill="url(#sgm-grid)" opacity="0.7" />

      <g fill="none" strokeWidth="3" stroke={L} strokeLinejoin="round">
        {/* F120 */}
        <path d="M 144 200 H 560 M 560 200 V 120 H 640 M 560 200 V 290 H 670" stroke="var(--ink)" strokeWidth="4" />
        {/* Tie A stub from F120 */}
        <path d="M 400 200 V 270" stroke="var(--ink)" strokeWidth="4" />
        {/* F123 */}
        <path d="M 110 166 V 60 H 780" />
        <path d="M 640 60 V 75" />
        {/* F121 */}
        <path d="M 144 370 H 720 M 400 370 V 300" />
        {/* F122 */}
        <path d="M 786 290 H 705" />
      </g>
      <line x1="640" y1="105" x2="640" y2="120" stroke="var(--ink)" strokeWidth="4" />

      {ties.map((t) => (
        <g key={t.t}>
          <rect x={t.x - 13} y={t.y - 13} width="26" height="26" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1={t.x - 7} y1={t.y + 5} x2={t.x + 7} y2={t.y - 7} stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
          <text x={t.x + 20} y={t.y + 5} fontSize="14" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em" }}>
            {t.t}
          </text>
        </g>
      ))}

      {[
        { x: 250, y: 190, t: "F120" },
        { x: 250, y: 360, t: "F121" },
        { x: 250, y: 50, t: "F123" },
        { x: 730, y: 280, t: "F122" },
      ].map((l) => (
        <text key={l.t} x={l.x} y={l.y} fontSize="14" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)" }}>
          {l.t}
        </text>
      ))}

      {subs.map((s) => (
        <g key={s.id}>
          <rect x={s.x - 34} y={s.y - 26} width="68" height="52" fill="var(--desk)" rx="2" />
          <circle cx={s.x} cy={s.y} r="13" fill="none" stroke="var(--live)" strokeWidth="2.5" />
          <path d={`M ${s.x - 7} ${s.y} q 3.5 -7 7 0 t 7 0`} fill="none" stroke="var(--live)" strokeWidth="2" />
          <text x={s.lx} y={s.ly} textAnchor={s.anchor} fontSize="14" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.1em" }}>
            {s.name}
          </text>
          <text x={s.lx} y={s.ly + 17} textAnchor={s.anchor} fontSize="12" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)" }}>
            {s.feeders}
          </text>
        </g>
      ))}
      <text x="880" y="436" textAnchor="end" fontSize="12" fill="var(--muted)" style={{ fontFamily: "var(--font-body)" }}>
        Fictional training environment · not to scale
      </text>
    </svg>
  );
}
