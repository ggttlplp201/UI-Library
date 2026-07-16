import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 window — silver chrome frame, navy gradient title bar with
 * pixel-tight controls, and a content well. Original set for Component Style
 * Studio, inspired by mid-90s desktop chrome. MIT.
 */
export const Win95Window = ({
  title = "My Computer",
  body = "It is now safe to compose your page. Drop components into this window's well, or change its title above.",
  width = 340,
}: {
  /** Title bar text */
  title?: string;
  /** Window body copy */
  body?: string;
  /** Window width in px */
  width?: number;
}) => (
  <div style={{ ...bevelOut, width, padding: 3, fontFamily: C95.font, boxSizing: "border-box" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: `linear-gradient(90deg, ${C95.navy}, ${C95.navy2})`,
        color: "#fff",
        padding: "3px 4px 3px 7px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".01em",
      }}
    >
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      {["_", "□", "✕"].map((g) => (
        <button
          key={g}
          type="button"
          style={{
            ...bevelOut,
            width: 18,
            height: 16,
            fontSize: 9,
            lineHeight: "10px",
            fontWeight: 700,
            color: C95.ink,
            cursor: "pointer",
            padding: 0,
            fontFamily: C95.font,
          }}
        >
          {g}
        </button>
      ))}
    </div>
    <div style={{ ...bevelIn, margin: "3px 0 0", padding: "12px 12px 14px", fontSize: 12, lineHeight: 1.5, color: C95.ink }}>
      {body}
    </div>
  </div>
);
