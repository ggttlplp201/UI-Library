import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI slider — track + fill + thumb + value bubble, driven by a
 * transparent native range input overlay (real dragging).
 * (kinetic-ui.md · [COMPONENT] Slider)
 */
export const KineticSlider = ({
  defaultValue = 64,
  accent = "#4B3BFF",
}: {
  /** Initial value (0–100) */
  defaultValue?: number;
  /** Accent color (fill + thumb ring) */
  accent?: string;
}) => {
  const [value, setValue] = useState(() => Math.min(100, Math.max(0, defaultValue)));
  return (
    <div style={{ position: "relative", height: 36, display: "flex", alignItems: "center", minWidth: 320, fontFamily: KUI.body }}>
      <div style={{ position: "relative", width: "100%", height: 6, background: KUI.hairline, borderRadius: 999 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${value}%`,
            background: accent,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${value}%`,
            transform: "translate(-50%,-50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            border: `2.5px solid ${accent}`,
            boxShadow: "0 2px 8px rgba(20,20,30,.22)",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: `${value}%`,
            transform: "translateX(-50%)",
            background: KUI.ink,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: KUI.mono,
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {value}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ position: "absolute", inset: 0, width: "100%", height: 36, opacity: 0, cursor: "pointer", margin: 0 }}
      />
    </div>
  );
};
