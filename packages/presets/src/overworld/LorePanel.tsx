import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld lore panel — an editorial parchment column with a pixel drop
 * cap and serif body. Original set for Component Style Studio, inspired by
 * worldbuilder editorial systems. MIT.
 */
export const LorePanel = ({
  text = "Before the rivers had names, the cartographers walked the ridge with nothing but string and patience. What they drew is the map we still argue about.",
  dropColor = "#7a4a8a",
  width = 320,
}: {
  /** Lore paragraph (first letter becomes the drop cap) */
  text?: string;
  /** Drop-cap plate color */
  dropColor?: string;
  /** Panel width in px */
  width?: number;
}) => {
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
      </div>
    </>
  );
};
