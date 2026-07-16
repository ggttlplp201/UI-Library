import { useState } from "react";
import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura tabs — workspace pills where the active tab carries the lime
 * charge. Original set for Component Style Studio, inspired by dark-luxe
 * trading workspaces. MIT.
 */
export const VolturaTabs = ({
  tabs = "Spot, Perps, Vaults",
  defaultIndex = 0,
}: {
  /** Comma-separated tab labels */
  tabs?: string;
  /** Initially active tab (0-based) */
  defaultIndex?: number;
}) => {
  const items = tabs.split(",").map((s) => s.trim()).filter(Boolean);
  const [active, setActive] = useState(Math.min(defaultIndex, items.length - 1));
  return (
    <>
      <style>{VOLT_FONT_IMPORT}</style>
      <div style={{ ...voltPanel, display: "inline-flex", gap: 4, padding: 5, borderRadius: 16, fontFamily: VOLT.font }}>
        {items.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            style={{
              border: "none",
              cursor: "pointer",
              fontFamily: VOLT.font,
              fontSize: 13,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 12,
              background: active === i ? VOLT.lime : "transparent",
              color: active === i ? VOLT.inkOnLime : VOLT.dim,
              boxShadow: active === i ? "0 6px 16px rgba(200,245,66,.25)" : "none",
              transition: "all .2s ease",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
};
