import { KLAB, KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab living border — a conic-gradient beam orbits the card edge in
 * perpetual motion (single-hue). (kinetic-lab.md · [ANIMATION] LivingBorder)
 */
export const LivingBorder = ({
  title = "Pro plan",
  subtitle = "Border in perpetual motion",
  accent = "#E3B23C",
}: {
  /** Card heading */
  title?: string;
  /** Card subline */
  subtitle?: string;
  /** Accent color (the beam) */
  accent?: string;
}) => (
  <div style={{ position: "relative", padding: 1.5, borderRadius: 16, overflow: "hidden", fontFamily: KLAB.ui }}>
    <style>{KLAB_KEYFRAMES}</style>
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "200%",
        height: "200%",
        background: `conic-gradient(${accent} 0deg 70deg, transparent 70deg 360deg)`,
        transform: "translate(-50%,-50%)",
        animation: "kl-orbit 4s linear infinite",
      }}
    />
    <div
      style={{
        position: "relative",
        padding: "22px 26px",
        borderRadius: 15,
        background: "#0E0E14",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: KLAB.display, fontWeight: 700, fontSize: 17, color: KLAB.text }}>{title}</div>
      <div style={{ fontSize: 13, color: KLAB.muted, marginTop: 3 }}>{subtitle}</div>
    </div>
  </div>
);
