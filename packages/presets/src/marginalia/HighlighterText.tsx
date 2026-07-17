import { useId } from "react";
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
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mghl${uid}`;
  return (
  <>
    <style>{`${MARG_FONT_IMPORT}
      @keyframes ${cls}-swipe { from { background-size: 0% 100%; } to { background-size: 100% 100%; } }
      .${cls} { background-repeat: no-repeat; background-size: 100% 100%; animation: ${cls}-swipe .9s cubic-bezier(.22,1,.36,1) .3s backwards; }
      .${cls}:hover { animation: ${cls}-swipe .5s cubic-bezier(.22,1,.36,1); }
    `}</style>
    <p style={{ margin: 0, fontFamily: MARG.body, fontSize: size, lineHeight: 1.6, color: "#3c3628", maxWidth: 420 }}>
      {before}
      <mark
        className={cls}
        style={{
          backgroundImage: `linear-gradient(100deg, transparent 1%, ${color} 3%, ${color} 96%, transparent 99%)`,
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
};
