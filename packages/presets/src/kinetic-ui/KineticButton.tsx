import { useEffect, useRef, useState } from "react";
import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

/**
 * Kinetic UI button — hover lift, press scale, spring easing. The `loading`
 * variant runs a real click→spinner→saved cycle; `disabled` is inert.
 * (kinetic-ui.md · [COMPONENT] Button)
 */
export const KineticButton = ({
  label = "Primary",
  variant = "primary",
  accent = "#4B3BFF",
}: {
  /** Button text (loading variant manages its own label) */
  label?: string;
  /** Visual + behavior variant */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "loading" | "disabled";
  /** Accent color (theme prop) */
  accent?: string;
}) => {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const startLoading = () => {
    if (phase === "loading") return;
    setPhase("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("done"), 1800);
  };

  const base: React.CSSProperties = {
    padding: "11px 22px",
    borderRadius: KUI.radius,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: KUI.body,
    cursor: "pointer",
    border: "none",
  };
  const css = `
${KUI_KEYFRAMES}
.kui-btn{transition:all .22s ${KUI.spring}}
.kui-btn-primary{background:var(--kacc);color:#fff;box-shadow:0 4px 14px color-mix(in srgb, var(--kacc) 28%, transparent)}
.kui-btn-primary:hover{transform:translateY(-2px);filter:brightness(1.06)}
.kui-btn-primary:active{transform:translateY(0) scale(.96)}
.kui-btn-secondary{border:1px solid #d9d6cd;background:#fff;color:${KUI.ink}}
.kui-btn-secondary:hover{transform:translateY(-2px);border-color:${KUI.ink};box-shadow:0 8px 20px rgba(20,20,30,.1)}
.kui-btn-secondary:active{transform:translateY(0) scale(.96)}
.kui-btn-ghost{border:1px solid transparent;background:transparent;color:var(--kacc)}
.kui-btn-ghost:hover{background:color-mix(in srgb, var(--kacc) 12%, transparent)}
.kui-btn-ghost:active{transform:scale(.96)}
.kui-btn-danger{background:${KUI.danger};color:#fff;box-shadow:0 4px 14px rgba(229,72,77,.28)}
.kui-btn-danger:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(229,72,77,.42)}
.kui-btn-danger:active{transform:translateY(0) scale(.96)}
`;

  if (variant === "disabled") {
    return (
      <button type="button" disabled style={{ ...base, background: KUI.hairline, color: "#b4b1a7", cursor: "not-allowed" }}>
        {label === "Primary" ? "Disabled" : label}
      </button>
    );
  }
  if (variant === "loading") {
    return (
      <button
        type="button"
        onClick={startLoading}
        className="kui-btn kui-btn-primary"
        style={{
          ...base,
          ["--kacc" as string]: accent,
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          cursor: phase === "loading" ? "wait" : "pointer",
          opacity: phase === "loading" ? 0.85 : 1,
        }}
      >
        <style>{css}</style>
        {phase === "loading" && (
          <span
            style={{
              width: 15,
              height: 15,
              border: "2px solid rgba(255,255,255,.4)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "uk-spin .6s linear infinite",
              display: "inline-block",
            }}
          />
        )}
        {phase === "loading" ? "Saving…" : phase === "done" ? "Saved ✓" : "Save changes"}
      </button>
    );
  }
  const text =
    label !== "Primary"
      ? label
      : variant === "secondary"
        ? "Secondary"
        : variant === "ghost"
          ? "Ghost"
          : variant === "danger"
            ? "Delete"
            : "Primary";
  return (
    <button
      type="button"
      className={`kui-btn kui-btn-${variant}`}
      style={{ ...base, ["--kacc" as string]: accent }}
    >
      <style>{css}</style>
      {text}
    </button>
  );
};
