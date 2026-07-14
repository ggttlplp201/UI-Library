import { useEffect, useRef, useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI determinate progress bar with a Run button that animates
 * 0→100. (kinetic-ui.md · [COMPONENT] ProgressBar, split from card 11)
 */
export const KineticProgressBar = ({
  defaultValue = 40,
  accent = "#4B3BFF",
}: {
  /** Starting percentage (0–100) */
  defaultValue?: number;
  /** Accent color (fill) */
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
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 260, fontFamily: KUI.body }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#8a8a90", fontFamily: KUI.mono }}>DETERMINATE</span>
        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: KUI.mono, color: KUI.ink }}>{progress}%</span>
      </div>
      <div style={{ width: "100%", height: 8, background: KUI.hairline, borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: accent,
            borderRadius: 999,
            transition: "width .2s ease",
          }}
        />
      </div>
      <button
        type="button"
        onClick={run}
        style={{
          alignSelf: "flex-start",
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
