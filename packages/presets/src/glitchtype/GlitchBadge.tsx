/**
 * Glitchtype badge — a yellow highlight block with ink outline, the kit's
 * signature accent mark. Original set for Component Style Studio, inspired
 * by the Glitchtype design language. MIT.
 */
export const GlitchBadge = ({
  label = "BETA//",
  ink = "#141310",
  highlight = "#f5e04b",
}: {
  /** Badge text */
  label?: string;
  /** Ink color */
  ink?: string;
  /** Block color */
  highlight?: string;
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
      .gt-badge:hover { text-shadow: 1.5px 0 #f0323c, -1.5px 0 #32c8f0; }
    `}</style>
    <span
      className="gt-badge"
      style={{
        display: "inline-block",
        fontFamily: "'VT323', monospace",
        fontSize: 18,
        letterSpacing: ".06em",
        padding: "1px 10px 0",
        background: highlight,
        color: ink,
        outline: `1px solid ${ink}`,
        boxShadow: `2px 2px 0 0 ${ink}`,
      }}
    >
      {label}
    </span>
  </>
);
