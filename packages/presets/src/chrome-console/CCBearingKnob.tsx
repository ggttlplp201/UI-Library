import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console bearing — concentric machined rings (conic grain)
 * counter-rotating continuously; center hub; small accent notch.
 * (chrome-console.md · BearingKnob)
 */
export const CCBearingKnob = ({
  accent = "#FF7A1A",
  finish = "chrome",
}: {
  /** Active accent (notch) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
}) => {
  const m = ccMaterials(accent, finish);
  return ccPanel(
    m,
    "Bearing",
    <div
      style={sx(`position:relative;width:118px;height:118px;border-radius:50%;background:linear-gradient(180deg,#0e1216,#2a323a);box-shadow:${m.wellIn}`)}
    >
      <span
        style={sx(`position:absolute;inset:8px;border-radius:50%;background:${m.grain};box-shadow:inset 0 0 0 1px rgba(255,255,255,.3),inset 0 2px 3px rgba(255,255,255,.5),inset 0 -3px 6px rgba(0,0,0,.55);animation:cc-spin 5s linear infinite`)}
      >
        <span
          style={sx(`position:absolute;top:5px;left:50%;width:5px;height:11px;transform:translateX(-50%);border-radius:2px;background:linear-gradient(180deg,#fff,${accent});box-shadow:0 0 6px ${m.A(0.85)}`)}
        />
      </span>
      <span
        style={sx(`position:absolute;inset:30px;border-radius:50%;background:${m.grain};box-shadow:inset 0 0 0 1px rgba(255,255,255,.3),inset 0 -2px 5px rgba(0,0,0,.55);animation:cc-spinr 3.4s linear infinite`)}
      />
      <span
        style={sx("position:absolute;top:50%;left:50%;width:30px;height:30px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 42% 32%,#fdffff,#8b97a1 55%,#3a434c);box-shadow:inset 0 -2px 4px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.8),0 2px 4px rgba(0,0,0,.5)")}
      />
    </div>,
    <>SPINDLE&nbsp;LOCK</>,
  );
};
