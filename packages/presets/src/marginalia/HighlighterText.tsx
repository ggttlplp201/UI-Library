import { MARG, MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia highlighter — serif copy with a marker swipe across the key
 * phrase. Original set for Component Style Studio, inspired by classroom
 * journals. MIT.
 */
export const HighlighterText = ({
  before = "The trick is to ",
  highlighted = "ship the messy first draft",
  after = " and revise in public.",
  color = "#fff3a8",
  size = 18,
}: {
  /** Text before the highlight */
  before?: string;
  /** Highlighted phrase */
  highlighted?: string;
  /** Text after the highlight */
  after?: string;
  /** Marker color */
  color?: string;
  /** Font size in px */
  size?: number;
}) => (
  <>
    <style>{MARG_FONT_IMPORT}</style>
    <p style={{ margin: 0, fontFamily: MARG.body, fontSize: size, lineHeight: 1.6, color: "#3c3628", maxWidth: 420 }}>
      {before}
      <mark
        style={{
          background: `linear-gradient(100deg, transparent 1%, ${color} 3%, ${color} 96%, transparent 99%)`,
          padding: "0 .2em",
          borderRadius: ".3em .5em .4em .4em",
          color: "inherit",
        }}
      >
        {highlighted}
      </mark>
      {after}
    </p>
  </>
);
