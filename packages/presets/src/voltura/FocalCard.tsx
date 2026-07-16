import { VOLT, VOLT_FONT_IMPORT } from "./libVolt";

/**
 * Voltura focal card — THE acid-lime card that carries the eye: one loud
 * surface per screen, ink type, a big tabular number. Original set for
 * Component Style Studio, inspired by dark-luxe trading workspaces. MIT.
 */
export const FocalCard = ({
  label = "PORTFOLIO VALUE",
  value = "$1,284,903",
  note = "+12.4% this quarter",
  width = 280,
}: {
  /** Card label */
  label?: string;
  /** Headline value */
  value?: string;
  /** Footnote line */
  note?: string;
  /** Card width in px */
  width?: number;
}) => (
  <>
    <style>{VOLT_FONT_IMPORT}</style>
    <div
      style={{
        width,
        background: VOLT.lime,
        color: VOLT.inkOnLime,
        borderRadius: 20,
        padding: "18px 20px 20px",
        fontFamily: VOLT.font,
        boxShadow: "0 14px 34px rgba(29,32,22,.35), inset 0 1px 0 rgba(255,255,255,.45)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>{label}</div>
      <div style={{ fontFamily: VOLT.mono, fontSize: 34, fontWeight: 600, fontVariantNumeric: "tabular-nums", margin: "10px 0 6px", letterSpacing: "-.01em" }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.75 }}>{note}</div>
    </div>
  </>
);
