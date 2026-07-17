import { useState } from "react";
import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld lore panel — an editorial parchment column with a pixel drop
 * cap and serif body. Original set for Component Style Studio, inspired by
 * worldbuilder editorial systems. MIT.
 */
export const LorePanel = ({
  text = "Before the rivers had names, the cartographers walked the ridge with nothing but string and patience. What they drew is the map we still argue about.",
  more = "Every reprint since has moved the marsh a finger west. The guild insists the marsh itself is what moves; the printers say nothing, and sell more maps.",
  dropColor = "#7a4a8a",
  width = 320,
}: {
  /** Lore paragraph (first letter becomes the drop cap) */
  text?: string;
  /** Extra lore revealed by 'Read on' (empty hides the control) */
  more?: string;
  /** Drop-cap plate color */
  dropColor?: string;
  /** Panel width in px */
  width?: number;
}) => {
  const [open, setOpen] = useState(false);
  const first = text.charAt(0);
  const rest = text.slice(1);
  return (
    <>
      <style>{OW_FONT_IMPORT}</style>
      <div style={{ width, background: OW.parchment, border: `4px solid ${OW.ink}`, padding: "16px 18px", boxSizing: "border-box" }}>
        <p style={{ margin: 0, fontFamily: OW.body, fontSize: 14, lineHeight: 1.62, color: "#4c3f2c" }}>
          <span
            style={{
              float: "left",
              fontFamily: OW.display,
              fontWeight: 700,
              fontSize: 34,
              lineHeight: 1,
              background: dropColor,
              color: OW.parchment,
              padding: "6px 10px",
              margin: "2px 10px 2px 0",
              boxShadow: `3px 3px 0 0 ${OW.ink}`,
              textShadow: `2px 2px 0 ${OW.ink}`,
            }}
          >
            {first}
          </span>
          {rest}
        </p>
        {open && more ? (
          <p style={{ margin: "10px 0 0", fontFamily: OW.body, fontSize: 14, lineHeight: 1.62, color: "#4c3f2c" }}>{more}</p>
        ) : null}
        {more ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
              marginTop: 12,
              fontFamily: OW.display,
              fontSize: 11,
              background: OW.parchmentDeep,
              color: OW.ink,
              border: `3px solid ${OW.ink}`,
              boxShadow: `3px 3px 0 0 ${OW.ink}`,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {open ? "▲ FOLD" : "▼ READ ON"}
          </button>
        ) : null}
      </div>
    </>
  );
};
