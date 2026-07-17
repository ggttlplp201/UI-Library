import { useId } from "react";

/**
 * ScrollAssembleText — a statement whose words start scattered across the
 * block (offset + rotated) and converge into place as it scrolls into view.
 * Scroll-driven CSS (animation-timeline: view()); browsers without support
 * simply show the assembled statement.
 * Original component for Component Style Studio. License: MIT.
 */
export const ScrollAssembleText = ({
  text = "MOTION IS INFORMATION",
  font = "'Inter Tight', system-ui, sans-serif",
  size = 72,
  color = "#f2f0eb",
  weight = 800,
  spread = 160,
  width = 1000,
  align = "center",
}: {
  /** The statement */
  text?: string;
  /** Font stack */
  font?: string;
  /** Font size in px */
  size?: number;
  /** Text color */
  color?: string;
  /** Font weight */
  weight?: number;
  /** Max scatter distance in px */
  spread?: number;
  /** Block width in px */
  width?: number;
  /** Text alignment */
  align?: "left" | "center" | "right";
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `sat${uid}`;
  const words = text.split(/\s+/).filter(Boolean);
  const scatter = Math.max(1, spread);
  // Deterministic pseudo-random scatter per word.
  const rules = words
    .map((_, i) => {
      const dx = (i % 2 ? 1 : -1) * (((i * 37) % scatter) + 40);
      const dy = ((i * 53) % scatter) - scatter / 2;
      const rot = ((i * 29) % 24) - 12;
      return `@keyframes ${cls}-w${i} { from { opacity: .05; transform: translate(${dx}px, ${dy}px) rotate(${rot}deg); } to { opacity: 1; transform: none; } }
.${cls} span[data-w="${i}"] { animation: ${cls}-w${i} both; animation-timeline: view(); animation-range: entry 0% cover 45%; }`;
    })
    .join("\n");
  return (
    <div
      className={cls}
      style={{
        width,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight: 1.02,
        letterSpacing: "-0.02em",
      }}
    >
      <style>{`@supports (animation-timeline: view()) {\n${rules}\n}`}</style>
      {words.map((w, i) => (
        <span key={i} data-w={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};
