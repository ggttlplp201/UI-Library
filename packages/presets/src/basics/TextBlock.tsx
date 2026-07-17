/**
 * TextBlock — a paragraph of body copy. The workhorse for real pages:
 * captions, standfirsts, feature blurbs, legal lines.
 * Original component for Component Style Studio. License: MIT.
 */
export const TextBlock = ({
  text = "Write something worth reading. Body copy carries the page — components only frame it.",
  size = 16,
  color = "#c9c5bb",
  align = "left",
  lineHeight = 1.55,
  maxWidth = 560,
  font = "system-ui, sans-serif",
  italic = false,
  rotate = 0,
}: {
  /** The paragraph text */
  text?: string;
  /** Font size in px */
  size?: number;
  /** Text color */
  color?: string;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Line height multiplier */
  lineHeight?: number;
  /** Wrap width in px */
  maxWidth?: number;
  /** CSS font-family stack */
  font?: string;
  /** Italic voice — standfirsts, asides */
  italic?: boolean;
  /** Rotation in degrees — handwritten margin notes */
  rotate?: number;
}) => (
  <p
    style={{
      margin: 0,
      fontFamily: font,
      fontStyle: italic ? "italic" : "normal",
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      fontSize: size,
      color,
      textAlign: align,
      lineHeight,
      maxWidth,
      whiteSpace: "pre-wrap",
    }}
  >
    {text}
  </p>
);
