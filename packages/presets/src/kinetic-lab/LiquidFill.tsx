import { useEffect, useRef, useState } from "react";
import { KLAB, KLAB_KEYFRAMES, KLAB_SMALL_BTN } from "../lib/klab";

/**
 * Kinetic Lab liquid fill — circular progress that fills with two rolling
 * wave layers; the Fill button animates 0→100.
 * (kinetic-lab.md · [COMPONENT] LiquidFill)
 */
export const LiquidFill = ({
  defaultValue = 64,
  accent = "#E3B23C",
}: {
  /** Starting percentage (0–100) */
  defaultValue?: number;
  /** Accent color (the liquid) */
  accent?: string;
}) => {
  const [progress, setProgress] = useState(() => Math.min(100, Math.max(0, defaultValue)));
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => {
    if (interval.current) clearInterval(interval.current);
  }, []);
  const run = () => {
    if (interval.current) clearInterval(interval.current);
    setProgress(0);
    setRunning(true);
    interval.current = setInterval(() => {
      setProgress((p) => {
        const n = Math.min(100, p + 3);
        if (n >= 100 && interval.current) {
          clearInterval(interval.current);
          setRunning(false);
        }
        return n;
      });
    }, 55);
  };
  const wave: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: 0,
    width: 220,
    height: 220,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontFamily: KLAB.ui }}>
      <style>{KLAB_KEYFRAMES}</style>
      <div
        style={{
          position: "relative",
          width: 118,
          height: 118,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.03)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${progress}%`,
            background: accent,
            transition: "height .3s ease",
          }}
        >
          <div style={{ ...wave, background: "rgba(255,255,255,.35)", borderRadius: "43%", transform: "translate(-50%,-72%)", animation: "kl-water 7s linear infinite" }} />
          <div style={{ ...wave, background: "rgba(255,255,255,.18)", borderRadius: "47%", transform: "translate(-50%,-72%)", animation: "kl-water 11s linear infinite reverse" }} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: KLAB.display,
            fontWeight: 800,
            fontSize: 26,
            color: KLAB.text,
            textShadow: "0 1px 6px rgba(0,0,0,.5)",
          }}
        >
          {progress}%
        </div>
      </div>
      <button type="button" onClick={run} style={KLAB_SMALL_BTN}>
        {running ? "···" : "Fill"}
      </button>
    </div>
  );
};
