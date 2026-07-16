import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura depth meter — stacked bid/ask bars fanning out from a center
 * spread line. Original set for Component Style Studio, inspired by
 * dark-luxe trading workspaces. MIT.
 */
export const DepthMeter = ({
  bids = "62, 48, 35, 22",
  asks = "58, 44, 30, 18",
  width = 260,
}: {
  /** Comma-separated bid depths 0–100 (top to bottom) */
  bids?: string;
  /** Comma-separated ask depths 0–100 (top to bottom) */
  asks?: string;
  /** Panel width in px */
  width?: number;
}) => {
  const parse = (s: string) => s.split(",").map((v) => Math.min(100, Math.max(0, Number(v.trim()) || 0)));
  const b = parse(bids);
  const a = parse(asks);
  const rows = Math.max(b.length, a.length);
  return (
    <>
      <style>{VOLT_FONT_IMPORT}</style>
      <div style={{ ...voltPanel, width, padding: "14px 16px", fontFamily: VOLT.mono, boxSizing: "border-box" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", color: VOLT.dim, marginBottom: 10, fontFamily: VOLT.font }}>
          MARKET DEPTH
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <span style={{ width: `${b[i] ?? 0}%`, height: 8, borderRadius: 3, background: `linear-gradient(90deg, transparent, ${VOLT.up})`, opacity: 0.85 }} />
            </div>
            <span style={{ width: 1, height: 12, background: VOLT.hairline }} />
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", width: `${a[i] ?? 0}%`, height: 8, borderRadius: 3, background: `linear-gradient(90deg, ${VOLT.down}, transparent)`, opacity: 0.85 }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
