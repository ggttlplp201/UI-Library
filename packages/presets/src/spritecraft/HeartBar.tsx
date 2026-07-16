import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft heart bar — the HP row: pixel hearts, filled then hollow.
 * Original set for Component Style Studio, inspired by 8-bit game HUDs. MIT.
 */
const Heart = ({ filled }: { filled: boolean }) => (
  <span
    style={{
      display: "inline-block",
      width: 22,
      height: 20,
      position: "relative",
      filter: filled ? "none" : "grayscale(1) opacity(.35)",
    }}
  >
    {/* pixel heart from two squares + a tip */}
    <span style={{ position: "absolute", left: 1, top: 2, width: 9, height: 9, background: SPR.heart, boxShadow: `0 0 0 2px ${SPR.ink}` }} />
    <span style={{ position: "absolute", right: 1, top: 2, width: 9, height: 9, background: SPR.heart, boxShadow: `0 0 0 2px ${SPR.ink}` }} />
    <span style={{ position: "absolute", left: 5, top: 8, width: 12, height: 8, background: SPR.heart, boxShadow: `0 0 0 2px ${SPR.ink}` }} />
    <span style={{ position: "absolute", left: 8, bottom: 0, width: 6, height: 5, background: SPR.heart, boxShadow: `0 0 0 2px ${SPR.ink}` }} />
  </span>
);

export const HeartBar = ({
  hearts = 5,
  filled = 3,
  label = "HP",
}: {
  /** Total hearts */
  hearts?: number;
  /** Filled hearts */
  filled?: number;
  /** Row label */
  label?: string;
}) => (
  <>
    <style>{SPR_FONT_IMPORT}</style>
    <div style={{ padding: 6, display: "inline-block" }}>
      <div
        style={{
          ...pixelBorder(SPR.ink),
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: SPR.parchment,
          padding: "9px 14px 7px",
        }}
      >
        <span style={{ fontFamily: SPR.font, fontSize: 11, color: SPR.ink }}>{label}</span>
        {Array.from({ length: Math.max(1, hearts) }, (_, i) => (
          <Heart key={i} filled={i < filled} />
        ))}
      </div>
    </div>
  </>
);
