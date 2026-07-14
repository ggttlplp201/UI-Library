import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

const STYLES = {
  neutral: { bg: "#EFEDE6", fg: "#54545c", label: "Neutral" },
  new: { bg: "#ECEAFF", fg: "#4B3BFF", label: "New" },
  live: { bg: "#E4F5EC", fg: "#12A150", label: "Live" },
  beta: { bg: "#FBF0DC", fg: "#B8760A", label: "Beta" },
  error: { bg: "#FCE7E7", fg: "#E5484D", label: "Error" },
} as const;

/**
 * Kinetic UI badge — status pill; the `live` variant carries a pulsing
 * ring dot. (kinetic-ui.md · [COMPONENT] Badge)
 */
export const KineticBadge = ({
  variant = "live",
  label = "",
}: {
  /** Status variant (sets colors; live adds the pulse dot) */
  variant?: "neutral" | "new" | "live" | "beta" | "error";
  /** Custom text (defaults to the variant name) */
  label?: string;
}) => {
  const v = STYLES[variant] ?? STYLES.neutral;
  const text = label || v.label;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 11px",
        borderRadius: 999,
        background: v.bg,
        color: v.fg,
        fontFamily: KUI.body,
      }}
    >
      {variant === "live" && (
        <>
          <style>{KUI_KEYFRAMES}</style>
          <span style={{ position: "relative", width: 6, height: 6, display: "inline-flex" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: v.fg }} />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: v.fg,
                animation: "uk-ring 1.8s ease-out infinite",
              }}
            />
          </span>
        </>
      )}
      {text}
    </span>
  );
};
