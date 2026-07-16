import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase marquee rule — a hard-framed ticker band rolling studio credits
 * between two ink rules. Original set for Component Style Studio, inspired
 * by studio-editorial bento systems. MIT.
 */
export const MarqueeRule = ({
  text = "DESIGN — BUILD — SHIP — REPEAT — ",
  accent = "#2b46ff",
  speed = 16,
}: {
  /** Ticker text (repeats) */
  text?: string;
  /** Text color */
  accent?: string;
  /** Seconds per loop */
  speed?: number;
}) => (
  <>
    <style>{`
      ${BOLD_FONT_IMPORT}
      @keyframes bc-roll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    `}</style>
    <div
      style={{
        width: 640,
        maxWidth: "100%",
        overflow: "hidden",
        borderTop: `3px solid ${BOLD.ink}`,
        borderBottom: `3px solid ${BOLD.ink}`,
        background: BOLD.paper,
        padding: "6px 0 5px",
      }}
    >
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontFamily: BOLD.display,
          fontSize: 20,
          letterSpacing: ".04em",
          color: accent,
          animation: `bc-roll ${speed}s linear infinite`,
        }}
      >
        <span>{text.repeat(4)}</span>
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  </>
);
