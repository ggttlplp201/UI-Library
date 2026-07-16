import { useState } from "react";
import { MARG, MARG_FONT_IMPORT, ruledPaper } from "./libMarg";

/**
 * Marginalia margin tabs — tabbed page edges sticking out of a notebook;
 * the open tab's page shows through. Each tab is a link slot. Original set
 * for Component Style Studio, inspired by classroom journals. MIT.
 */
const TAB_COLORS = ["#f3c53d", "#7cb884", "#7ea3d9", "#d98a7e"];

export const MarginTab = ({
  tabs = "Notes, Ideas, Todo",
  body = "Flip between sections like pages in a binder — each tab keeps its own color.",
  width = 300,
}: {
  /** Comma-separated tab labels */
  tabs?: string;
  /** Page copy */
  body?: string;
  /** Width in px */
  width?: number;
}) => {
  const items = tabs.split(",").map((s) => s.trim()).filter(Boolean);
  const [active, setActive] = useState(0);
  return (
    <>
      <style>{MARG_FONT_IMPORT}</style>
      <div style={{ width, fontFamily: MARG.hand, boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 4, paddingLeft: 14 }}>
          {items.map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              data-link-slot={t}
              onClick={() => setActive(i)}
              style={{
                background: TAB_COLORS[i % TAB_COLORS.length],
                border: "none",
                borderRadius: "8px 8px 0 0",
                padding: active === i ? "7px 16px 9px" : "5px 14px 7px",
                marginTop: active === i ? 0 : 4,
                fontFamily: MARG.hand,
                fontWeight: 700,
                fontSize: 18,
                color: "#3c3628",
                cursor: "pointer",
                boxShadow: "0 -1px 2px rgba(60,50,30,.15)",
                opacity: active === i ? 1 : 0.75,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ ...ruledPaper(26, 26), padding: "16px 16px 18px 40px", fontSize: 21, lineHeight: "26px", color: MARG.ink }}>
          {body}
        </div>
      </div>
    </>
  );
};
