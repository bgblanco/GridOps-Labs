/**
 * Story layer. Restrained pixel illustrations for scene-setting only.
 * Never used for technical information that needs precise interpretation.
 *
 * Scenes are keyed by StoryKey (see schema.ts). Add a key there and a
 * SceneDef here; a phase carries `story` and the shell renders it.
 */
import type { ReactNode } from "react";
import type { StoryKey } from "@/lib/scenario/schema";

type Rect = [x: number, y: number, w: number, h: number, fill: string];

const P = {
  sky: "#0b1820",
  cloud: "#15252f",
  cloud2: "#1c2f3a",
  ground: "#122028",
  grass: "#1a2e33",
  steel: "#5d717c",
  steelDark: "#3a4c57",
  pole: "#5a4632",
  wire: "#6f8490",
  house: "#1f3039",
  roof: "#2b3f4a",
  windowDark: "#0e1a21",
  windowLit: "#f0b429",
  rain: "#3d5f6f",
  bolt: "#f3e7b0",
  spark: "#ec6a43",
  amber: "#f0b429",
  white: "#dbe4e8",
  live: "#57c7b1", // energized (matches --live)
  dead: "#53646e", // de-energized (matches --dead)
  fault: "#ec6a43", // fault / arc (matches --fault)
  cone: "#e8873c",
};

const rects = (list: Rect[]) =>
  list.map(([x, y, w, h, fill], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />);

/* ---- shared elements ------------------------------------------------- */

function skyGround(): Rect[] {
  return [
    [0, 0, 120, 48, P.sky],
    [0, 40, 120, 8, P.ground],
    [0, 40, 120, 1, P.grass],
  ];
}

function treeline(y = 34): Rect[] {
  const r: Rect[] = [];
  for (let x = 0; x < 120; x += 6) {
    const h = 4 + ((x * 7) % 5);
    r.push([x, y + (6 - h), 5, h, "#0f2029"]);
  }
  return r;
}

/* ---- storm-substation (event / lockout) ------------------------------ */

function stormScene(): Rect[] {
  const r: Rect[] = [];
  r.push([0, 0, 120, 48, P.sky]);
  // clouds
  r.push([0, 0, 120, 4, P.cloud], [6, 4, 30, 2, P.cloud], [44, 4, 40, 3, P.cloud2], [90, 4, 26, 2, P.cloud], [52, 7, 18, 1, P.cloud2]);
  // ground
  r.push([0, 40, 120, 8, P.ground], [0, 40, 120, 1, P.grass]);
  // substation fence
  for (let x = 4; x <= 40; x += 3) r.push([x, 33, 1, 7, P.steelDark]);
  r.push([4, 33, 37, 1, P.steelDark], [4, 36, 37, 1, P.steelDark]);
  // bus structure
  r.push([8, 18, 1, 22, P.steel], [20, 18, 1, 22, P.steel], [32, 18, 1, 22, P.steel], [8, 18, 25, 1, P.steel], [8, 23, 25, 1, P.steel]);
  for (const x of [10, 14, 18, 22, 26, 30]) r.push([x, 19, 1, 3, P.white]);
  // transformer
  r.push([12, 28, 12, 10, P.steelDark], [13, 29, 10, 1, P.steel], [13, 31, 10, 1, P.steel], [13, 33, 10, 1, P.steel], [14, 25, 2, 3, P.white], [20, 25, 2, 3, P.white]);
  // poles
  for (const x of [52, 76, 100]) r.push([x, 14, 2, 26, P.pole], [x - 4, 15, 10, 1, P.pole], [x - 4, 15, 1, 1, P.white], [x + 5, 15, 1, 1, P.white]);
  // wires from substation to poles (slight sag)
  r.push([33, 18, 8, 1, P.wire], [41, 17, 7, 1, P.wire], [48, 16, 5, 1, P.wire]);
  r.push([54, 16, 7, 1, P.wire], [61, 17, 8, 1, P.wire], [69, 16, 7, 1, P.wire]);
  // broken span between pole 2 and 3: one end hanging
  r.push([78, 16, 6, 1, P.wire], [84, 17, 1, 3, P.wire], [85, 20, 1, 4, P.wire], [86, 24, 1, 5, P.wire], [87, 29, 1, 4, P.wire]);
  r.push([94, 17, 6, 1, P.wire]);
  // houses (dark windows: interrupted customers)
  for (const x of [88, 104]) {
    r.push([x, 33, 12, 7, P.house], [x - 1, 31, 14, 2, P.roof], [x + 1, 30, 10, 1, P.roof]);
    r.push([x + 2, 35, 3, 2, P.windowDark], [x + 7, 35, 3, 2, P.windowDark]);
  }
  return r;
}

function rainDrops(seed = 7): Rect[] {
  const r: Rect[] = [];
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) r.push([Math.floor(rnd() * 120), Math.floor(rnd() * 44) - 8, 1, 2, P.rain]);
  return r;
}

