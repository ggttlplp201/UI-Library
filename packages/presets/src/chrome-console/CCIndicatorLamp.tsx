import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console indicator lamps — chrome-bezel lamps; on = bright ember
 * core with a tight glow; click toggles each.
 * (chrome-console.md · IndicatorLamp)
 */
export const CCIndicatorLamp = ({
  accent = "#FF7A1A",
  finish = "chrome",
  count = 4,
}: {
  /** Active accent (lit lens) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Number of lamps (1–6) */
  count?: number;
}) => {
  const n = Math.min(6, Math.max(1, count));
  const [lamps, setLamps] = useState<boolean[]>(() => Array.from({ length: n }, (_, i) => i === 0));
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Indicators",
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
      {lamps.map((on, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setLamps((cur) => cur.map((v, j) => (j === i ? !v : v)))}
          style={{
            ...sx(`position:relative;width:38px;height:38px;border-radius:50%;border:none;cursor:pointer;background:${m.chromeV};box-shadow:${m.raised}`),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={sx(`width:18px;height:18px;border-radius:50%;background:${on ? `radial-gradient(circle at 42% 34%,#fff,#ffd9a0 18%,${accent} 46%,${m.A(0.85)} 78%)` : "radial-gradient(circle at 42% 34%,#3a434c,#12181e 70%)"};box-shadow:${on ? `inset 0 0 3px rgba(255,255,255,.7),0 0 6px 1px ${m.A(1)},0 0 13px 3px ${m.A(0.55)}` : "inset 0 2px 3px rgba(0,0,0,.9),inset 0 -1px 1px rgba(255,255,255,.1)"}${on ? ";animation:cc-lamp 2.4s ease-in-out infinite" : ""}`)}
          />
        </button>
      ))}
    </div>,
    <>TAP&nbsp;TO&nbsp;ARM</>,
  );
};
