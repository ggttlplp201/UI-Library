import { CSSProperties, useState } from "react";
import { cuAlpha, cuCard, cuControlGlass, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino button — liquid-glass kit. Five iOS variants on a self-tinted
 * glass card; presses compress on the .12s transform curve.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoButton = ({
  label = "Continue",
  variant = "filled",
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#8fb4ff",
  tint2 = "#c9a0ff",
}: {
  /** Button text */
  label?: string;
  /** iOS button style */
  variant?: "filled" | "glass" | "tinted" | "plain" | "danger";
  /** Accent color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [pressed, setPressed] = useState(false);
  const base: CSSProperties = {
    padding: "12px 18px",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform .12s, filter .15s",
    border: "none",
    fontFamily: CU_FONT,
    transform: pressed ? "scale(.97)" : "none",
  };
  const variants: Record<string, CSSProperties> = {
    filled: {
      color: "#fff",
      background: accent,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,.4), 0 4px 12px ${cuAlpha(accent, 0.4)}`,
    },
    glass: {
      color: accent,
      ...cuControlGlass(dark),
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.6), 0 4px 12px rgba(30,40,80,.1)",
    },
    tinted: { color: accent, background: cuAlpha(accent, 0.16) },
    plain: { color: accent, background: "none" },
    danger: {
      color: "#fff",
      background: "#ff453a",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px rgba(255,69,58,.4)",
    },
  };
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block" }}>
      <button
        type="button"
        data-link-slot="button"
        style={{ ...base, ...variants[variant] }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        {label}
      </button>
    </div>
  );
};
