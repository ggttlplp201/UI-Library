import { cuCard, CuAppearance } from "../lib/cupertino";

/**
 * Cupertino avatar stack — overlapping system-color discs with theme-matched
 * rims.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoAvatarStack = ({
  colors = "#0A84FF, #30d158, #ff9f0a, #bf5af2",
  appearance = "light",
  tint1 = "#ffd89a",
  tint2 = "#ffa0c0",
}: {
  /** Comma-separated avatar colors */
  colors?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const cols = colors.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block", padding: 16 }}>
      <div style={{ display: "flex" }}>
        {cols.map((c, i) => (
          <span
            key={`${c}-${i}`}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: c,
              border: `2px solid ${dark ? "#000" : "#fff"}`,
              marginLeft: i ? -8 : 0,
              boxShadow: "0 1px 3px rgba(0,0,0,.2)",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    </div>
  );
};
