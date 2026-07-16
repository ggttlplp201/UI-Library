import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI segmented control — sliding white pill indicator.
 * (kinetic-ui.md · [COMPONENT] SegmentedControl)
 */
export const KineticSegmented = ({
  options = "Day, Week, Month",
  defaultIndex = 1,
}: {
  /** Comma-separated option labels */
  options?: string;
  /** Initially selected option */
  defaultIndex?: number;
}) => {
  const items = options.split(",").map((o) => o.trim()).filter(Boolean);
  const [seg, setSeg] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0)));
  const n = Math.max(items.length, 1);
  return (
    <div style={{ minWidth: 300, fontFamily: KUI.body, color: KUI.ink }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${n},1fr)`,
          background: "#EFEDE6",
          borderRadius: 13,
          padding: 4,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 4,
            width: `calc((100% - 8px)/${n})`,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(20,20,30,.12)",
            transition: "transform .35s cubic-bezier(.65,.05,.36,1)",
            transform: `translateX(calc(${Math.min(seg, n - 1)} * 100%))`,
          }}
        />
        {items.map((item, i) => (
          <button
            key={item}
            type="button"
            onClick={() => setSeg(i)}
            style={{
              position: "relative",
              zIndex: 1,
              background: "none",
              border: "none",
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "color .25s",
              color: seg === i ? KUI.ink : "#8a8a90",
              fontFamily: KUI.body,
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          margin: "14px auto 0",
          width: "fit-content",
          fontSize: 13,
          color: KUI.muted,
          textAlign: "center",
          background: KUI.card,
          border: `1px solid ${KUI.border}`,
          borderRadius: 999,
          padding: "4px 12px",
        }}
      >
        Viewing <b style={{ color: KUI.ink }}>{items[Math.min(seg, n - 1)] ?? ""}</b>
      </div>
    </div>
  );
};
