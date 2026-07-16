import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft XP bar — segmented experience fill with level plates at each
 * end. Original set for Component Style Studio, inspired by 8-bit game HUDs.
 * MIT.
 */
export const XPBar = ({
  value = 65,
  level = "LV 7",
  color = "#4aa3e0",
  width = 280,
}: {
  /** Fill 0–100 */
  value?: number;
  /** Level plate text */
  level?: string;
  /** Fill color */
  color?: string;
  /** Bar width in px */
  width?: number;
}) => {
  const segs = 12;
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * segs);
  return (
    <>
      <style>{SPR_FONT_IMPORT}</style>
      <div style={{ padding: 6, display: "inline-block" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, width }}>
          <span style={{ fontFamily: SPR.font, fontSize: 11, color: SPR.ink, flexShrink: 0 }}>{level}</span>
          <div
            style={{
              ...pixelBorder(SPR.ink),
              flex: 1,
              display: "flex",
              gap: 3,
              background: SPR.parchmentDeep,
              padding: 4,
            }}
          >
            {Array.from({ length: segs }, (_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 12,
                  background: i < filled ? color : "rgba(58,44,30,.15)",
                  boxShadow: i < filled ? `inset -2px -2px 0 0 rgba(58,44,30,.3)` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
