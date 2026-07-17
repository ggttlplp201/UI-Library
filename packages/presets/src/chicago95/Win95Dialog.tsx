import { useId, useState } from "react";
import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 dialog — the warning box: navy title, exclamation lamp, OK /
 * Cancel pair. Original set for Component Style Studio, inspired by mid-90s
 * desktop chrome. MIT.
 */
export const Win95Dialog = ({
  title = "System Message",
  message = "This operation completed successfully. It is now safe to continue.",
  okLabel = "OK",
  cancelLabel = "Cancel",
}: {
  /** Title bar text */
  title?: string;
  /** Dialog message */
  message?: string;
  /** Primary button label */
  okLabel?: string;
  /** Secondary button label */
  cancelLabel?: string;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `w95d${uid}`;
  const [resolved, setResolved] = useState(false);
  const [shake, setShake] = useState(0);
  const [down, setDown] = useState<"ok" | "cancel" | null>(null);
  const btn = {
    ...bevelOut,
    minWidth: 78,
    padding: "5px 14px",
    fontFamily: C95.font,
    fontSize: 12,
    color: C95.ink,
    cursor: "pointer",
  } as const;
  return (
    <div
      key={shake}
      className={shake ? `${cls}-shake` : undefined}
      style={{ ...bevelOut, width: 320, padding: 3, fontFamily: C95.font, boxSizing: "border-box" }}
    >
      <style>{`@keyframes ${cls}-sh { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .${cls}-shake { animation: ${cls}-sh .18s linear 2; }`}</style>
      <div
        style={{
          background: `linear-gradient(90deg, ${C95.navy}, ${C95.navy2})`,
          color: "#fff",
          padding: "3px 7px",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 12px 10px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#ffd83d",
            border: `2px solid ${C95.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 20,
            color: C95.ink,
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          !
        </div>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: C95.ink }}>
          {resolved ? "Done. The system thanks you for clicking responsibly." : message}
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "6px 0 10px" }}>
        <button
          type="button"
          data-link-slot="ok"
          onMouseDown={() => setDown("ok")}
          onMouseUp={() => setDown(null)}
          onMouseLeave={() => setDown(null)}
          onClick={() => setResolved((v) => !v)}
          style={{ ...btn, ...(down === "ok" ? bevelIn : null), outline: `1px dotted ${C95.ink}`, outlineOffset: -5 }}
        >
          {resolved ? "Undo" : okLabel}
        </button>
        <button
          type="button"
          data-link-slot="cancel"
          onMouseDown={() => setDown("cancel")}
          onMouseUp={() => setDown(null)}
          onMouseLeave={() => setDown(null)}
          onClick={() => setShake((n) => n + 1)}
          style={{ ...btn, ...(down === "cancel" ? bevelIn : null) }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};
