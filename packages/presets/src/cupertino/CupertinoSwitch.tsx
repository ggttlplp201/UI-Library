import { useState } from "react";
import { cuAlpha, cuCard, cuRowText, CuAppearance } from "../lib/cupertino";

/**
 * Cupertino switch — the iOS toggle with the overshooting knob spring
 * (.28s cubic-bezier(.34,1.56,.64,1)) in a labeled settings row.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoSwitch = ({
  label = "Wi-Fi",
  defaultOn = true,
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#7fe0c0",
  tint2 = "#8fd0ff",
}: {
  /** Row label */
  label?: string;
  /** Initial state */
  defaultOn?: boolean;
  /** Accent color when on */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 240 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <span style={cuRowText(dark)}>{label}</span>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
          style={{
            position: "relative",
            width: 52,
            height: 32,
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            transition: "background .25s",
            background: on ? accent : dark ? "rgba(120,120,128,.4)" : "rgba(120,120,128,.24)",
            boxShadow: on ? `inset 0 0 0 1px ${cuAlpha(accent, 0.3)}` : "inset 0 1px 3px rgba(0,0,0,.15)",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,.28), 0 0 1px rgba(0,0,0,.2)",
              transition: "transform .28s cubic-bezier(.34,1.56,.64,1)",
              transform: on ? "translateX(20px)" : "translateX(0)",
            }}
          />
        </button>
      </div>
    </div>
  );
};
