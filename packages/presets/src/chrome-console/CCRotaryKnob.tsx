import { useEffect, useRef, useState } from "react";
import { ccMaterials, sx } from "../lib/chrome";
import { ccPanel } from "../lib/chrome-panel";

/**
 * Chrome Console rotary knob — knurled skirt, conic-grain top, dished
 * center; drag to rotate (−140°..140° → 0–100) with an accent pointer +
 * glow and LVL readout. (chrome-console.md · RotaryKnob)
 */
export const CCRotaryKnob = ({
  accent = "#FF7A1A",
  finish = "chrome",
  defaultValue = 62,
}: {
  /** Active accent (pointer/readout) */
  accent?: string;
  /** Chrome or graphite finish */
  finish?: "chrome" | "graphite";
  /** Initial level (0–100) */
  defaultValue?: number;
}) => {
  const clamped = Math.min(100, Math.max(0, defaultValue));
  const [angle, setAngle] = useState((clamped / 100) * 280 - 140);
  const [value, setValue] = useState(clamped);
  const knobRef = useRef<HTMLDivElement>(null);
  const dragCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => dragCleanup.current?.(), []);
  const m = ccMaterials(accent, finish);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const el = knobRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const move = (ev: PointerEvent) => {
      let deg = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
      if (deg > 180) deg -= 360;
      const cl = Math.max(-140, Math.min(140, deg));
      setAngle(cl);
      setValue(Math.round(((cl + 140) / 280) * 100));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      dragCleanup.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    dragCleanup.current = up;
    move(e.nativeEvent);
  };

  return ccPanel(
    m,
    "Rotary · drag",
    <div
      style={sx(`position:relative;width:118px;height:118px;border-radius:50%;background:linear-gradient(180deg,#0e1216,#2a323a);box-shadow:${m.wellIn},0 1px 0 rgba(255,255,255,.4)`)}
    >
      <div
        ref={knobRef}
        onPointerDown={onPointerDown}
        style={{
          ...sx(`position:absolute;top:50%;left:50%;width:96px;height:96px;transform:translate(-50%,-50%);border-radius:50%;cursor:grab;touch-action:none;background:${m.knurl},${m.chromeV};box-shadow:inset 0 2px 2px rgba(255,255,255,.8),inset 0 -4px 8px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.3),0 5px 11px rgba(0,0,0,.55)`),
          backgroundBlendMode: "soft-light, normal",
        }}
      >
        <span
          style={sx(`position:absolute;top:50%;left:50%;width:64px;height:64px;transform:translate(-50%,-50%);border-radius:50%;background:${m.grain};box-shadow:inset 0 0 0 1px rgba(255,255,255,.35),inset 0 1px 2px rgba(255,255,255,.6),inset 0 -2px 5px rgba(0,0,0,.5)`)}
        />
        <span
          style={sx("position:absolute;top:50%;left:50%;width:34px;height:34px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 42% 32%,#fdffff,#8b97a1 55%,#3a434c);box-shadow:inset 0 -2px 4px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.8)")}
        />
        <span
          style={sx(`position:absolute;top:7px;left:50%;width:5px;height:22px;border-radius:3px;transform-origin:50% 41px;transform:translateX(-50%) rotate(${angle}deg);background:linear-gradient(180deg,#fff,${accent});box-shadow:0 0 6px ${m.A(0.85)};z-index:2`)}
        />
      </div>
    </div>,
    <>
      LVL&nbsp;<span style={sx(m.readVal)}>{value}</span>
    </>,
  );
};
