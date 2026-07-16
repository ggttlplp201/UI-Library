import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI checkbox — animated tick scales in on a spring.
 * (kinetic-ui.md · [COMPONENT] Checkbox)
 */
export const KineticCheckbox = ({
  label = "Checked",
  defaultChecked = true,
  accent = "#4B3BFF",
}: {
  /** Label next to the box */
  label?: string;
  /** Initial state */
  defaultChecked?: boolean;
  /** Accent color (theme prop) */
  accent?: string;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setChecked((v) => !v)}
      aria-pressed={checked}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        cursor: "pointer",
        fontFamily: KUI.body,
        color: KUI.ink,
        // Self-contained surface: the label must survive any page background.
        background: KUI.card,
        border: `1px solid ${KUI.border}`,
        borderRadius: KUI.radius,
        padding: "10px 14px",
        boxShadow: KUI.shadow,
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `all .25s ${KUI.spring}`,
          background: checked ? accent : "#fff",
          border: `2px solid ${checked ? accent : "#d5d2c8"}`,
          boxSizing: "border-box",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform .25s .04s, opacity .2s",
            transform: checked ? "scale(1)" : "scale(.2)",
            opacity: checked ? 1 : 0,
          }}
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    </button>
  );
};
