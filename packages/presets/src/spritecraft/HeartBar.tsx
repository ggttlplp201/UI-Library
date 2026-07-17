import { useId, useState } from "react";
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
  /** Starting filled hearts (click hearts to take damage / heal) */
  filled?: number;
  /** Row label */
  label?: string;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `sprhp${uid}`;
  const total = Math.max(1, hearts);
  const [hp, setHp] = useState(Math.min(total, filled));
  const [hurt, setHurt] = useState(0);
  const set = (next: number) => {
    if (next < hp) setHurt((n) => n + 1);
    setHp(next);
  };
  return (
    <>
      <style>{`${SPR_FONT_IMPORT}
        @keyframes ${cls}-sh { 0%,100% { transform: translate(0); } 25% { transform: translate(-3px, 1px); } 75% { transform: translate(3px, -1px); } }
        .${cls}-hurt { animation: ${cls}-sh .16s linear 2; }
        .${cls}-h { cursor: pointer; transition: transform .12s ease; background: none; border: none; padding: 0; }
        .${cls}-h:hover { transform: scale(1.15); }
      `}</style>
      <div style={{ padding: 6, display: "inline-block" }}>
        <div
          key={hurt}
          className={hurt ? `${cls}-hurt` : undefined}
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
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`${cls}-h`}
              title={i + 1 <= hp ? "Take damage" : "Heal"}
              onClick={() => set(i + 1 === hp ? i : i + 1)}
            >
              <Heart filled={i < hp} />
            </button>
          ))}
          <span style={{ fontFamily: SPR.font, fontSize: 11, color: SPR.ink, marginLeft: 4 }}>
            {hp}/{total}
          </span>
        </div>
      </div>
    </>
  );
};
