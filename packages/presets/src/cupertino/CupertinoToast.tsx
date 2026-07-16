import { useEffect, useRef, useState } from "react";
import {
  cuCard,
  cuControlGlass,
  cuInk,
  cuOverlayGlass,
  CuAppearance,
  CU_FONT,
  CU_KEYFRAMES,
} from "../lib/cupertino";

/**
 * Cupertino toast — the notification banner dropping in from the top on the
 * springy toast curve, auto-dismissing after a beat.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoToast = ({
  trigger = "Post banner",
  title = "Message sent",
  message = "Delivered just now",
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#7fe0c0",
  tint2 = "#8fd0ff",
}: {
  /** Trigger button label */
  trigger?: string;
  /** Banner title */
  title?: string;
  /** Banner subtitle */
  message?: string;
  /** Banner icon color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const fire = () => {
    if (timer.current) clearTimeout(timer.current);
    setShown(true);
    timer.current = setTimeout(() => setShown(false), 3200);
  };
  const ink = cuInk(dark);
  return (
    <>
      <style>{CU_KEYFRAMES}</style>
      <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block" }}>
        <button
          type="button"
          onClick={fire}
          style={{
            padding: "12px 18px",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            color: accent,
            fontFamily: CU_FONT,
            ...cuControlGlass(dark),
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.6), 0 4px 12px rgba(30,40,80,.1)",
          }}
        >
          {trigger}
        </button>
      </div>
      {shown && (
        <div
          style={{
            position: "fixed",
            top: 22,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 120,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 18px 12px 14px",
            borderRadius: 18,
            ...cuOverlayGlass(dark),
            boxShadow: "0 12px 34px rgba(0,0,0,.22)",
            animation: "cu-toastin .35s cubic-bezier(.34,1.4,.64,1)",
            fontFamily: CU_FONT,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              flexShrink: 0,
              background: accent,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)",
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: ink.head }}>{title}</div>
            <div style={{ fontSize: 13, color: ink.sub }}>{message}</div>
          </div>
        </div>
      )}
    </>
  );
};
