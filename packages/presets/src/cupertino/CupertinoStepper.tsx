import { CSSProperties, useState } from "react";
import { cuCard, cuControlGlass, cuRowText, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino stepper — the glass –/+ pair with a hairline divider, next to a
 * live quantity row.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoStepper = ({
  label = "Quantity",
  defaultValue = 2,
  min = 0,
  max = 9,
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#ffc79a",
  tint2 = "#ff9fb0",
}: {
  /** Row label */
  label?: string;
  /** Starting value */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** –/+ color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [qty, setQty] = useState(defaultValue);
  const stepBtn: CSSProperties = {
    width: 38,
    height: 32,
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 19,
    fontWeight: 500,
    color: accent,
    fontFamily: CU_FONT,
  };
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 240 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <span style={cuRowText(dark)}>
          {label} {qty}
        </span>
        <div style={{ display: "flex", alignItems: "center", borderRadius: 10, ...cuControlGlass(dark) }}>
          <button type="button" style={stepBtn} onClick={() => setQty((q) => Math.max(min, q - 1))}>
            –
          </button>
          <span style={{ width: 1, height: 18, background: dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)" }} />
          <button type="button" style={stepBtn} onClick={() => setQty((q) => Math.min(max, q + 1))}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};
