import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

const SEL_ANGLES = [-80, -40, 0, 40, 80];

/**
 * Chrome Console selector dial — knurled 5-position dial; click advances,
 * selected number lights up; POS readout. (chrome-console.md · SelectorDial)
 */
export const CCSelectorDial = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultPosition = 3,
}: {
  /** Active accent (selected number/pointer) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial position (1–5) */
  defaultPosition?: number;
}) => {
  const [sel, setSel] = useState(() => Math.min(4, Math.max(0, defaultPosition - 1)));
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Selector",
    <div style={{ position: "relative", width: 150, height: 120 }}>
      {SEL_ANGLES.map((a, i) => {
        const rad = ((a - 90) * Math.PI) / 180;
        const R = 62;
        const x = 75 + Math.cos(rad) * R;
        const y = 74 + Math.sin(rad) * R;
        const on = sel === i;
        return (
          <span
            key={a}
            style={sx(`position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;transform:translate(-50%,-50%);font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;color:${on ? accent : m.panelText};text-shadow:${on ? `0 0 7px ${m.A(0.85)}` : m.panelSh}`)}
          >
            {i + 1}
          </span>
        );
      })}
      <div
        style={sx(`position:absolute;left:75px;top:74px;width:88px;height:88px;transform:translate(-50%,-50%);border-radius:50%;background:linear-gradient(180deg,#0e1216,#2a323a);box-shadow:${m.wellIn}`)}
      >
        <button
          type="button"
          onClick={() => setSel((s) => (s + 1) % 5)}
          style={{
            ...sx(`position:absolute;top:50%;left:50%;width:70px;height:70px;transform:translate(-50%,-50%) rotate(${SEL_ANGLES[sel]}deg);border-radius:50%;border:none;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.5,.5,1);background:${m.knurl},${m.chromeV};box-shadow:inset 0 2px 2px rgba(255,255,255,.8),inset 0 -3px 7px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.3),0 4px 9px rgba(0,0,0,.55)`),
            backgroundBlendMode: "soft-light, normal",
          }}
        >
          <span
            style={sx("position:absolute;top:50%;left:50%;width:40px;height:40px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 42% 32%,#fdffff,#8b97a1 55%,#3a434c);box-shadow:inset 0 -2px 4px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.8)")}
          />
          <span
            style={sx(`position:absolute;top:5px;left:50%;width:5px;height:16px;border-radius:3px;transform:translateX(-50%);background:linear-gradient(180deg,#fff,${accent});box-shadow:0 0 6px ${m.A(0.85)}`)}
          />
        </button>
      </div>
    </div>,
    <>
      POS&nbsp;<span style={sx(m.readVal)}>{sel + 1}</span>
    </>,
  );
};
