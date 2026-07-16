import { useState } from "react";
import { cuCard, cuInk, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino slider — accent fill, big white knob, live percentage readout.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoSlider = ({
  defaultValue = 62,
  accent = "#0A84FF",
  showValue = true,
  appearance = "light",
  tint1 = "#9fd0ff",
  tint2 = "#a0f0d0",
}: {
  /** Initial value 0–100 */
  defaultValue?: number;
  /** Fill color */
  accent?: string;
  /** Show the % readout under the track */
  showValue?: boolean;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [value, setValue] = useState(Math.min(100, Math.max(0, defaultValue)));
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 260 }}>
      <div style={{ position: "relative", height: 30, display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 5,
            borderRadius: 3,
            background: dark ? "rgba(120,120,128,.4)" : "rgba(120,120,128,.2)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${value}%`,
              borderRadius: 3,
              background: accent,
            }}
          />
        </div>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: `${value}%`,
            transform: "translate(-50%,-50%)",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#fff",
            pointerEvents: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,.25), 0 0 1px rgba(0,0,0,.2)",
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", height: 30, opacity: 0, cursor: "grab", margin: 0 }}
        />
      </div>
      {showValue && (
        <div
          style={{
            textAlign: "right",
            fontSize: 13,
            fontWeight: 600,
            color: cuInk(dark).sub,
            marginTop: 6,
            fontFamily: CU_FONT,
          }}
        >
          {value}%
        </div>
      )}
    </div>
  );
};
