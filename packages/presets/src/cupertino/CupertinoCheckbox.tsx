import { useState } from "react";
import { cuCard, cuInk, cuRowText, CuAppearance } from "../lib/cupertino";

/**
 * Cupertino checkbox — rounded-square accent check with an .18s ease between
 * outline and filled states.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoCheckbox = ({
  label = "Enabled",
  defaultChecked = true,
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#a9b6ff",
  tint2 = "#9fd8ff",
}: {
  /** Row label */
  label?: string;
  /** Initial state */
  defaultChecked?: boolean;
  /** Checked color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [on, setOn] = useState(defaultChecked);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 7,
            fontSize: 14,
            color: "#fff",
            transition: "all .18s",
            background: on ? accent : "none",
            border: on ? "none" : `2px solid ${cuInk(dark).sub}`,
            boxSizing: "border-box",
          }}
        >
          {on ? "✓" : ""}
        </span>
        <span style={cuRowText(dark)}>{label}</span>
      </button>
    </div>
  );
};
