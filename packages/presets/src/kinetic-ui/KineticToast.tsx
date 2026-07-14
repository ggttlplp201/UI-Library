import { useEffect, useRef, useState } from "react";
import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

interface Toast {
  id: number;
  title: string;
  msg: string;
  color: string;
}

const PRESETS = {
  success: { title: "All set", msg: "Your file was uploaded successfully.", color: "#12A150", btnBg: "#E4F5EC", btnBorder: "#b8e6cc", btnFg: "#0e7a3d", label: "Success" },
  error: { title: "Upload failed", msg: "The file exceeds the 20MB limit.", color: "#E5484D", btnBg: "#FCE7E7", btnBorder: "#f3c4c5", btnFg: "#c93338", label: "Error" },
  info: { title: "Heads up", msg: "A new version is available to install.", color: "#4B3BFF", btnBg: "#ECEAFF", btnBorder: "#cdc7ff", btnFg: "#4B3BFF", label: "Info" },
} as const;

/**
 * Kinetic UI toasts — stacked, slide in from the right on a spring, and
 * auto-dismiss after ~3.8s. Click a variant button to fire one.
 * (kinetic-ui.md · [COMPONENT] Toast)
 */
export const KineticToast = ({
  accent = "#4B3BFF",
}: {
  /** Accent color (info toast bar) */
  accent?: string;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const push = (kind: keyof typeof PRESETS) => {
    const p = PRESETS[kind];
    const id = ++seq.current;
    const color = kind === "info" ? accent : p.color;
    setToasts((cur) => [...cur, { id, title: p.title, msg: p.msg, color }]);
    timers.current.push(setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), 3800));
  };

  return (
    <div style={{ position: "relative", width: 420, minHeight: 170, fontFamily: KUI.body }}>
      <style>{`${KUI_KEYFRAMES}
.kui-toast-btn{transition:all .2s}
.kui-toast-btn:hover{transform:translateY(-2px)}
`}</style>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((kind) => {
          const p = PRESETS[kind];
          return (
            <button
              key={kind}
              type="button"
              onClick={() => push(kind)}
              className="kui-toast-btn"
              style={{
                padding: "9px 15px",
                borderRadius: 10,
                border: `1px solid ${p.btnBorder}`,
                background: p.btnBg,
                color: p.btnFg,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: KUI.body,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 11,
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              minWidth: 270,
              maxWidth: 330,
              background: "#fff",
              border: `1px solid ${KUI.border}`,
              borderRadius: 13,
              padding: "14px 14px 14px 15px",
              boxShadow: "0 14px 38px rgba(20,20,30,.16)",
              animation: `uk-toastin .32s ${KUI.spring}`,
              borderLeft: `4px solid ${t.color}`,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: KUI.ink }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: KUI.muted, marginTop: 2 }}>{t.msg}</div>
            </div>
            <button
              type="button"
              onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
              style={{
                display: "flex",
                width: 22,
                height: 22,
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "none",
                color: KUI.faint,
                cursor: "pointer",
                padding: 0,
                borderRadius: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
