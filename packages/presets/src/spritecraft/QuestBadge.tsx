import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft quest badge — a gold-trim marker plate ("NEW QUEST!") with a
 * pixel exclamation. Original set for Component Style Studio, inspired by
 * 8-bit game HUDs. MIT.
 */
export const QuestBadge = ({
  label = "NEW QUEST!",
  color = "#f2b632",
}: {
  /** Badge text */
  label?: string;
  /** Plate color */
  color?: string;
}) => (
  <>
    <style>{`
      ${SPR_FONT_IMPORT}
      @keyframes spr-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    `}</style>
    <div style={{ padding: 6, display: "inline-block" }}>
      <span
        style={{
          ...pixelBorder(SPR.ink),
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: color,
          padding: "7px 12px 5px",
          fontFamily: SPR.font,
          fontSize: 11,
          color: SPR.ink,
          animation: "spr-bounce 1s steps(2) infinite",
        }}
      >
        <span style={{ fontSize: 13 }}>!</span>
        {label}
      </span>
    </div>
  </>
);
