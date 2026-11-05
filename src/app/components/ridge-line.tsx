import { EVENTS, MIN_AGE, MAX_AGE } from "../story/events";

export const VIEW_W = 1000;
export const VIEW_H = 100;
// Horizontal room for the ridge to fall away toward each screen edge.
const EDGE_PAD = 40;
const EDGE_ALTITUDE = 22;

// Receding ridge echoes below the main line, as on the /story mountain:
// the same curve shifted down with falling opacity, clipped to the mountain.
const CONTOUR_ECHOES = [
  { dy: 12, opacity: 0.3 },
  { dy: 25, opacity: 0.2 },
  { dy: 39, opacity: 0.12 },
];

// Trial options, each can be switched off on its own.
// C: a fainter, flatter range behind the main ridge (atmospheric depth).
const SHOW_DISTANT_RANGE = true;
// D: the ridge line gets thicker and darker with altitude.
const STROKE_BY_ALTITUDE = true;

// C: the distant range smooths the life profile over neighboring events,
// flattens it toward the middle, and shifts it half a step to the right.
const DISTANT_SMOOTHING = 2;
const DISTANT_BASE = 22;
const DISTANT_SCALE = 0.65;

// D: line width (px) and gray level (RGB) at altitude 0 and altitude 100.
// Color instead of per-piece opacity: overlapping round caps would stack alpha
// into beads; the group as a whole gets one opacity.
const STROKE_WIDTH_RANGE = [0.7, 2.2];
const STROKE_RGB_LOW = [150, 142, 133];
const STROKE_RGB_HIGH = [63, 58, 53];
const STROKE_GROUP_OPACITY = 0.85;
const STROKE_SAMPLES_PER_SEGMENT = 16;

// CSS variable set by RidgeExplorer during its intro: how much of the ridge is
// drawn, as a percentage from the left. Unset means fully drawn.
export const REVEAL_VAR = "--ridge-reveal";
// Everything left of the reveal point is visible, with a short soft fade ahead of it.
export const REVEAL_MASK = `linear-gradient(to right, #000 var(${REVEAL_VAR}, 100%), transparent calc(var(${REVEAL_VAR}, 100%) + 4%))`;

export function xForAge(age: number) {
  return EDGE_PAD + ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * (VIEW_W - 2 * EDGE_PAD);
}

export function yForAltitude(altitude: number) {
  return VIEW_H - altitude * 0.96;
}

type Point = { x: number; y: number };

const points: Point[] = [
  { x: 0, y: yForAltitude(EDGE_ALTITUDE) },
  ...EVENTS.map((event) => ({ x: xForAge(event.age), y: yForAltitude(event.altitude) })),
  { x: VIEW_W, y: yForAltitude(EDGE_ALTITUDE) },
];

