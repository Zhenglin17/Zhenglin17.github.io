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

const points = [
  { x: 0, y: yForAltitude(EDGE_ALTITUDE) },
  ...EVENTS.map((event) => ({ x: xForAge(event.age), y: yForAltitude(event.altitude) })),
  { x: VIEW_W, y: yForAltitude(EDGE_ALTITUDE) },
];

// Each segment is a cubic Bézier with both control points at the segment's mid x.
function smoothPath(shiftY = 0) {
  return points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y + shiftY}`;
    const previous = points[i - 1];
    const midX = (previous.x + point.x) / 2;
    return `${path} C ${midX} ${previous.y + shiftY}, ${midX} ${point.y + shiftY}, ${point.x} ${point.y + shiftY}`;
  }, "");
}

/** Height of the ridge line at a given x (viewBox units), following the drawn curve. */
export function ridgeYAt(x: number) {
  const i = Math.max(1, points.findIndex((point) => point.x >= x));
  const start = points[i - 1];
  const end = points[i];
  const midX = (start.x + end.x) / 2;
  const bezier = (t: number, a: number, b: number, c: number, d: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
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
      </defs>
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
      <path
        d={ridgePath}
        fill="none"
        stroke="#3f3a35"
        strokeOpacity={0.55}
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
