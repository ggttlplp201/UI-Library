import { useEffect, useState } from "react";
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
}) => {
  // Count up to numeric values; non-numeric values render as-is.
  const target = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/^[0-9.,\s]*/, "");
  const countable = Number.isFinite(target) && target > 0;
  const [n, setN] = useState(countable ? 0 : target);
  useEffect(() => {
    if (!countable) return;
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const stepFrame = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(stepFrame);
    };
    raf = requestAnimationFrame(stepFrame);
    return () => cancelAnimationFrame(raf);
  }, [target, countable]);
  const shown = countable ? `${Math.round(n)}${suffix}` : value;
  return (
  <>
    <style>{BOLD_FONT_IMPORT}</style>
    <div style={{ display: "inline-block", fontFamily: BOLD.body }}>
      <div style={{ fontFamily: BOLD.display, fontSize: 84, lineHeight: 0.9, color: accent, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>
        {shown}
      </div>
      <div style={{ height: 4, background: BOLD.ink, margin: "8px 0 6px" }} />
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", color: BOLD.ink }}>{label}</div>
    </div>
  </>
  );
};
