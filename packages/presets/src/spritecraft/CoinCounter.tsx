import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft coin counter — a spinning gold coin beside the score readout.
 * Original set for Component Style Studio, inspired by 8-bit game HUDs. MIT.
 */
export const CoinCounter = ({
  count = "×2450",
}: {
  /** Score text */
  count?: string;
}) => (
  <>
    <style>{`
      ${SPR_FONT_IMPORT}
      @keyframes spr-coin { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.15); } }
    `}</style>
    <div style={{ padding: 6, display: "inline-block" }}>
      <div
        style={{
          ...pixelBorder(SPR.ink),
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: SPR.parchment,
          padding: "8px 16px 7px",
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            background: SPR.gold,
            boxShadow: `0 0 0 2px ${SPR.ink}, inset -3px -3px 0 0 rgba(58,44,30,.35)`,
            animation: "spr-coin 1s steps(4) infinite",
          }}
        />
        <span style={{ fontFamily: SPR.font, fontSize: 13, color: SPR.ink }}>{count}</span>
      </div>
    </div>
  </>
);
