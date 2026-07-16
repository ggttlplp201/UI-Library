import { MARG, MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia paper-clip badge — a small attached slip of paper held by a
 * wire clip. Original set for Component Style Studio, inspired by classroom
 * journals. MIT.
 */
export const PaperClipBadge = ({
  label = "attached: 1 idea",
  paper = "#fdf9ee",
}: {
  /** Slip text */
  label?: string;
  /** Slip color */
  paper?: string;
}) => (
  <>
    <style>{MARG_FONT_IMPORT}</style>
    <div style={{ padding: "14px 8px 8px", display: "inline-block" }}>
      <span
        style={{
          position: "relative",
          display: "inline-block",
          background: paper,
          boxShadow: "0 2px 6px rgba(60,50,30,.2)",
          padding: "8px 16px 7px 26px",
          fontFamily: MARG.hand,
          fontWeight: 500,
          fontSize: 19,
          color: MARG.pencil,
          transform: "rotate(-1.5deg)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 6,
            top: -9,
            width: 12,
            height: 26,
            border: "2.5px solid #9aa0ab",
            borderRadius: "6px 6px 5px 5px",
            borderBottom: "none",
            transform: "rotate(8deg)",
            boxSizing: "border-box",
          }}
        />
        {label}
      </span>
    </div>
  </>
);
