import { EVENTS, MIN_AGE, MAX_AGE } from "../story/events";

const VIEW_W = 1000;
const VIEW_H = 100;
// Horizontal room for the ridge to fall away toward each screen edge.
const EDGE_PAD = 40;
const EDGE_ALTITUDE = 22;

function xForAge(age: number) {
  return EDGE_PAD + ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * (VIEW_W - 2 * EDGE_PAD);
}

function yForAltitude(altitude: number) {
  return VIEW_H - altitude * 0.96;
}

const points = [
  { x: 0, y: yForAltitude(EDGE_ALTITUDE) },
  ...EVENTS.map((event) => ({ x: xForAge(event.age), y: yForAltitude(event.altitude) })),
  { x: VIEW_W, y: yForAltitude(EDGE_ALTITUDE) },
];

const ridgePath = points.reduce((path, point, i) => {
  if (i === 0) return `M ${point.x} ${point.y}`;
  const previous = points[i - 1];
  const midX = (previous.x + point.x) / 2;
  return `${path} C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
}, "");

const massPath = `${ridgePath} L ${VIEW_W} ${VIEW_H} L 0 ${VIEW_H} Z`;

// The /story ridge, drawn from the same events, as a quiet full-width band.
export function RidgeLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="homeRidgeMass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8946d" stopOpacity="0" />
          <stop offset="0.55" stopColor="#a8946d" stopOpacity="0.18" />
          <stop offset="1" stopColor="#6e5f3f" stopOpacity="0.34" />
        </linearGradient>
      </defs>
      <path d={massPath} fill="url(#homeRidgeMass)" />
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
