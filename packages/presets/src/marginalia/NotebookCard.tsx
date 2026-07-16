import { MARG, MARG_FONT_IMPORT, ruledPaper } from "./libMarg";

/**
 * Marginalia notebook card — a ruled-paper entry: handwritten heading on the
 * top line, serif body sitting on the rules, date in the margin. Original
 * set for Component Style Studio, inspired by classroom journals. MIT.
 */
export const NotebookCard = ({
  date = "OCT 12",
  title = "Field notes",
  body = "Ideas land here first. The rules keep the writing honest; the red margin keeps the dates.",
  width = 320,
}: {
  /** Margin date */
  date?: string;
  /** Handwritten heading */
  title?: string;
  /** Entry copy */
  body?: string;
  /** Card width in px */
  width?: number;
}) => (
  <>
    <style>{MARG_FONT_IMPORT}</style>
    <div style={{ ...ruledPaper(), width, position: "relative", padding: "20px 18px 22px 48px", boxSizing: "border-box" }}>
      <span
        style={{
          position: "absolute",
          left: 4,
          top: 24,
          width: 26,
          textAlign: "center",
          fontFamily: MARG.hand,
          fontSize: 13,
          fontWeight: 700,
          color: MARG.margin,
          transform: "rotate(-4deg)",
          lineHeight: 1.05,
        }}
      >
        {date}
      </span>
      <h3 style={{ margin: 0, fontFamily: MARG.hand, fontWeight: 700, fontSize: 30, lineHeight: "28px", color: MARG.ink }}>
        {title}
      </h3>
      <p style={{ margin: "6px 0 0", fontFamily: MARG.body, fontSize: 14, lineHeight: "28px", color: MARG.pencil }}>{body}</p>
    </div>
  </>
);
