import { useState } from "react";
import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld quest log — parchment rows with pixel diamonds; completing a
 * quest inks it out. Each row is a link slot. Original set for Component
 * Style Studio, inspired by worldbuilder editorial systems. MIT.
 */
export const QuestLogRow = ({
  quests = "Cross the amber marsh, Find the lantern keeper, Chart the northern ridge",
  defaultDone = 1,
  width = 300,
}: {
  /** Comma-separated quests */
  quests?: string;
  /** How many start completed */
  defaultDone?: number;
  /** Log width in px */
  width?: number;
}) => {
  const list = quests.split(",").map((s) => s.trim()).filter(Boolean);
  const [done, setDone] = useState<boolean[]>(() => list.map((_, i) => i < defaultDone));
  return (
    <>
      <style>{OW_FONT_IMPORT}</style>
      <div style={{ width, border: `4px solid ${OW.ink}`, background: OW.parchment, boxSizing: "border-box" }}>
        <div style={{ fontFamily: OW.display, fontWeight: 700, fontSize: 13, color: OW.parchment, background: OW.ink, padding: "7px 12px 6px" }}>
          QUEST LOG
        </div>
        {list.map((q, i) => (
          <button
            key={`${q}-${i}`}
            type="button"
            data-link-slot={q}
            onClick={() => setDone((prev) => prev.map((v, j) => (j === i ? !v : v)))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              borderBottom: i < list.length - 1 ? `2px dashed ${OW.ink}44` : "none",
              padding: "9px 12px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                flexShrink: 0,
                background: done[i] ? OW.grass : OW.dusk2,
                transform: "rotate(45deg)",
                boxShadow: `0 0 0 2px ${OW.ink}`,
              }}
            />
            <span
              style={{
                fontFamily: OW.body,
                fontSize: 13.5,
                color: done[i] ? "#8a7a5e" : OW.ink,
                textDecoration: done[i] ? "line-through" : "none",
              }}
            >
              {q}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
