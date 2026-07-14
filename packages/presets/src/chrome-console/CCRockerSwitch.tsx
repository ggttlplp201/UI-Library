import { useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console rocker — see-saw plate in a shallow well; engraved I/O,
 * active side lit with a small accent lamp. (chrome-console.md · RockerSwitch)
 */
export const CCRockerSwitch = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultOn = false,
}: {
  /** Active accent */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial state (I engaged) */
  defaultOn?: boolean;
}) => {
  const [on, setOn] = useState(defaultOn);
  const m = ccMaterials(accent, finish);
  const mono = "font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px";
  return ccPanel(
    m,
    "Rocker",
    <div style={{ perspective: 640 }}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={sx(`position:relative;width:134px;height:92px;border-radius:16px;border:none;cursor:pointer;background:${m.chromeV};box-shadow:${m.raised}`)}
      >
        <span
          style={sx(`position:absolute;top:50%;left:50%;width:104px;height:66px;transform:translate(-50%,-50%);border-radius:12px;background:linear-gradient(180deg,#0c1013,#252d35);box-shadow:${m.wellIn}`)}
        />
        <span
          style={{
            ...sx(`position:absolute;top:50%;left:50%;width:98px;height:60px;transform-origin:50% 50%;transition:transform .32s cubic-bezier(.34,1.5,.5,1);transform:translate(-50%,-50%) rotateX(${on ? 16 : -16}deg);border-radius:10px;background:${m.chromeV};box-shadow:inset 0 2px 1px rgba(255,255,255,.9),inset 0 -5px 9px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.3),0 5px 10px rgba(0,0,0,.5)`),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 0",
          }}
        >
          <span style={sx(`${mono};color:${on ? accent : "#2b333b"};text-shadow:${on ? `0 0 7px ${m.A(0.85)}` : "0 1px 0 rgba(255,255,255,.5)"}`)}>
            I
          </span>
          <span style={sx(`${mono};color:${!on ? accent : "#2b333b"};text-shadow:${!on ? `0 0 7px ${m.A(0.85)}` : "0 1px 0 rgba(255,255,255,.5)"}`)}>
            O
          </span>
          <span
            style={sx(`position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,${accent} 60%);box-shadow:0 0 5px 1px ${m.A(0.9)},0 0 11px 2px ${m.A(0.45)}`)}
          />
        </span>
      </button>
    </div>,
    <>
      <span style={sx(m.dot(!on))} />
      {on ? "MODE I" : "MODE O"}
    </>,
  );
};
