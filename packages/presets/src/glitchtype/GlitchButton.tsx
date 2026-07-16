/**
 * Glitchtype button — hard-edged ink block; hover triggers RGB aberration
 * and the label swaps to its "//OK" form. Original set for Component Style
 * Studio, inspired by the Glitchtype design language. MIT.
 */
export const GlitchButton = ({
  label = "EXECUTE",
  hoverLabel = "//OK",
  ink = "#141310",
  paper = "#f3efe4",
  filled = true,
}: {
  /** Button label */
  label?: string;
  /** Label swapped in on hover */
  hoverLabel?: string;
  /** Ink color */
  ink?: string;
  /** Paper color */
  paper?: string;
  /** Filled ink block vs outline */
  filled?: boolean;
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
      .gt-btn {
        font-family: 'VT323', 'Courier New', monospace;
        font-size: 20px;
        letter-spacing: .06em;
        padding: 8px 22px 6px;
        border: 1px solid var(--gt-ink);
        border-radius: 0;
        cursor: pointer;
        position: relative;
        transition: transform .08s steps(2);
      }
      .gt-btn .gt-b-alt { display: none; }
      .gt-btn:hover { text-shadow: 2px 0 #f0323c, -2px 0 #32c8f0; transform: translate(-1px, -1px); }
      .gt-btn:hover .gt-b-main { display: none; }
      .gt-btn:hover .gt-b-alt { display: inline; }
      .gt-btn:active { transform: translate(1px, 1px); text-shadow: none; }
    `}</style>
    <button
      type="button"
      data-link-slot="button"
      className="gt-btn"
      style={
        {
          "--gt-ink": ink,
          background: filled ? ink : paper,
          color: filled ? paper : ink,
          boxShadow: `3px 3px 0 0 ${filled ? "rgba(20,19,16,.35)" : ink}`,
        } as React.CSSProperties
      }
    >
      <span className="gt-b-main">{label}</span>
      <span className="gt-b-alt">{hoverLabel}</span>
    </button>
  </>
);
