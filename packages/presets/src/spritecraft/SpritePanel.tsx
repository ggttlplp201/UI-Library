import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft panel — a 9-slice-look parchment card with a title plate and
 * body copy. Original set for Component Style Studio, inspired by 8-bit game
 * HUDs. MIT.
 */
export const SpritePanel = ({
  title = "INVENTORY",
  body = "A parchment surface with chunky pixel edges. Drop items here, or write the quest brief.",
  width = 300,
}: {
  /** Title plate text */
  title?: string;
  /** Body copy */
  body?: string;
  /** Panel width in px */
  width?: number;
}) => (
  <>
    <style>{SPR_FONT_IMPORT}</style>
    <div style={{ padding: 8, display: "inline-block" }}>
      <div
        style={{
          ...pixelBorder(SPR.ink),
          width,
          background: SPR.parchment,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            margin: "-1px -1px 0",
            background: SPR.parchmentDeep,
            borderBottom: `3px solid ${SPR.ink}`,
            padding: "9px 12px 7px",
            fontFamily: SPR.font,
            fontSize: 11,
            color: SPR.ink,
            letterSpacing: ".04em",
          }}
        >
          {title}
        </div>
        <p
          style={{
            margin: 0,
            padding: "12px 12px 14px",
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 1.5,
            color: SPR.ink,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  </>
);
