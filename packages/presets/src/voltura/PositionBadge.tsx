import { VOLT, VOLT_FONT_IMPORT } from "./libVolt";

/**
 * Voltura position badge — LONG / SHORT marker with leverage, in market
 * green or red. Original set for Component Style Studio, inspired by
 * dark-luxe trading workspaces. MIT.
 */
export const PositionBadge = ({
  side = "LONG",
  leverage = "5x",
}: {
  /** LONG or SHORT */
  side?: "LONG" | "SHORT";
  /** Leverage tag */
  leverage?: string;
}) => {
  const up = side !== "SHORT";
  const color = up ? VOLT.up : VOLT.down;
  return (
    <>
      <style>{VOLT_FONT_IMPORT}</style>
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
          background: `${up ? "rgba(125,223,106,.12)" : "rgba(224,96,79,.12)"}`,
          color,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
        {side}
        <span style={{ opacity: 0.7 }}>{leverage}</span>
      </span>
    </>
  );
};
