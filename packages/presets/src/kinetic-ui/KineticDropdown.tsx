import { useState } from "react";
import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

const ITEMS = [
  { label: "Profile", dot: "#4B3BFF" },
  { label: "Settings", dot: "#12A150" },
  { label: "Billing", dot: "#E08600" },
];

/**
 * Kinetic UI dropdown — spring open, chevron rotate, hover rows, danger
 * item. (kinetic-ui.md · [COMPONENT] Dropdown)
 */
export const KineticDropdown = ({
  defaultChoice = "Settings",
}: {
  /** Initially selected item */
  defaultChoice?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(defaultChoice);
  const select = (v: string) => {
    setChoice(v);
    setOpen(false);
  };
  const itemStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 10,
    padding: "9px 11px",
    border: "none",
    background: "none",
    borderRadius: 9,
    fontSize: 13.5,
    fontWeight: 500,
    color: KUI.ink,
    cursor: "pointer",
    fontFamily: KUI.body,
  };
  return (
    // Reserve room below so the open menu isn't clipped by the component box.
    <div style={{ position: "relative", display: "inline-block", paddingBottom: open ? 212 : 0, fontFamily: KUI.body }}>
      <style>{`${KUI_KEYFRAMES}
.kui-dd-item{transition:background .16s}
.kui-dd-item:hover{background:${KUI.page}}
.kui-dd-danger:hover{background:#FCE7E7}
.kui-dd-btn{transition:all .2s}
.kui-dd-btn:hover{border-color:${KUI.ink}}
`}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="kui-dd-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "11px 16px",
          borderRadius: KUI.radius,
          border: "1px solid #d9d6cd",
          background: "#fff",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: KUI.body,
          color: KUI.ink,
        }}
      >
        {choice}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 6,
            minWidth: 200,
            background: "#fff",
            border: `1px solid ${KUI.border}`,
            borderRadius: 13,
            padding: 6,
            boxShadow: "0 12px 34px rgba(20,20,30,.16)",
            transformOrigin: "top left",
            animation: `uk-menuin .18s ${KUI.spring}`,
          }}
        >
          {ITEMS.map((item) => (
            <button key={item.label} type="button" onClick={() => select(item.label)} className="kui-dd-item" style={itemStyle}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.dot }} />
              {item.label}
            </button>
          ))}
          <div style={{ height: 1, background: KUI.hairline, margin: "6px 4px" }} />
          <button
            type="button"
            onClick={() => select("Sign out")}
            className="kui-dd-item kui-dd-danger"
            style={{ ...itemStyle, color: KUI.danger }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: KUI.danger }} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
