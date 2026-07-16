import { VOLT, VOLT_FONT_IMPORT, voltPanel } from "./libVolt";

/**
 * Voltura ticker row — a position line: symbol, tabular price, signed delta
 * chip in market green/red. Original set for Component Style Studio,
 * inspired by dark-luxe trading workspaces. MIT.
 */
export const TickerRow = ({
  symbol = "VLT/USD",
  price = "12,408.50",
  delta = "+4.2%",
  width = 300,
}: {
  /** Instrument symbol */
  symbol?: string;
  /** Tabular price */
  price?: string;
  /** Signed delta (leading + or -) */
  delta?: string;
  /** Row width in px */
  width?: number;
}) => {
  const up = !delta.trim().startsWith("-");
  return (
    <>
      <style>{VOLT_FONT_IMPORT}</style>
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
        <span style={{ marginLeft: "auto", fontFamily: VOLT.mono, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>
          {price}
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
          {delta}
        </span>
      </div>
    </>
  );
};