function StormSubstation() {
  return (
    <>
      {rects(stormScene())}
      <g className="pixel-rain">{rects(rainDrops())}</g>
      <g className="pixel-rain" style={{ animationDelay: "-0.45s" }}>{rects(rainDrops(19))}</g>
      {/* lightning */}
      <g className="pixel-flash">
        <rect x={0} y={0} width={120} height={48} fill={P.white} fillOpacity={0.18} />
        {rects([[66, 4, 1, 3, P.bolt], [65, 7, 1, 3, P.bolt], [66, 10, 1, 2, P.bolt], [67, 12, 1, 3, P.bolt]])}
      </g>
      {/* spark at downed conductor */}
      <g className="blink">{rects([[87, 33, 1, 1, P.spark], [86, 34, 1, 1, P.amber], [88, 34, 1, 1, P.spark]])}</g>
    </>
  );
}

/* ---- conductor-down (downed energized conductor) --------------------- */

function ConductorDown() {
  const r: Rect[] = [...skyGround(), ...treeline(33)];
  // wet road / standing water band
  r.push([0, 41, 120, 3, "#0c1a22"]);
  // two poles, span snapped in the middle
  for (const x of [26, 92]) r.push([x, 12, 2, 28, P.pole], [x - 4, 14, 10, 1, P.pole]);
  // crossarm insulators
  r.push([23, 13, 1, 1, P.white], [31, 13, 1, 1, P.white], [89, 13, 1, 1, P.white], [97, 13, 1, 1, P.white]);
  // intact upper conductor on the far pole
  r.push([28, 13, 30, 1, P.wire]);
  // snapped conductor from left pole draping to the ground (dead / grey)
  r.push([28, 14, 8, 1, P.wire], [36, 15, 6, 1, P.wire], [42, 17, 5, 2, P.wire], [46, 20, 4, 3, P.wire], [49, 24, 3, 4, P.wire], [51, 29, 3, 5, P.wire], [53, 35, 4, 4, P.wire], [56, 39, 6, 1, P.wire]);
  // hazard cones flanking the downed wire
  for (const cx of [44, 66]) r.push([cx, 37, 3, 3, P.cone], [cx + 1, 35, 1, 2, P.cone], [cx - 1, 40, 5, 1, P.white]);
  // one dark house at right
  r.push([104, 33, 12, 7, P.house], [103, 31, 14, 2, P.roof], [106, 35, 3, 2, P.windowDark], [111, 35, 3, 2, P.windowDark]);
  return (
    <>
      {rects(r)}
      {/* arc where the conductor meets wet ground */}
      <g className="blink">{rects([[57, 38, 2, 1, P.fault], [56, 37, 1, 1, P.amber], [59, 39, 1, 1, P.fault], [58, 40, 1, 1, P.amber]])}</g>
      {/* faint reflected glow on the water */}
      <g className="blink" style={{ animationDelay: "-0.3s" }}>{rects([[55, 42, 6, 1, P.fault]])}</g>
    </>
  );
}

/* ---- energized-line (a hot conductor, flow moving) ------------------- */

function EnergizedLine() {
  const r: Rect[] = [...skyGround(), ...treeline(34)];
  // three poles across
  for (const x of [16, 60, 104]) r.push([x, 12, 2, 28, P.pole], [x - 5, 14, 12, 1, P.pole], [x - 4, 14, 1, 1, P.white], [x + 5, 14, 1, 1, P.white]);
  // a lit house (still served)
  r.push([80, 33, 12, 7, P.house], [79, 31, 14, 2, P.roof], [82, 35, 3, 2, P.windowLit], [87, 35, 3, 2, P.windowLit]);
  return (
    <>
      {rects(r)}
      {/* energized conductor with animated flow */}
      <line x1={17} y1={15} x2={104} y2={15} stroke={P.live} strokeWidth={1.4} className="flow-anim" />
      <line x1={17} y1={15} x2={104} y2={15} stroke={P.live} strokeWidth={1.4} strokeOpacity={0.25} />
      {/* subtle energized glow at each insulator */}
      <g className="blink" style={{ animationDelay: "-0.5s" }}>{rects([[16, 14, 2, 1, P.live], [60, 14, 2, 1, P.live], [104, 14, 2, 1, P.live]])}</g>
    </>
  );
}

/* ---- isolation-point (open switch bounding a de-energized section) --- */