const bezier = (t: number, a: number, b: number, c: number, d: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

// Each segment is a cubic Bézier with both control points at the segment's mid x.
function smoothPath(shiftY = 0, through: Point[] = points) {
  return through.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y + shiftY}`;
    const previous = through[i - 1];
    const midX = (previous.x + point.x) / 2;
    return `${path} C ${midX} ${previous.y + shiftY}, ${midX} ${point.y + shiftY}, ${point.x} ${point.y + shiftY}`;
  }, "");
}

// C: distant range through smoothed, flattened altitudes.
const distantPoints: Point[] = (() => {
  const inner = EVENTS.map((event, i) => {
    const neighbors = EVENTS.slice(Math.max(0, i - DISTANT_SMOOTHING), i + DISTANT_SMOOTHING + 1);
    const average = neighbors.reduce((sum, n) => sum + n.altitude, 0) / neighbors.length;
    const next = EVENTS[i + 1] ?? event;
    return {
      x: (xForAge(event.age) + xForAge(next.age)) / 2,
      y: yForAltitude(DISTANT_BASE + DISTANT_SCALE * average),
    };
  });
  const edgeY = yForAltitude(DISTANT_BASE + DISTANT_SCALE * EDGE_ALTITUDE);
  return [{ x: 0, y: edgeY }, ...inner, { x: VIEW_W, y: edgeY }];
})();
const distantPath = smoothPath(0, distantPoints);
const distantMassPath = `${distantPath} L ${VIEW_W} ${VIEW_H} L 0 ${VIEW_H} Z`;

// D: the ridge cut into short pieces, each stroked by its own altitude.
const lerp = ([low, high]: number[], amount: number) => low + (high - low) * amount;
const altitudePieces = points.slice(1).flatMap((end, i) => {
  const start = points[i];
  const midX = (start.x + end.x) / 2;
  const at = (t: number) => ({
    x: bezier(t, start.x, midX, midX, end.x),
    y: bezier(t, start.y, start.y, end.y, end.y),
  });
  return Array.from({ length: STROKE_SAMPLES_PER_SEGMENT }, (_, step) => {
    const from = at(step / STROKE_SAMPLES_PER_SEGMENT);
    const to = at((step + 1) / STROKE_SAMPLES_PER_SEGMENT);
    const altitude = Math.min(Math.max((VIEW_H - (from.y + to.y) / 2) / 0.96 / 100, 0), 1);
    return {
      d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      width: lerp(STROKE_WIDTH_RANGE, altitude),
      color: `rgb(${STROKE_RGB_LOW.map((low, c) => Math.round(lerp([low, STROKE_RGB_HIGH[c]], altitude))).join(" ")})`,
    };
  });
});

/** Height of the ridge line at a given x (viewBox units), following the drawn curve. */
export function ridgeYAt(x: number) {
  const i = Math.max(1, points.findIndex((point) => point.x >= x));
  const start = points[i - 1];
  const end = points[i];
  const midX = (start.x + end.x) / 2;
  // x(t) rises monotonically within a segment, so bisect for t.
  let low = 0;
  let high = 1;
  for (let step = 0; step < 24; step++) {
    const t = (low + high) / 2;
    if (bezier(t, start.x, midX, midX, end.x) < x) low = t;
    else high = t;
  }
  return bezier((low + high) / 2, start.y, start.y, end.y, end.y);
}

const ridgePath = smoothPath();
const massPath = `${ridgePath} L ${VIEW_W} ${VIEW_H} L 0 ${VIEW_H} Z`;
const echoPaths = CONTOUR_ECHOES.map((echo) => ({ ...echo, d: smoothPath(echo.dy) }));

// The /story ridge, drawn from the same events, as a quiet full-width band.
export function RidgeLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ maskImage: REVEAL_MASK, WebkitMaskImage: REVEAL_MASK }}
    >
      <defs>
        <linearGradient id="homeRidgeMass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8946d" stopOpacity="0" />
          <stop offset="0.55" stopColor="#a8946d" stopOpacity="0.18" />
          <stop offset="1" stopColor="#6e5f3f" stopOpacity="0.34" />
        </linearGradient>
        <clipPath id="homeRidgeClip">
          <path d={massPath} />
        </clipPath>
        {/* The sky above the main ridge: the distant range only shows there,
            so the nearer mountain hides it. */}
        <clipPath id="homeSkyClip">
          <path d={`${ridgePath} L ${VIEW_W} 0 L 0 0 Z`} />
        </clipPath>
        <linearGradient id="homeDistantMass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8946d" stopOpacity="0.1" />
          <stop offset="1" stopColor="#a8946d" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {SHOW_DISTANT_RANGE && (
        <g clipPath="url(#homeSkyClip)">
          <path d={distantMassPath} fill="url(#homeDistantMass)" />
          <path
            d={distantPath}
            fill="none"
            stroke="#3f3a35"
            strokeOpacity={0.16}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      )}
      <path d={massPath} fill="url(#homeRidgeMass)" />
      <g clipPath="url(#homeRidgeClip)">
        {echoPaths.map((echo) => (
          <path
            key={echo.dy}
            d={echo.d}
            fill="none"
            stroke="#3f3a35"
            strokeOpacity={echo.opacity}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      {STROKE_BY_ALTITUDE ? (
        <g fill="none" strokeLinecap="round" opacity={STROKE_GROUP_OPACITY}>
          {altitudePieces.map((piece, i) => (
            <path
              key={i}
              d={piece.d}
              stroke={piece.color}
              strokeWidth={piece.width}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ) : (
        <path
          d={ridgePath}
          fill="none"
          stroke="#3f3a35"
          strokeOpacity={0.55}
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
