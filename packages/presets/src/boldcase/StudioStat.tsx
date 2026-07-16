import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase studio stat — a poster number over a hard rule with its label
 * beneath. Original set for Component Style Studio, inspired by
 * studio-editorial bento systems. MIT.
 */
export const StudioStat = ({
  value = "48",
  label = "PROJECTS SHIPPED",
  accent = "#2b46ff",
}: {
  /** Big number */
  value?: string;
  /** Label under the rule */
  label?: string;
  /** Number color */
  accent?: string;
}) => (
  <>
    <style>{BOLD_FONT_IMPORT}</style>
    <div style={{ display: "inline-block", fontFamily: BOLD.body }}>
      <div style={{ fontFamily: BOLD.display, fontSize: 84, lineHeight: 0.9, color: accent, letterSpacing: "-.02em" }}>
        {value}
      </div>
      <div style={{ height: 4, background: BOLD.ink, margin: "8px 0 6px" }} />
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", color: BOLD.ink }}>{label}</div>
    </div>
  </>
);
