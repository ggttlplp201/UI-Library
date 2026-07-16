import { cuCard, CuAppearance } from "../lib/cupertino";

/**
 * Cupertino progress — the determinate accent bar on a hairline track.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoProgress = ({
  value = 64,
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#8fd8ff",
  tint2 = "#8fb4ff",
}: {
  /** Progress 0–100 */
  value?: number;
  /** Fill color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 260 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 6,
          borderRadius: 3,
          overflow: "hidden",
          background: dark ? "rgba(120,120,128,.4)" : "rgba(120,120,128,.2)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${Math.min(100, Math.max(0, value))}%`,
            borderRadius: 3,
            background: accent,
            transition: "width .3s ease",
          }}
        />
      </div>
    </div>
  );
};
