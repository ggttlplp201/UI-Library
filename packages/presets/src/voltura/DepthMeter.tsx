import { useEffect, useId, useRef, useState } from "react";
import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura depth meter — a live order book: five bid and ask levels around a
 * mid price, sized bars, tabular prices/sizes, and a spread chip. Levels
 * breathe on an interval like a real feed; rows highlight on hover.
 * Original set for Component Style Studio. MIT.
 */
export const DepthMeter = ({
  symbol = "VLT/USD",
  mid = 12408.5,
  step = 2.5,
  levels = 5,
  live = true,
  width = 320,
}: {
  /** Instrument shown in the header */
  symbol?: string;
  /** Mid price the book builds around */
  mid?: number;
  /** Price distance between levels */
  step?: number;
  /** Levels per side (max 8) */
  levels?: number;
  /** Animate the book like a live feed */
  live?: boolean;
  /** Panel width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `vtdm${uid}`;
  const n = Math.min(8, Math.max(2, levels));
  const seed = (i: number, salt: number) => 30 + ((i * 37 + salt * 53) % 60);
  const [book, setBook] = useState(() => ({
    bids: Array.from({ length: n }, (_, i) => seed(i, 1)),
    asks: Array.from({ length: n }, (_, i) => seed(i, 2)),
  }));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(() => {
      setBook((prev) => ({
        bids: prev.bids.map((v) => Math.min(96, Math.max(8, v + (Math.random() * 22 - 11)))),
        asks: prev.asks.map((v) => Math.min(96, Math.max(8, v + (Math.random() * 22 - 11)))),
      }));
    }, 900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live]);
  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const spread = step;
  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "3px 6px",
    borderRadius: 6,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <>
      <style>{`${VOLT_FONT_IMPORT}
        .${cls}-row { transition: background .15s ease; }
        .${cls}-row:hover { background: rgba(200,245,66,.08); }
        .${cls}-bar { transition: width .6s cubic-bezier(.22,1,.36,1); }
      `}</style>
      <div style={{ ...voltPanel, width, padding: "14px 16px", fontFamily: VOLT.mono, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10, fontFamily: VOLT.font }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: VOLT.dim }}>
            MARKET DEPTH
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: VOLT.text }}>{symbol}</span>
        </div>
        <div style={{ ...row, fontSize: 9, color: VOLT.dim, padding: "0 6px 4px" }}>
          <span style={{ flex: 1 }}>SIZE</span>
          <span style={{ width: 64, textAlign: "right", color: VOLT.up }}>BID</span>
          <span style={{ width: 64, color: VOLT.down }}>ASK</span>
          <span style={{ flex: 1, textAlign: "right" }}>SIZE</span>
        </div>
        {Array.from({ length: n }, (_, i) => {
          const bidPrice = mid - spread / 2 - i * step;
          const askPrice = mid + spread / 2 + i * step;
          const b = book.bids[i] ?? 0;
          const a = book.asks[i] ?? 0;
          return (
            <div key={i} className={`${cls}-row`} style={{ ...row, fontSize: 11 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: VOLT.dim, minWidth: 30 }}>{(b / 10).toFixed(1)}</span>
                <span style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                  <span
                    className={`${cls}-bar`}
                    style={{ width: `${b}%`, height: 7, borderRadius: 3, background: `linear-gradient(90deg, transparent, ${VOLT.up})`, opacity: 0.85 }}
                  />
                </span>
              </div>
              <span style={{ width: 64, textAlign: "right", color: VOLT.up }}>{fmt(bidPrice)}</span>
              <span style={{ width: 64, color: VOLT.down }}>{fmt(askPrice)}</span>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ flex: 1 }}>
                  <span
                    className={`${cls}-bar`}
                    style={{ display: "block", width: `${a}%`, height: 7, borderRadius: 3, background: `linear-gradient(90deg, ${VOLT.down}, transparent)`, opacity: 0.85 }}
                  />
                </span>
                <span style={{ color: VOLT.dim, minWidth: 30, textAlign: "right" }}>{(a / 10).toFixed(1)}</span>
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 8, border: `1px solid ${VOLT.hairline}`, color: VOLT.citrine }}>
            SPREAD {fmt(spread)}
          </span>
        </div>
      </div>
    </>
  );
};
