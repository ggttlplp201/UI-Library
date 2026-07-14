import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console linear fader — recessed slot with an accent active
 * portion + milled chrome cap; drag; GAIN readout.
 * (chrome-console.md · LinearFader)
 */
export const CCLinearFader = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultValue = 54,
}: {
  /** Active accent (lit track/readout) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial gain (0–100) */
  defaultValue?: number;
}) => {
  const [value, setValue] = useState(() => Math.min(100, Math.max(0, defaultValue)));
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Linear fader",
    <div style={{ position: "relative", width: 180, height: 40, display: "flex", alignItems: "center" }}>
      <div
        style={sx(`position:relative;width:100%;height:12px;border-radius:7px;background:linear-gradient(180deg,#0c1013,#232b33);box-shadow:${m.wellIn}`)}
      >
        <span
          style={sx(`position:absolute;left:0;top:0;height:100%;width:${value}%;border-radius:7px;background:linear-gradient(180deg,${m.A(0.95)},${m.A(0.7)});box-shadow:0 0 8px ${m.A(0.6)},inset 0 1px 0 rgba(255,255,255,.4)`)}
        />
      </div>
      <div
        style={sx(`position:absolute;top:50%;left:${value}%;transform:translate(-50%,-50%);width:30px;height:38px;border-radius:7px;pointer-events:none;background:${m.chromeV};box-shadow:inset 0 2px 1px rgba(255,255,255,.9),inset 0 -4px 7px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.35),0 5px 10px rgba(0,0,0,.6)`)}
      >
        <span
          style={sx(`position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:22px;border-radius:2px;background:${m.knurl}`)}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ position: "absolute", inset: 0, width: "100%", height: 40, opacity: 0, cursor: "grab", margin: 0 }}
      />
    </div>,
    <>
      GAIN&nbsp;<span style={sx(m.readVal)}>{value}</span>
    </>,
  );
};
