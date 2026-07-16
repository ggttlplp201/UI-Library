import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase index chip — the numbered marker (01 / 02 / …) with a label that
 * threads sections together. Original set for Component Style Studio,
 * inspired by studio-editorial bento systems. MIT.
 */
export const IndexChip = ({
  number = "02",
  label = "Selected work",
  accent = "#f91814",
}: {
  /** Index number */
  number?: string;
  /** Section label */
  label?: string;
  /** Chip color */
  accent?: string;
}) => (
  <>
    <style>{BOLD_FONT_IMPORT}</style>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: BOLD.body }}>
      <span
        style={{
          fontFamily: BOLD.display,
          fontSize: 15,
          background: accent,
          color: "#fff",
          border: `2px solid ${BOLD.ink}`,
          padding: "3px 9px",
          boxShadow: `3px 3px 0 0 ${BOLD.ink}`,
        }}
      >
        {number}
      </span>
      <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: BOLD.ink }}>
        {label}
      </span>
    </div>
  </>
);
