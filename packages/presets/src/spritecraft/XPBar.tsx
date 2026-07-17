import { useId, useState } from "react";
import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft XP bar — a working experience bar: click +XP to gain, segments
 * fill with a chunk pop, and on a full bar the level plate flashes LEVEL UP,
 * increments, and the bar rolls over.
 * Original set for Component Style Studio, inspired by 8-bit game HUDs. MIT.
 */
export const XPBar = ({
  value = 65,
  startLevel = 7,
  gain = 15,
  color = "#4aa3e0",
  width = 300,
}: {
  /** Starting fill 0–100 */
  value?: number;
  /** Starting level */
  startLevel?: number;
  /** XP per click */
  gain?: number;
  /** Fill color */
  color?: string;
  /** Bar width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `sprxp${uid}`;
  const segs = 12;
  const [xp, setXp] = useState(Math.min(100, Math.max(0, value)));
  const [level, setLevel] = useState(startLevel);
  const [ding, setDing] = useState(0);
  const add = () => {
    const next = xp + gain;
    if (next >= 100) {
      setLevel((l) => l + 1);
      setDing((n) => n + 1);
      setXp(next - 100);
    } else {
      setXp(next);
    }
  };
  const filled = Math.round((xp / 100) * segs);
  return (
    <>
      <style>{`${SPR_FONT_IMPORT}
        @keyframes ${cls}-ding { 0% { transform: scale(1); } 40% { transform: scale(1.35) rotate(-3deg); } 100% { transform: scale(1); } }
        .${cls}-lv { display: inline-block; }
        .${cls}-ding .${cls}-lv { animation: ${cls}-ding .5s cubic-bezier(.34,1.56,.64,1); }
        .${cls}-seg { transition: background .18s steps(2), box-shadow .18s steps(2); }
        .${cls}-btn { cursor: pointer; }
        .${cls}-btn:active { transform: translateY(1px); }
      `}</style>
      <div style={{ padding: 6, display: "inline-block" }}>
        <div key={ding} className={ding ? `${cls}-ding` : undefined} style={{ display: "flex", alignItems: "center", gap: 12, width }}>
          <span className={`${cls}-lv`} style={{ fontFamily: SPR.font, fontSize: 11, color: SPR.ink, flexShrink: 0 }}>
            LV {level}
          </span>
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
                className={`${cls}-seg`}
                style={{
                  flex: 1,
                  height: 12,
                  background: i < filled ? color : "rgba(58,44,30,.15)",
                  boxShadow: i < filled ? `inset -2px -2px 0 0 rgba(58,44,30,.3)` : "none",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={add}
            className={`${cls}-btn`}
            style={{
              ...pixelBorder(SPR.ink),
              fontFamily: SPR.font,
              fontSize: 10,
              background: SPR.parchment,
              color: SPR.ink,
              padding: "5px 8px 4px",
              flexShrink: 0,
            }}
          >
            +XP
          </button>
        </div>
      </div>
    </>
  );
};
