import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console toggle — vertical bat lever seated in a dark recessed
 * cavity; tilts with a moving contact shadow. ON/OFF readout + status dot.
 * (chrome-console.md · ToggleSwitch)
 */
export const CCToggleSwitch = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultOn = true,
}: {
  /** Active accent (lamp/dot/readout) */
  accent?: string;
  /** Chrome (bright) or graphite (dark gunmetal) */
  finish?: "chrome" | "graphite";
  /** Initial state */
  defaultOn?: boolean;
}) => {
  const [on, setOn] = useState(defaultOn);
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Toggle",
    <div style={{ perspective: 600 }}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={sx(`position:relative;width:88px;height:124px;border-radius:16px;border:none;cursor:pointer;background:${m.chromeV};box-shadow:${m.raised}`)}
      >
        <span
          style={sx(`position:absolute;top:50%;left:50%;width:42px;height:92px;transform:translate(-50%,-50%);border-radius:21px;background:linear-gradient(180deg,#0c1013,#252d35);box-shadow:${m.wellIn}`)}
        />
        <span
          style={sx(`position:absolute;left:50%;top:50%;width:40px;height:26px;border-radius:50%;transform:translate(-50%,${on ? "2px" : "20px"});background:radial-gradient(circle,rgba(0,0,0,.6),transparent 70%);filter:blur(3px);transition:transform .42s cubic-bezier(.34,1.6,.5,1);opacity:.8`)}
        />
        <span
          style={sx(`position:absolute;left:50%;top:50%;width:40px;height:60px;border-radius:14px;transform-origin:50% 50%;transition:transform .42s cubic-bezier(.34,1.65,.5,1);transform:translate(-50%,-50%) translateY(${on ? "-16px" : "16px"}) rotateX(${on ? -32 : 32}deg) translateZ(12px);background:${m.chromeV};box-shadow:inset 0 2px 1px rgba(255,255,255,.95),inset 0 -6px 10px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.35),0 ${on ? "-6px 10px" : "8px 12px"} rgba(0,0,0,.55)`)}
        >
          <span
            style={sx("position:absolute;left:6px;right:6px;top:7px;height:12px;border-radius:8px;background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,0));filter:blur(.4px)")}
          />
        </span>
      </button>
    </div>,
    <>
      <span style={sx(m.dot(on))} />
      {on ? "CIRCUIT ON" : "CIRCUIT OFF"}
    </>,
  );
};
