import { useState } from "react";
import { MARG, MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia checklist — homework boxes with hand-drawn checks; checked
 * items get struck through in pencil. Original set for Component Style
 * Studio, inspired by classroom journals. MIT.
 */
export const Checklist = ({
  items = "read chapter 4, sketch the layout, hand in the kit",
  defaultDone = 1,
}: {
  /** Comma-separated tasks */
  items?: string;
  /** How many start checked */
  defaultDone?: number;
}) => {
  const list = items.split(",").map((s) => s.trim()).filter(Boolean);
  const [done, setDone] = useState<boolean[]>(() => list.map((_, i) => i < defaultDone));
  return (
    <>
      <style>{MARG_FONT_IMPORT}</style>
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
        {list.map((task, i) => (
          <button
            key={`${task}-${i}`}
            type="button"
            onClick={() => setDone((prev) => prev.map((v, j) => (j === i ? !v : v)))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                border: `2px solid ${MARG.ink}`,
                borderRadius: "3px 5px 4px 3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MARG.hand,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1,
                color: MARG.margin,
                transform: `rotate(${(i % 3) - 1}deg)`,
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            >
              {done[i] ? "✓" : ""}
            </span>
            <span
              style={{
                fontFamily: MARG.hand,
                fontWeight: 500,
                fontSize: 22,
                color: done[i] ? MARG.pencil : MARG.ink,
                textDecoration: done[i] ? "line-through" : "none",
                textDecorationColor: MARG.pencil,
              }}
            >
              {task}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
