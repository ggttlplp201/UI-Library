import { cuCard, cuInk, cuRowText, CuAppearance } from "../lib/cupertino";

/**
 * Cupertino list — the grouped inset settings list: colored icon squares,
 * hairline separators, chevrons. Each row is its own link slot.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
const DOTS = ["#0A84FF", "#30d158", "#ff9f0a", "#bf5af2", "#ff453a"];

export const CupertinoList = ({
  items = "General, Privacy, Notifications",
  appearance = "light",
  tint1 = "#b6a0ff",
  tint2 = "#8fb4ff",
}: {
  /** Comma-separated row labels */
  items?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const rows = items.split(",").map((s) => s.trim()).filter(Boolean);
  const ink = cuInk(dark);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), padding: "8px 0", minWidth: 280 }}>
      {rows.map((label, i) => (
        <div
          key={`${label}-${i}`}
          data-link-slot={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 18px",
            cursor: "pointer",
            borderBottom:
              i < rows.length - 1
                ? `.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)"}`
                : undefined,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              flexShrink: 0,
              background: DOTS[i % DOTS.length],
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)",
            }}
          />
          <span style={{ ...cuRowText(dark), flex: 1 }}>{label}</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRight: `2px solid ${ink.sub}`,
              borderTop: `2px solid ${ink.sub}`,
              transform: "rotate(45deg)",
              opacity: 0.6,
            }}
          />
        </div>
      ))}
    </div>
  );
};
