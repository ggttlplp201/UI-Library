import { useState } from "react";
import { C95, bevelOut } from "./lib95";

/**
 * Chicago 95 tabs — properties-sheet tabs where the active page lifts above
 * the panel line. Original set for Component Style Studio, inspired by
 * mid-90s desktop chrome. MIT.
 */
export const Win95Tabs = ({
  tabs = "General, Sharing, Tools",
  body = "Adjust the selected page's settings here. Every control keeps its beveled chrome.",
  width = 320,
}: {
  /** Comma-separated tab labels */
  tabs?: string;
  /** Panel copy */
  body?: string;
  /** Panel width in px */
  width?: number;
}) => {
  const items = tabs.split(",").map((s) => s.trim()).filter(Boolean);
  const [active, setActive] = useState(0);
  return (
    <div style={{ width, fontFamily: C95.font, boxSizing: "border-box" }}>
      <div style={{ display: "flex", marginBottom: -2, position: "relative", zIndex: 1, paddingLeft: 4 }}>
        {items.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            style={{
              background: C95.chrome,
              borderTop: `2px solid ${C95.chromeLight}`,
              borderLeft: `2px solid ${C95.chromeLight}`,
              borderRight: `2px solid ${C95.chromeDarker}`,
              borderBottom: "none",
              padding: active === i ? "5px 12px 7px" : "4px 10px 5px",
              marginTop: active === i ? 0 : 3,
              fontSize: 11,
              color: C95.ink,
              cursor: "pointer",
              fontFamily: C95.font,
              position: "relative",
              zIndex: active === i ? 2 : 0,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ ...bevelOut, padding: "16px 14px", fontSize: 12, lineHeight: 1.5, color: C95.ink }}>{body}</div>
    </div>
  );
};
