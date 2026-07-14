import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI switch — iOS-ish track + knob with an overshoot spring.
 * (kinetic-ui.md · [COMPONENT] Switch)
 */
export const KineticSwitch = ({
  label = "Enable notifications",
  defaultOn = true,
  accent = "#4B3BFF",
}: {
  /** Row label next to the switch */
  label?: string;
  /** Initial state */
  defaultOn?: boolean;
  /** Accent color (theme prop) */
  accent?: string;
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        minWidth: 240,
        fontFamily: KUI.body,
        color: KUI.ink,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        style={{
          width: 48,
          height: 28,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 0,
          transition: "background .3s",
          background: on ? accent : "#d5d2c8",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,.28)",
            transition: `transform .32s ${KUI.spring}`,
            transform: on ? "translateX(20px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
};
