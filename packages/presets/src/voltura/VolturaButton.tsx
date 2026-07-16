import { VOLT, VOLT_FONT_IMPORT } from "./libVolt";

/**
 * Voltura button — olive slab with a lime charge line that sweeps across on
 * hover; the lime variant is the loud one. Original set for Component Style
 * Studio, inspired by dark-luxe trading workspaces. MIT.
 */
export const VolturaButton = ({
  label = "Execute order",
  variant = "panel",
}: {
  /** Button label */
  label?: string;
  /** Olive panel or acid-lime focal */
  variant?: "panel" | "lime";
}) => (
  <>
    <style>{`
      ${VOLT_FONT_IMPORT}
      .vt-btn { position: relative; overflow: hidden; }
      .vt-btn::after {
        content: '';
        position: absolute;
        left: 0; bottom: 0;
        width: 100%; height: 2px;
        background: ${VOLT.lime};
        transform: scaleX(0);
        transform-origin: left;
        transition: transform .35s cubic-bezier(.22,1,.36,1);
      }
      .vt-btn:hover::after { transform: scaleX(1); }
      .vt-btn:active { filter: brightness(1.12); }
    `}</style>
    <button
      type="button"
      data-link-slot="button"
      className="vt-btn"
      style={{
        fontFamily: VOLT.font,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: ".02em",
        padding: "12px 24px",
        borderRadius: 14,
        cursor: "pointer",
        border: variant === "lime" ? "none" : `1px solid ${VOLT.hairline}`,
        background: variant === "lime" ? VOLT.lime : `linear-gradient(165deg, ${VOLT.panel2}, ${VOLT.panel})`,
        color: variant === "lime" ? VOLT.inkOnLime : VOLT.text,
        boxShadow: variant === "lime" ? "0 10px 24px rgba(200,245,66,.25)" : "0 8px 20px rgba(29,32,22,.3)",
      }}
    >
      {label}
    </button>
  </>
);
