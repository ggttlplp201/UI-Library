import { useId } from "react";
import { C95, bevelIn } from "./lib95";

/**
 * Chicago 95 progress — the chunked navy block bar in a sunken well. With
 * `animate` on it marches to 100% and loops via a stepped CSS animation
 * (so it keeps copying files even in static exports); off, it honors
 * `value`. Original set for Component Style Studio. MIT.
 */
export const Win95Progress = ({
  value = 60,
  animate = true,
  label = "Copying files…",
  width = 240,
}: {
  /** Progress 0–100 (used when animate is off) */
  value?: number;
  /** March blocks to 100% and loop (CSS-driven) */
  animate?: boolean;
  /** Status line under the bar (empty hides it) */
  label?: string;
  /** Bar width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `w95p${uid}`;
  const blocks = 16;
  const pct = Math.min(100, Math.max(0, value));
  // Blocks drawn as a repeating gradient strip; the strip's width animates in
  // 16 hard steps so the fill "chunks" like the real thing.
  const strip: React.CSSProperties = {
    height: 16,
    background: `repeating-linear-gradient(90deg, ${C95.navy} 0 calc(100% / ${blocks} - 2px), transparent calc(100% / ${blocks} - 2px) calc(100% / ${blocks}))`,
    backgroundSize: `${width - 6}px 100%`,
    width: animate ? undefined : `${pct}%`,
  };
  return (
    <div style={{ width, fontFamily: C95.font }}>
      <style>{`@keyframes ${cls}-march { from { width: 0%; } to { width: 100%; } }
        .${cls}-fill { animation: ${cls}-march 5.1s steps(${blocks}, jump-none) infinite; }`}</style>
      <div style={{ ...bevelIn, padding: 3, boxSizing: "border-box", background: C95.paper }}>
        <div className={animate ? `${cls}-fill` : undefined} style={strip} />
      </div>
      {label ? (
        <div style={{ fontSize: 11, color: C95.ink, marginTop: 4 }}>{label}</div>
      ) : null}
    </div>
  );
};
