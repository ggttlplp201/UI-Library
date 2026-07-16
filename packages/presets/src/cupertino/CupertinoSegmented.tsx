import { useState } from "react";
import { cuCard, cuInk, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino segmented control — the white thumb slides between segments on
 * the iOS spring (.28s cubic-bezier(.34,1.4,.64,1)).
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoSegmented = ({
  options = "Day, Week, Month",
  defaultIndex = 0,
  appearance = "light",
  tint1 = "#d9a0ff",
  tint2 = "#ff9ecb",
}: {
  /** Comma-separated segment labels */
  options?: string;
  /** Initially selected segment (0-based) */
  defaultIndex?: number;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const items = options.split(",").map((s) => s.trim()).filter(Boolean);
  const [seg, setSeg] = useState(Math.min(defaultIndex, items.length - 1));
  const ink = cuInk(dark);
  const n = Math.max(items.length, 1);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 280 }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          padding: 2,
          borderRadius: 11,
          background: dark ? "rgba(118,118,128,.24)" : "rgba(118,118,128,.12)",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            bottom: 2,
            left: 2,
            width: `calc((100% - 4px)/${n})`,
            borderRadius: 9,
            background: dark ? "rgba(99,99,102,.9)" : "#fff",
            boxShadow: "0 3px 8px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08)",
            transition: "transform .28s cubic-bezier(.34,1.4,.64,1)",
            transform: `translateX(${seg * 100}%)`,
          }}
        />
        {items.map((label, i) => (
          <button
            key={`${label}-${i}`}
            type="button"
            onClick={() => setSeg(i)}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "7px 0",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: CU_FONT,
              color: seg === i ? ink.head : ink.sub,
              transition: "color .2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
