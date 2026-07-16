import { CSSProperties } from "react";
import { cuAlpha, cuCard, cuControlGlass, cuInk, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino badge — accent, green, glass, or red count pill.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoBadge = ({
  label = "New",
  variant = "accent",
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#ff9ecb",
  tint2 = "#ffc79a",
}: {
  /** Badge text (or the number for count) */
  label?: string;
  /** Badge style */
  variant?: "accent" | "green" | "glass" | "count";
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
  const base: CSSProperties = {
    padding: "5px 11px",
    borderRadius: 9,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: CU_FONT,
    display: "inline-block",
  };
  const styles: Record<string, CSSProperties> = {
    accent: { ...base, color: "#fff", background: accent, boxShadow: `0 2px 8px ${cuAlpha(accent, 0.35)}` },
    green: { ...base, color: "#fff", background: "#30d158" },
    glass: { ...base, color: cuInk(dark).head, ...cuControlGlass(dark) },
    count: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 22,
      height: 22,
      padding: "0 6px",
      borderRadius: 11,
      fontSize: 12,
      fontWeight: 700,
      color: "#fff",
      background: "#ff453a",
      fontFamily: CU_FONT,
      boxSizing: "border-box",
    },
  };
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block", padding: 16 }}>
      <span style={styles[variant]}>{label}</span>
    </div>
  );
};
