import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld travel button — a blocky ink slab; hover sends the pixel arrow
 * walking in steps. Original set for Component Style Studio, inspired by
 * worldbuilder editorial systems. MIT.
 */
export const TravelButton = ({
  label = "TRAVEL EAST",
  color = "#c86a4a",
}: {
  /** Button label */
  label?: string;
  /** Slab color */
  color?: string;
}) => (
  <>
    <style>{`
      ${OW_FONT_IMPORT}
      @keyframes ow-walk { 0% { transform: translateX(0); } 100% { transform: translateX(6px); } }
      .ow-travel:hover .ow-arrow { animation: ow-walk .35s steps(3) infinite alternate; }
      .ow-travel:active { transform: translate(3px, 3px); box-shadow: 0 0 0 0 ${OW.ink} !important; }
    `}</style>
    <div style={{ padding: 6, display: "inline-block" }}>
      <button
        type="button"
        data-link-slot="button"
        className="ow-travel"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: OW.display,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: ".04em",
          padding: "11px 20px 10px",
          background: color,
          color: OW.parchment,
          border: `4px solid ${OW.ink}`,
          cursor: "pointer",
          textShadow: `2px 2px 0 ${OW.ink}`,
          boxShadow: `5px 5px 0 0 ${OW.ink}`,
          transition: "transform .08s steps(2), box-shadow .08s steps(2)",
        }}
      >
        {label}
        <span className="ow-arrow" style={{ display: "inline-block" }}>▶</span>
      </button>
    </div>
  </>
);
