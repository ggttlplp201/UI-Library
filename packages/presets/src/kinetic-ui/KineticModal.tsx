import { useEffect, useRef, useState } from "react";
import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

/**
 * Kinetic UI modal — backdrop blur + fade, dialog scale-in on a spring;
 * Publish fires a success toast. Fully workable: open, cancel, confirm.
 * The overlay renders inside the component's own box (not position:fixed)
 * so it works on the canvas and in exports.
 * (kinetic-ui.md · [COMPONENT] Modal)
 */
export const KineticModal = ({
  title = "Publish changes?",
  body = "This will make your edits live for everyone with access. You can roll back anytime from version history.",
  confirmLabel = "Publish",
  accent = "#4B3BFF",
}: {
  /** Dialog heading */
  title?: string;
  /** Dialog copy */
  body?: string;
  /** Confirm button text */
  confirmLabel?: string;
  /** Accent color (theme prop) */
  accent?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const confirm = () => {
    setOpen(false);
    setToast(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(false), 3800);
  };

  const primaryBtn: React.CSSProperties = {
    padding: "11px 20px",
    borderRadius: KUI.radius,
    fontWeight: 600,
    fontSize: 14,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    background: accent,
    boxShadow: `0 4px 14px ${accent}47`,
    fontFamily: KUI.body,
  };

  return (
    <div style={{ position: "relative", width: open ? 520 : "auto", minHeight: open ? 380 : 0, fontFamily: KUI.body }}>
      <style>{`${KUI_KEYFRAMES}
.kui-modal-open{transition:all .22s ${KUI.spring}}
.kui-modal-open:hover{transform:translateY(-2px);filter:brightness(1.06)}
.kui-modal-open:active{transform:translateY(0) scale(.96)}
.kui-modal-cancel{transition:all .2s}
.kui-modal-cancel:hover{border-color:${KUI.ink}}
`}</style>
      <button type="button" onClick={() => setOpen(true)} className="kui-modal-open" style={primaryBtn}>
        Open dialog
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "rgba(26,26,30,.42)",
            backdropFilter: "blur(4px)",
            borderRadius: 14,
            animation: "uk-fadein .2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 30px 70px rgba(20,20,30,.35)",
              animation: `uk-modalin .28s ${KUI.spring}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: `${accent}1f`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: KUI.page,
                  color: KUI.muted,
                  cursor: "pointer",
                  borderRadius: 9,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <h3 style={{ fontFamily: KUI.display, fontWeight: 600, fontSize: 20, margin: "18px 0 0", letterSpacing: "-.01em", color: KUI.ink }}>
              {title}
            </h3>
            <p style={{ margin: "9px 0 0", fontSize: 14, lineHeight: 1.6, color: KUI.muted }}>{body}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="kui-modal-cancel"
                style={{
                  padding: "11px 20px",
                  borderRadius: KUI.radius,
                  border: "1px solid #d9d6cd",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: KUI.body,
                  color: KUI.ink,
                }}
              >
                Cancel
              </button>
              <button type="button" onClick={confirm} className="kui-modal-open" style={primaryBtn}>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            left: 0,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            minWidth: 270,
            background: "#fff",
            border: `1px solid ${KUI.border}`,
            borderRadius: 13,
            padding: "14px 15px",
            boxShadow: "0 14px 38px rgba(20,20,30,.16)",
            animation: `uk-toastin .32s ${KUI.spring}`,
            borderLeft: `4px solid ${KUI.success}`,
            zIndex: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: KUI.ink }}>Published</div>
            <div style={{ fontSize: 12.5, color: KUI.muted, marginTop: 2 }}>Your changes are now live.</div>
          </div>
        </div>
      )}
    </div>
  );
};
