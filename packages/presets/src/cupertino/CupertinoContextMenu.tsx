import { useState } from "react";
import {
  cuCard,
  cuControlGlass,
  CuAppearance,
  CU_FONT,
  CU_KEYFRAMES,
} from "../lib/cupertino";

/**
 * Cupertino context menu — the glass options menu popping under its trigger
 * with a scale-fade; the last item reads destructive red. Each row is its
 * own link slot.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoContextMenu = ({
  trigger = "Options",
  items = "Share, Duplicate, Delete",
  accent = "#0A84FF",
  appearance = "light",
  tint1 = "#9fd0ff",
  tint2 = "#a0f0d0",
}: {
  /** Trigger button label */
  trigger?: string;
  /** Comma-separated menu rows (last one renders destructive) */
  items?: string;
  /** Menu row color */
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
  const rows = items.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <>
      <style>{CU_KEYFRAMES}</style>
      <div style={{ ...cuCard(tint1, tint2, dark), display: "inline-block", minWidth: 200 }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
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
        {open && (
          <div
            style={{
              marginTop: 10,
              borderRadius: 14,
              overflow: "hidden",
              padding: 5,
              ...cuControlGlass(dark),
              boxShadow: "0 12px 30px rgba(0,0,0,.2)",
              animation: "cu-pop .16s ease-out",
            }}
          >
            {rows.map((label, i) => (
              <button
                key={`${label}-${i}`}
                type="button"
                data-link-slot={label}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: 9,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: CU_FONT,
                  color: i === rows.length - 1 && rows.length > 1 ? "#ff453a" : accent,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
