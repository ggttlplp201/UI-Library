import { useState } from "react";
import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft button — a chunky 8-bit slab with a hard drop shadow that
 * collapses on press. Original set for Component Style Studio, inspired by
 * 8-bit game HUDs. MIT.
 */
export const SpriteButton = ({
  label = "START",
  color = "#57a63a",
  textColor = "#ffffff",
}: {
  /** Button label */
  label?: string;
  /** Slab color */
  color?: string;
  /** Label color */
  textColor?: string;
}) => {
  const [down, setDown] = useState(false);
  return (
    <>
      <style>{SPR_FONT_IMPORT}</style>
      <div style={{ padding: 6, display: "inline-block" }}>
        <button
          type="button"
          data-link-slot="button"
          onPointerDown={() => setDown(true)}
          onPointerUp={() => setDown(false)}
          onPointerLeave={() => setDown(false)}
          style={{
            ...pixelBorder(SPR.ink),
            fontFamily: SPR.font,
            fontSize: 13,
            padding: "12px 20px 10px",
            background: color,
            color: textColor,
            border: "none",
            cursor: "pointer",
            textShadow: `2px 2px 0 ${SPR.ink}`,
            transform: down ? "translate(3px, 3px)" : "none",
            filter: down ? "brightness(.92)" : "none",
            boxShadow: down
              ? (pixelBorder(SPR.ink).boxShadow as string)
              : `${pixelBorder(SPR.ink).boxShadow}, 6px 6px 0 0 rgba(58,44,30,.45)`,
          }}
        >
          {label}
        </button>
      </div>
    </>
  );
};
