import { useEffect, useId, useRef, useState } from "react";
import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura ticker row — a live position line: the price random-walks on an
 * interval, flashes green/red with each move, and the delta chip tracks the
 * session open. Original set for Component Style Studio. MIT.
 */
export const TickerRow = ({
  symbol = "VLT/USD",
  open = 11908.5,
  start = 12408.5,
  live = true,
  width = 300,
}: {
  /** Instrument symbol */
  symbol?: string;
  /** Session open the delta compares against */
  open?: number;
  /** Starting price */
  start?: number;
  /** Random-walk the price */
  live?: boolean;
  /** Row width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `vttk${uid}`;
  const [price, setPrice] = useState(start);
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(() => {
      setPrice((prev) => {
        const move = (Math.random() - 0.49) * start * 0.004;
        setDir(move >= 0 ? "up" : "down");
        setTick((t) => t + 1);
        return Math.max(start * 0.8, prev + move);
      });
    }, 1300);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, start]);
  const delta = ((price - open) / open) * 100;
  const up = delta >= 0;
  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <>
      <style>{`${VOLT_FONT_IMPORT}
        @keyframes ${cls}-up { from { color: ${VOLT.up}; } to { color: ${VOLT.text}; } }
        @keyframes ${cls}-down { from { color: ${VOLT.down}; } to { color: ${VOLT.text}; } }
      `}</style>
      <div
        style={{
          ...voltPanel,
          width,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          fontFamily: VOLT.font,
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>{symbol}</span>
        <span
          key={tick}
          style={{
            marginLeft: "auto",
            fontFamily: VOLT.mono,
            fontSize: 15,
            fontVariantNumeric: "tabular-nums",
            animation: dir ? `${cls}-${dir} 1s ease both` : undefined,
          }}
        >
          {fmt(price)}
        </span>
        <span
          style={{
            fontFamily: VOLT.mono,
            fontSize: 12,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 8,
            background: up ? "rgba(125,223,106,.14)" : "rgba(224,96,79,.14)",
            color: up ? VOLT.up : VOLT.down,
          }}
        >
          {up ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
      </div>
    </>
  );
};
