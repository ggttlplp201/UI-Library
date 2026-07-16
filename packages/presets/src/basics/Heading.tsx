/**
 * Heading — display type for section titles. Big, tight, and quiet about it.
 * Original component for Component Style Studio. License: MIT.
 */
export const Heading = ({
  text = "Section heading",
  size = 44,
  color = "#f2f0eb",
  weight = 700,
  align = "left",
  tracking = -0.02,
}: {
  /** Heading text */
  text?: string;
  /** Font size in px */
  size?: number;
  /** Text color */
  color?: string;
  /** Font weight */
  weight?: number;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Letter spacing in em (negative tightens) */
  tracking?: number;
}) => (
  <h2
    style={{
      margin: 0,
      fontFamily: "system-ui, sans-serif",
      fontSize: size,
      fontWeight: weight,
      color,
      textAlign: align,
      letterSpacing: `${tracking}em`,
      lineHeight: 1.05,
      whiteSpace: "pre-wrap",
    }}
  >
    {text}
  </h2>
);
