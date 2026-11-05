// A round event marker for the story minimaps. Rendered as an HTML element
// over the minimap SVG, because that SVG stretches non-uniformly
// (preserveAspectRatio="none") and would distort an SVG circle.
export default function MinimapDot({
  leftPercent,
  topPx,
  deep,
  size,
}: {
  leftPercent: number;
  topPx: number;
  deep?: boolean;
  size: number;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute rounded-full -translate-x-1/2 -translate-y-1/2 ${
        deep ? "bg-accent" : "bg-[#fdfaf3] border-[1.5px] border-[#3f3a35]"
      }`}
      style={{ left: `${leftPercent}%`, top: `${topPx}px`, width: size, height: size }}
    />
  );
}
