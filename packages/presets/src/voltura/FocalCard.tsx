import { useEffect, useId, useRef, useState } from "react";
import { VOLT, VOLT_FONT_IMPORT } from "./libVolt";

/**
 * Voltura focal card — THE acid-lime surface that carries the eye: a live
 * tabular value that ticks like a portfolio feed, and a hover lift so the
 * loud card answers the cursor. Original set for Component Style Studio. MIT.
 */
export const FocalCard = ({
  label = "PORTFOLIO VALUE",
  base = 1284903,
  prefix = "$",
  note = "+12.4% this quarter",
  live = true,
  width = 280,
}: {
  /** Card label */
  label?: string;
  /** Starting value */
  base?: number;
  /** Value prefix ($, €, …) */
  prefix?: string;
  /** Footnote line */
  note?: string;
  /** Tick the value like a feed */
  live?: boolean;
  /** Card width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `vtfc${uid}`;
  const [value, setValue] = useState(base);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(() => {
      setValue((prev) => prev + Math.round((Math.random() - 0.42) * base * 0.0009));
    }, 1400);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, base]);
  return (
    <>
      <style>{`${VOLT_FONT_IMPORT}
        .${cls} { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease; }
        .${cls}:hover { transform: translateY(-4px); box-shadow: 0 22px 44px rgba(29,32,22,.45), inset 0 1px 0 rgba(255,255,255,.45); }
      `}</style>
      <div
        className={cls}
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
        <div
          style={{
            fontFamily: VOLT.mono,
            fontSize: 34,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            margin: "10px 0 6px",
            letterSpacing: "-.01em",
          }}
        >
          {prefix}
          {value.toLocaleString("en-US")}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.75 }}>{note}</div>
      </div>
    </>
  );
};
