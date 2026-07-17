import { useEffect, useRef, useState } from "react";
import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura spark stat — a live stat panel: the sparkline is a rolling window
 * that appends a new sample on an interval, the value tracks the latest
 * sample, and the delta chip compares against the window start.
 * Original set for Component Style Studio. MIT.
 */
export const SparkStat = ({
  label = "24H VOLUME",
  base = 84.2,
  unit = "M",
  live = true,
  width = 260,
}: {
  /** Stat label */
  label?: string;
  /** Starting value */
  base?: number;
  /** Unit suffix (M, K, %, …) */
  unit?: string;
  /** Roll new samples onto the sparkline */
  live?: boolean;
  /** Panel width in px */
  width?: number;
}) => {
  const [samples, setSamples] = useState(() =>
    Array.from({ length: 24 }, (_, i) => base * (0.92 + 0.08 * Math.sin(i / 3) + 0.02 * ((i * 7) % 5))),
  );
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(() => {
      setSamples((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(base * 0.7, last + (Math.random() - 0.48) * base * 0.05);
        return [...prev.slice(1), next];
      });
    }, 1100);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, base]);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const span = Math.max(0.0001, max - min);
  const pts = samples
    .map((v, i) => `${(i / (samples.length - 1)) * 96},${18 - ((v - min) / span) * 16}`)
    .join(" ");
  const latest = samples[samples.length - 1];
  const delta = ((latest - samples[0]) / samples[0]) * 100;
  const up = delta >= 0;
  return (
    <>
      <style>{VOLT_FONT_IMPORT}</style>
      <div style={{ ...voltPanel, width, padding: "14px 16px", fontFamily: VOLT.font, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: VOLT.dim }}>{label}</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: VOLT.mono,
              fontSize: 10,
              fontWeight: 600,
              padding: "1px 7px",
              borderRadius: 7,
              background: up ? "rgba(125,223,106,.14)" : "rgba(224,96,79,.14)",
              color: up ? VOLT.up : VOLT.down,
            }}
          >
            {up ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: VOLT.mono, fontSize: 22, fontVariantNumeric: "tabular-nums" }}>
            {latest.toFixed(1)}
            {unit}
          </span>
          <svg width="96" height="20" viewBox="0 0 96 20" style={{ marginLeft: "auto", overflow: "visible" }}>
            <polygon points={`0,20 ${pts} 96,20`} fill={`${VOLT.lime}22`} stroke="none" />
            <polyline points={pts} fill="none" stroke={VOLT.lime} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
};
