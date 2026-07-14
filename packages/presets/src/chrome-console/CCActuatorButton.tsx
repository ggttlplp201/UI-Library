import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console actuator — round chrome button that depresses into its
 * well on press (toggle); accent ring + label light when ENGAGED.
 * (chrome-console.md · ActuatorButton)
 */
export const CCActuatorButton = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultEngaged = false,
}: {
  /** Active accent (ring/label) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial state */
  defaultEngaged?: boolean;
}) => {
  const [on, setOn] = useState(defaultEngaged);
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Actuator",
    <div
      style={sx(`position:relative;width:118px;height:118px;border-radius:50%;background:linear-gradient(180deg,#0e1216,#2a323a);box-shadow:${m.wellIn},0 1px 0 rgba(255,255,255,.4)`)}
    >
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          ...sx(`position:absolute;top:50%;left:50%;width:92px;height:92px;transform:translate(-50%,-50%) translateY(${on ? "2px" : "0"});border-radius:50%;border:none;cursor:pointer;background:${m.chromeV};box-shadow:inset 0 2px 2px rgba(255,255,255,.85),inset 0 -5px 10px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.32),0 ${on ? "2px 5px" : "6px 12px"} rgba(0,0,0,.6);transition:transform .12s,box-shadow .12s`),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={sx(`position:absolute;inset:9px;border-radius:50%;border:2px solid ${on ? accent : "rgba(90,100,110,.5)"};box-shadow:${on ? `0 0 7px ${m.A(0.85)},inset 0 0 6px ${m.A(0.6)}` : "none"};transition:all .18s`)}
        />
        <span
          style={sx(`position:relative;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;letter-spacing:.14em;color:${on ? accent : "#2b333b"};text-shadow:${on ? `0 0 7px ${m.A(0.8)}` : "0 1px 0 rgba(255,255,255,.55)"}`)}
        >
          PUSH
        </span>
      </button>
    </div>,
    <>
      <span style={sx(m.dot(on))} />
      {on ? "ENGAGED" : "STANDBY"}
    </>,
  );
};
