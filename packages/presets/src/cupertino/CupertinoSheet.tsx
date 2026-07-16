import { useState } from "react";
import {
  cuAlpha,
  cuCard,
  cuControlGlass,
  cuInk,
  cuOverlayGlass,
  CuAppearance,
  CU_FONT,
  CU_KEYFRAMES,
} from "../lib/cupertino";

/**
 * Cupertino sheet — a bottom sheet sliding up on the iOS sheet curve
 * (.35s cubic-bezier(.32,.72,0,1)) over a blurred scrim; tap the scrim to
 * dismiss.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoSheet = ({
  trigger = "Present sheet",
  title = "Liquid Glass sheet",
  body = "A translucent sheet that lets the colorful backdrop refract through it — the hallmark of the Liquid Glass material.",
  confirm = "Done",
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#9fe6c0",
  tint2 = "#9fd0ff",
}: {
  /** Trigger button label */
  trigger?: string;
  /** Sheet title */
  title?: string;
  /** Sheet body copy */
  body?: string;
  /** Confirm button label */
  confirm?: string;
  /** Accent color */
  accent?: string;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const [open, setOpen] = useState(false);
  const ink = cuInk(dark);
  return (
    <>
      <style>{CU_KEYFRAMES}</style>
      <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block" }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
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
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            background: "rgba(0,0,0,.28)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              alignSelf: "flex-end",
              width: "100%",
              maxWidth: 460,
              margin: "0 12px",
              padding: "14px 22px 26px",
              borderRadius: "28px 28px 0 0",
              ...cuOverlayGlass(dark),
              borderBottom: "none",
              boxShadow: "0 -10px 40px rgba(0,0,0,.2)",
              animation: "cu-sheetin .35s cubic-bezier(.32,.72,0,1)",
              fontFamily: CU_FONT,
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                display: "block",
                width: 38,
                height: 5,
                borderRadius: 3,
                margin: "0 auto 14px",
                background: ink.sub,
                opacity: 0.4,
              }}
            />
            <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.02em", color: ink.head, margin: "6px 0" }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: ink.sub, lineHeight: 1.5, marginBottom: 20 }}>{body}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                padding: "12px 18px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                color: "#fff",
                background: accent,
                fontFamily: CU_FONT,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.4), 0 4px 12px ${cuAlpha(accent, 0.4)}`,
              }}
            >
              {confirm}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
