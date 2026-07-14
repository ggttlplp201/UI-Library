import { useState } from "react";
import { KLAB } from "../lib/klab";

/**
 * Kinetic Lab elastic toggle — the knob overshoots and settles
 * (cubic-bezier(.68,-0.6,.32,1.7)); ON/OFF mono label.
 * (kinetic-lab.md · [COMPONENT] ElasticToggle)
 */
export const ElasticToggle = ({
  defaultOn = true,
  accent = "#E3B23C",
}: {
  /** Initial state */
  defaultOn?: boolean;
  /** Accent color (track when on) */
  accent?: string;
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: KLAB.ui }}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        style={{
          width: 62,
          height: 34,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 0,
          transition: "background .4s ease",
          background: on ? accent : "rgba(255,255,255,.14)",
          boxShadow: on ? `0 0 18px ${accent}55` : "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#fff",
            transition: "transform .5s cubic-bezier(.68,-0.6,.32,1.7)",
            transform: on ? "translateX(28px)" : "translateX(0)",
          }}
        />
      </button>
      <span style={{ fontFamily: KLAB.mono, fontSize: 13, color: KLAB.muted, width: 34 }}>
        {on ? "ON" : "OFF"}
      </span>
    </div>
  );
};
