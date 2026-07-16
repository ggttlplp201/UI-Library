import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI tooltip — scale+fade in on hover; top / bottom / right
 * placements. (kinetic-ui.md · [COMPONENT] Tooltip)
 */
export const KineticTooltip = ({
  label = "Top",
  text = "Appears above",
  placement = "top",
}: {
  /** Trigger button text */
  label?: string;
  /** Tooltip text */
  text?: string;
  /** Where the tip appears */
  placement?: "top" | "bottom" | "right";
}) => {
  const [on, setOn] = useState(false);
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
    whiteSpace: "nowrap",
    background: KUI.ink,
    color: "#fff",
    fontSize: 12,
    padding: "7px 11px",
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(0,0,0,.22)",
    pointerEvents: "none",
    animation: `kt-tip-in .2s ${KUI.spring} both`,
    fontFamily: KUI.body,
  };
  const byPlacement: Record<string, React.CSSProperties> = {
    top: { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
    right: { left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
  };
  // Reserve space so the tip isn't clipped by the component's own box.
  const pad: React.CSSProperties =
    placement === "top"
      ? { padding: "46px 8px 8px" }
      : placement === "bottom"
        ? { padding: "8px 8px 46px" }
        : { padding: "8px 130px 8px 8px" };
  return (
    <div style={pad}>
      <style>{`@keyframes kt-tip-in { from { opacity: 0; scale: .9; } to { opacity: 1; scale: 1; } }`}</style>
      <div
        style={{ position: "relative", display: "inline-flex" }}
        onMouseEnter={() => setOn(true)}
        onMouseLeave={() => setOn(false)}
      >
        <button
          type="button"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #d9d6cd",
            background: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: KUI.body,
            color: KUI.ink,
          }}
        >
          {label}
        </button>
        {/* Unmounted (not just transparent) while idle — a frozen transition
            or serialized snapshot must never show a stray floating label. */}
        {on && <span style={{ ...base, ...byPlacement[placement] }}>{text}</span>}
      </div>
    </div>
  );
};
