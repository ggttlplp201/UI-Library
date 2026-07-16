import { useState } from "react";
import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft toggle — a two-position pixel lever that snaps between OFF
 * and ON plates. Original set for Component Style Studio, inspired by 8-bit
 * game HUDs. MIT.
 */
export const SpriteToggle = ({
  defaultOn = false,
  onColor = "#57a63a",
  offColor = "#e04a4a",
}: {
  /** Initial state */
  defaultOn?: boolean;
  /** ON plate color */
  onColor?: string;
  /** OFF plate color */
  offColor?: string;
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <>
      <style>{SPR_FONT_IMPORT}</style>
      <div style={{ padding: 6, display: "inline-block" }}>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
          style={{
            ...pixelBorder(SPR.ink),
            display: "flex",
            background: SPR.parchmentDeep,
            border: "none",
            cursor: "pointer",
            padding: 4,
            gap: 4,
          }}
        >
          {(["OFF", "ON"] as const).map((side, i) => {
            const active = (i === 1) === on;
            return (
              <span
                key={side}
                style={{
                  fontFamily: SPR.font,
                  fontSize: 10,
                  padding: "7px 10px 5px",
                  background: active ? (on ? onColor : offColor) : "transparent",
                  color: active ? "#fff" : "rgba(58,44,30,.5)",
                  textShadow: active ? `1px 1px 0 ${SPR.ink}` : "none",
                  boxShadow: active ? `0 0 0 2px ${SPR.ink}` : "none",
                  transition: "none",
                }}
              >
                {side}
              </span>
            );
          })}
        </button>
      </div>
    </>
  );
};
