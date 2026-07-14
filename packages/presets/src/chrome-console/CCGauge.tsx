import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

const TICKS = 11;

/**
 * Chrome Console gauge — recessed dial with machined bezel, ticks lit up to
 * the value, accent needle sweeping on a spring; TEST randomizes; PSI
 * readout. (chrome-console.md · Gauge)
 */
export const CCGauge = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultValue = 46,
}: {
  /** Active accent (needle/lit ticks) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial PSI (0–100) */
  defaultValue?: number;
}) => {
  const [value, setValue] = useState(() => Math.min(100, Math.max(0, defaultValue)));
  const m = ccMaterials(accent, finish);
  const needAng = -90 + (value / 100) * 180;
  return ccPanel(
    m,
    "Gauge",
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          ...sx(`position:relative;width:158px;height:100px;border-radius:14px 14px 10px 10px;background:${m.chromeV};box-shadow:${m.raised}`),
          padding: "8px 4px 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <span
          style={sx(`position:absolute;left:9px;right:9px;top:8px;bottom:8px;border-radius:10px;background:radial-gradient(120% 150% at 50% 0%,#20272e,#0a0d10 75%);box-shadow:${m.wellIn}`)}
        />
        <svg width="150" height="92" viewBox="0 0 200 122" style={{ position: "relative", zIndex: 1 }}>
          {Array.from({ length: TICKS }, (_, i) => {
            const ang = -180 + (i / (TICKS - 1)) * 180;
            const rad = (ang * Math.PI) / 180;
            const cx = 100;
            const cy = 112;
            const r1 = 88;
            const maj = i % 2 === 0;
            const r2 = maj ? 68 : 76;
            const lit = (i / (TICKS - 1)) * 100 <= value;
            return (
              <line
                key={i}
                x1={(cx + Math.cos(rad) * r1).toFixed(1)}
                y1={(cy + Math.sin(rad) * r1).toFixed(1)}
                x2={(cx + Math.cos(rad) * r2).toFixed(1)}
                y2={(cy + Math.sin(rad) * r2).toFixed(1)}
                stroke={lit ? accent : "#7c8892"}
                strokeWidth={maj ? 3 : 1.6}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <span
          style={sx(`position:absolute;left:50%;bottom:18px;width:5px;height:66px;transform-origin:50% 100%;transform:translateX(-50%) rotate(${needAng}deg);border-radius:3px 3px 1px 1px;background:linear-gradient(180deg,#ffe0bf,${accent} 55%,${m.A(0.85)});box-shadow:0 0 7px ${m.A(0.7)};transition:transform .7s cubic-bezier(.34,1.4,.5,1);z-index:2`)}
        />
        <span
          style={sx("position:absolute;left:50%;bottom:10px;width:20px;height:20px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle at 42% 32%,#fdffff,#8b97a1 55%,#3a434c);box-shadow:inset 0 -1px 3px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.8),0 1px 3px rgba(0,0,0,.6);z-index:3")}
        />
      </div>
      <button type="button" onClick={() => setValue(Math.round(10 + Math.random() * 86))} style={sx(m.miniBtn)}>
        TEST
      </button>
    </div>,
    <>
      <span style={sx(m.readVal)}>{value}</span>&nbsp;PSI
    </>,
  );
};
