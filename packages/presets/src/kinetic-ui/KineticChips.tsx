import { useState } from "react";
import { KUI, KUI_KEYFRAMES, kuiSoft } from "../lib/kinetic";

/**
 * Kinetic UI chips — removable tags that fade in on add, with a dashed
 * "Add" affordance. (kinetic-ui.md · [COMPONENT] Chip)
 */
export const KineticChips = ({
  chips = "Design, Motion, Prototype, Tokens",
  accent = "#4B3BFF",
}: {
  /** Comma-separated starting tags */
  chips?: string;
  /** Accent color (chip tint) */
  accent?: string;
}) => {
  const [items, setItems] = useState(() => chips.split(",").map((c) => c.trim()).filter(Boolean));
  const [seq, setSeq] = useState(0);
  const soft = kuiSoft(accent);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        minHeight: 34,
        minWidth: 340,
        fontFamily: KUI.body,
      }}
    >
      <style>{`${KUI_KEYFRAMES}
.kui-chip-x{transition:background .18s}
.kui-chip-x:hover{background:color-mix(in srgb, var(--kacc) 30%, transparent) !important}
.kui-chip-add{transition:all .2s}
.kui-chip-add:hover{border-color:var(--kacc) !important;color:var(--kacc) !important}
`}</style>
      {items.map((label, i) => (
        <span
          key={`${label}-${i}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            fontWeight: 500,
            padding: "6px 8px 6px 13px",
            borderRadius: 999,
            background: soft,
            color: accent,
            animation: "uk-fadein .3s ease",
          }}
        >
          {label}
          <button
            type="button"
            onClick={() => setItems((cur) => cur.filter((_, j) => j !== i))}
            className="kui-chip-x"
            style={{
              ["--kacc" as string]: accent,
              display: "flex",
              width: 18,
              height: 18,
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: "50%",
              background: `${accent}24`,
              color: accent,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => {
          setSeq((n) => n + 1);
          setItems((cur) => [...cur, `Tag ${seq + 1}`]);
        }}
        className="kui-chip-add"
        style={{
          ["--kacc" as string]: accent,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 13,
          fontWeight: 500,
          padding: "6px 13px",
          borderRadius: 999,
          background: "none",
          border: "1px dashed #cfccc2",
          color: "#8a8a90",
          cursor: "pointer",
          fontFamily: KUI.body,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add
      </button>
    </div>
  );
};
