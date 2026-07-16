import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura spark stat — an olive panel with label, tabular value, and an
 * inline SVG sparkline. Original set for Component Style Studio, inspired by
 * dark-luxe trading workspaces. MIT.
 */
export const SparkStat = ({
  label = "24H VOLUME",
  value = "84.2M",
  points = "2,18 12,14 22,16 32,9 42,12 52,6 62,10 72,4 82,8 92,2",
  width = 240,
}: {
  /** Stat label */
  label?: string;
  /** Stat value */
  value?: string;
  /** Sparkline points (SVG polyline, 96×20 box) */
  points?: string;
  /** Panel width in px */
  width?: number;
}) => (
  <>
    <style>{VOLT_FONT_IMPORT}</style>
    <div style={{ ...voltPanel, width, padding: "14px 16px", fontFamily: VOLT.font, boxSizing: "border-box" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: VOLT.dim }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 8 }}>
        <span style={{ fontFamily: VOLT.mono, fontSize: 22, fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <svg width="96" height="20" viewBox="0 0 96 20" style={{ marginLeft: "auto", overflow: "visible" }}>
          <polyline points={points} fill="none" stroke={VOLT.lime} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </>
);
