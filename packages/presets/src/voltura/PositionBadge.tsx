import { useEffect, useId, useRef, useState } from "react";
import { VOLT, VOLT_FONT_IMPORT } from "./libVolt";

/**
 * Voltura position badge — a live LONG/SHORT marker: the mark price walks,
 * the badge shows leverage and running PnL for the side, and the status dot
 * pulses while the position is open.
 * Original set for Component Style Studio. MIT.
 */
export const PositionBadge = ({
  side = "LONG",
  leverage = 5,
  entry = 12200,
  live = true,
}: {
  /** LONG or SHORT */
  side?: "LONG" | "SHORT";
  /** Leverage multiplier */
  leverage?: number;
  /** Entry price */
  entry?: number;
  /** Walk the mark price */
  live?: boolean;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `vtpb${uid}`;
  const [mark, setMark] = useState(entry * 1.017);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(() => {
      setMark((prev) => Math.max(entry * 0.9, prev + (Math.random() - 0.49) * entry * 0.003));
    }, 1200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, entry]);
  const raw = ((mark - entry) / entry) * 100 * leverage;
  const pnl = side === "SHORT" ? -raw : raw;
  const up = pnl >= 0;
  const color = up ? VOLT.up : VOLT.down;
  return (
    <>
      <style>{`${VOLT_FONT_IMPORT}
        @keyframes ${cls}-pulse { 0%, 100% { box-shadow: 0 0 0 0 ${color}66; } 50% { box-shadow: 0 0 0 5px transparent; } }
      `}</style>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: VOLT.mono,
          fontSize: 12,
          fontWeight: 600,
          padding: "5px 12px",
          borderRadius: 10,
          border: `1px solid ${color}55`,
          background: up ? "rgba(125,223,106,.12)" : "rgba(224,96,79,.12)",
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span
          style={{ width: 7, height: 7, borderRadius: "50%", background: color, animation: `${cls}-pulse 1.6s ease infinite` }}
        />
        {side}
        <span style={{ opacity: 0.7 }}>{leverage}x</span>
        <span>
          {up ? "+" : ""}
          {pnl.toFixed(1)}%
        </span>
      </span>
    </>
  );
};
