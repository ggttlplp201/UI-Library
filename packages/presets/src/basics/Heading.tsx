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
  font = "system-ui, sans-serif",
  lineHeight = 1.05,
  italic = false,
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
  /** CSS font-family stack */
  font?: string;
  /** Line height multiplier (display type wants ≤1) */
  lineHeight?: number;
  /** Italic display voice */
  italic?: boolean;
}) => (
  <h2
    style={{
      margin: 0,
      fontFamily: font,
      fontStyle: italic ? "italic" : "normal",
      fontSize: size,
      fontWeight: weight,
      color,
      textAlign: align,
      letterSpacing: `${tracking}em`,
      lineHeight,
      whiteSpace: "pre-wrap",
    }}
  >
    {text}
  </h2>
);
