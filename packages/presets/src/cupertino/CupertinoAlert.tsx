import { useState } from "react";
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
 * Cupertino alert — the compact centered iOS alert popping in with a
 * scale-fade, glass Cancel next to a filled destructive action.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoAlert = ({
  trigger = "Show alert",
  title = "Delete item?",
  message = "This action can't be undone.",
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  appearance = "light",
  tint1 = "#8fb4ff",
  tint2 = "#c9a0ff",
}: {
  /** Trigger button label */
  trigger?: string;
  /** Alert title */
  title?: string;
  /** Alert message */
  message?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Destructive button label */
  confirmLabel?: string;
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
  const btn = {
    flex: 1,
    padding: "12px 18px",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    fontFamily: CU_FONT,
  } as const;
  return (
    <>
      <style>{CU_KEYFRAMES}</style>
      <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block" }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            ...btn,
            flex: undefined,
            color: "#0A84FF",
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
            alignItems: "center",
            background: "rgba(0,0,0,.28)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 270,
              padding: 20,
              borderRadius: 22,
              ...cuOverlayGlass(dark),
              boxShadow: "0 20px 60px rgba(0,0,0,.3)",
              animation: "cu-pop .2s ease-out",
              fontFamily: CU_FONT,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 17, color: ink.head, textAlign: "center" }}>{title}</div>
            <div style={{ fontSize: 13, color: ink.sub, textAlign: "center", margin: "6px 0 18px" }}>{message}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  ...btn,
                  color: "#0A84FF",
                  ...cuControlGlass(dark),
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  ...btn,
                  color: "#fff",
                  background: "#ff453a",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px rgba(255,69,58,.4)",
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
