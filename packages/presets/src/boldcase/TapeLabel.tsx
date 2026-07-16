import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase tape label — an angled strip of printed tape for annotating
 * layouts. Original set for Component Style Studio, inspired by
 * studio-editorial bento systems. MIT.
 */
export const TapeLabel = ({
  text = "WORK IN PROGRESS",
  color = "#ffd750",
  tilt = -3,
}: {
  /** Tape text */
  text?: string;
  /** Tape color */
  color?: string;
  /** Tilt in degrees */
  tilt?: number;
}) => (
  <>
    <style>{BOLD_FONT_IMPORT}</style>
    <div style={{ padding: 10, display: "inline-block" }}>
      <span
        style={{
          display: "inline-block",
          background: color,
          color: BOLD.ink,
          fontFamily: BOLD.display,
          fontSize: 14,
          letterSpacing: ".08em",
          padding: "7px 22px 6px",
          transform: `rotate(${tilt}deg)`,
          boxShadow: "0 2px 6px rgba(24,21,17,.25)",
          clipPath: "polygon(2% 0, 98% 4%, 100% 100%, 0 96%)",
          opacity: 0.94,
        }}
      >
        {text}
      </span>
    </div>
  </>
);