function IsolationPoint() {
  const r: Rect[] = [...skyGround(), ...treeline(34)];
  // poles: left section energized, right section dead
  for (const x of [14, 58, 106]) r.push([x, 12, 2, 28, P.pole], [x - 5, 14, 12, 1, P.pole]);
  // the open switch sits at the middle pole (x=58): a lifted blade / gap
  r.push([56, 12, 6, 1, P.steelDark]); // switch base
  return (
    <>
      {rects(r)}
      {/* left conductor: energized, flowing into the switch */}
      <line x1={15} y1={15} x2={54} y2={15} stroke={P.live} strokeWidth={1.4} className="flow-anim" />
      {/* open blade lifted up from the left contact (visible air gap) */}
      <line x1={54} y1={15} x2={58} y2={10} stroke={P.live} strokeWidth={1.4} />
      {/* right conductor: de-energized (dashed, dead colour) */}
      <line x1={62} y1={15} x2={105} y2={15} stroke={P.dead} strokeWidth={1.4} strokeDasharray="3 3" />
      {/* de-energized section: dark house */}
      {rects([[84, 33, 12, 7, P.house], [83, 31, 14, 2, P.roof], [86, 35, 3, 2, P.windowDark], [91, 35, 3, 2, P.windowDark]])}
      {/* OPEN marker glow at the gap */}
      <g className="blink">{rects([[59, 9, 1, 1, P.amber]])}</g>
    </>
  );
}

/* ---- registry + public component ------------------------------------- */

type SceneDef = { render: () => ReactNode; label: string };

const SCENES: Record<StoryKey, SceneDef> = {
  "storm-substation": {
    render: StormSubstation,
    label: "Pixel illustration: a storm over a substation, a downed span on the pole line, and houses with their lights out.",
  },
  "conductor-down": {
    render: ConductorDown,
    label: "Pixel illustration: a snapped conductor draped to wet ground and arcing between two poles, marked off with hazard cones.",
  },
  "energized-line": {
    render: EnergizedLine,
    label: "Pixel illustration: an energized overhead line carrying current across a pole span, a served house lit below.",
  },
  "isolation-point": {
    render: IsolationPoint,
    label: "Pixel illustration: an open switch isolating a de-energized section from an energized one, an air gap at the blade.",
  },
};

export function StoryScene({
  story,
  caption,
  className = "",
  variant = "full",
}: {
  story: StoryKey;
  caption?: string;
  className?: string;
  variant?: "full" | "banner";
}) {
  const scene = SCENES[story] ?? SCENES["storm-substation"];
  const svgClass = variant === "banner" ? "pixelated block h-20 w-full sm:h-24" : "pixelated block h-auto w-full";
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 120 48"
        preserveAspectRatio={variant === "banner" ? "xMidYMid slice" : "xMidYMid meet"}
        className={svgClass}
        role="img"
        aria-label={scene.label}
      >
        {scene.render()}
      </svg>
      {caption && <figcaption className="mt-2 font-pixel text-[0.62rem] uppercase tracking-wider text-desk-muted">{caption}</figcaption>}
    </figure>
  );
}

export function PixelCrew({ className = "" }: { className?: string }) {
  const r: Rect[] = [
    [0, 0, 56, 30, P.sky],
    [0, 25, 56, 5, P.ground],
    [0, 25, 56, 1, P.grass],
    // truck body
    [4, 16, 26, 7, P.white], [30, 13, 10, 10, P.white], [32, 14, 6, 4, "#35505d"],
    [4, 19, 36, 1, P.amber],
    [8, 23, 5, 3, "#1a262d"], [9, 24, 3, 1, P.steel], [31, 23, 5, 3, "#1a262d"], [32, 24, 3, 1, P.steel],
    // boom and bucket
    [10, 14, 3, 2, P.steel], [12, 12, 2, 2, P.steel], [14, 10, 2, 2, P.steel], [16, 8, 2, 2, P.steel], [18, 6, 2, 2, P.steel],
    [19, 2, 6, 5, P.amber], [20, 3, 4, 1, "#c48f12"],
    // lineworker in bucket (hard hat)
    [21, 0, 3, 2, P.amber],
    // pole
    [46, 2, 2, 24, P.pole], [42, 4, 10, 1, P.pole],
    // light bar
    [33, 12, 4, 1, P.spark],
  ];
  return (
    <svg viewBox="0 0 56 30" className={`pixelated block h-auto ${className}`} role="img" aria-label="Pixel illustration: a bucket truck crew beside a pole.">
      {rects(r)}
      <g className="blink">{rects([[33, 12, 2, 1, P.amber]])}</g>
    </svg>
  );
}
