import { MARG, MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia ink button — a handwritten call-to-action underlined in pen;
 * hovering redraws the wobbling underline. Original set for Component Style
 * Studio, inspired by classroom journals. MIT.
 */
export const InkButton = ({
  label = "turn the page →",
  ink = "#2b4a9b",
}: {
  /** Button text */
  label?: string;
  /** Ink color */
  ink?: string;
}) => (
  <>
    <style>{`
      ${MARG_FONT_IMPORT}
      .mg-ink-btn { position: relative; }
      .mg-ink-btn::after {
        content: '';
        position: absolute;
        left: 2%;
        bottom: -2px;
        width: 96%;
        height: 3px;
        background: currentColor;
        border-radius: 40% 60% 50% 50% / 100% 80% 120% 60%;
        transform: scaleX(1);
        transform-origin: left;
        transition: transform .3s ease;
      }
      .mg-ink-btn:hover::after { animation: mg-redraw .45s ease; }
      @keyframes mg-redraw { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
    `}</style>
    <button
      type="button"
      data-link-slot="button"
      className="mg-ink-btn"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: MARG.hand,
        fontWeight: 700,
        fontSize: 26,
        color: ink,
        padding: "2px 4px 4px",
      }}
    >
      {label}
    </button>
  </>
);
