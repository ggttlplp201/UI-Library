import { useState } from "react";
import { KUI } from "../lib/kinetic";

const PANELS = [
  { t: "Overview", b: "A high-level summary of your project — status, owners, and recent activity at a glance." },
  { t: "Activity", b: "Every action, ordered by time. Filter by teammate or type to find exactly what changed." },
  { t: "Settings", b: "Configure permissions, integrations, and notification rules for this workspace." },
  { t: "Members", b: "Invite teammates, assign roles, and manage seat allocation across your plan." },
];

/**
 * Kinetic UI tabs — underline indicator slides between tabs and the panel
 * copy swaps. (kinetic-ui.md · [COMPONENT] Tabs)
 */
export const KineticTabs = ({
  accent = "#4B3BFF",
}: {
  /** Accent color (underline indicator) */
  accent?: string;
}) => {
  const [active, setActive] = useState(0);
  const n = PANELS.length;
  return (
    <div style={{ minWidth: 420, fontFamily: KUI.body, color: KUI.ink }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${n},1fr)`,
          borderBottom: `1px solid ${KUI.hairline}`,
        }}
      >
        {PANELS.map((p, i) => (
          <button
            key={p.t}
            type="button"
            onClick={() => setActive(i)}
            style={{
              background: "none",
              border: "none",
              padding: "13px 4px",
              fontSize: 14,
              textAlign: "center",
              cursor: "pointer",
              transition: "color .25s",
              color: active === i ? KUI.ink : "#8a8a90",
              fontWeight: active === i ? 600 : 500,
              fontFamily: KUI.body,
            }}
          >
            {p.t}
          </button>
        ))}
        <span
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            height: 2,
            width: `${100 / n}%`,
            background: accent,
            borderRadius: 2,
            transition: "transform .35s cubic-bezier(.65,.05,.36,1)",
            transform: `translateX(calc(${active} * 100%))`,
          }}
        />
      </div>
      <div style={{ padding: "18px 2px 0", minHeight: 76 }}>
        <div style={{ fontFamily: KUI.display, fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
          {PANELS[active].t}
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: KUI.muted }}>{PANELS[active].b}</p>
      </div>
    </div>
  );
};
