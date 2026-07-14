import { useEffect, useRef, useState } from "react";
import { KUI } from "../lib/kinetic";

const R = 26;
const C = 2 * Math.PI * R;

/**
 * Kinetic UI ring progress — SVG stroke-dashoffset ring with a % label and
 * a Run button. (kinetic-ui.md · [COMPONENT] RingProgress, split from 11)
 */
export const KineticRingProgress = ({
  defaultValue = 40,
  accent = "#4B3BFF",
}: {
  /** Starting percentage (0–100) */
  defaultValue?: number;
  /** Accent color (ring stroke) */
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
        const n = Math.min(100, p + 4);
        if (n >= 100 && interval.current) {
          clearInterval(interval.current);
          setRunning(false);
        }
        return n;
      });
    }, 55);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: KUI.body }}>
      <div style={{ position: "relative", width: 66, height: 66 }}>
        <svg width="66" height="66" viewBox="0 0 66 66" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="33" cy="33" r={R} fill="none" stroke={KUI.hairline} strokeWidth="7" />
          <circle
            cx="33"
            cy="33"
            r={R}
            fill="none"
            stroke={accent}
            strokeWidth="7"
            strokeLinecap="round"
            style={{
              strokeDasharray: C.toFixed(1),
              strokeDashoffset: (C * (1 - progress / 100)).toFixed(1),
              transition: "stroke-dashoffset .2s ease",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: KUI.mono,
            color: KUI.ink,
          }}
        >
          {progress}
        </div>
      </div>
      <button
        type="button"
        onClick={run}
        style={{
          padding: "8px 16px",
          borderRadius: 9,
          border: "1px solid #d9d6cd",
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all .2s",
          fontFamily: KUI.body,
          color: KUI.ink,
        }}
      >
        {running ? "Running…" : "Run"}
      </button>
    </div>
  );
};
