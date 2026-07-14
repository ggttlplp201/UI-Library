import { KLAB, klabOnAccent } from "../lib/klab";

/**
 * Kinetic Lab confetti — physics particle burst (Web Animations API) from
 * the click point; single-accent particles per the theme's one-hue rule.
 * (kinetic-lab.md · [ANIMATION] Confetti)
 */
export const ConfettiButton = ({
  label = "🎉 Celebrate",
  accent = "#E3B23C",
}: {
  /** Button text */
  label?: string;
  /** Accent color (particles) */
  accent?: string;
}) => {
  const burst = (e: React.MouseEvent) => {
    const cx = e.clientX;
    const cy = e.clientY;
    for (let i = 0; i < 34; i++) {
      const p = document.createElement("div");
      const sz = 6 + Math.random() * 8;
      p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:${accent};border-radius:${Math.random() < 0.5 ? "50%" : "2px"};pointer-events:none;z-index:9999;transform:translate(-50%,-50%)`;
      document.body.appendChild(p);
      const ang = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 150;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const anim = p.animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${(dy + 100).toFixed(0)}px)) rotate(${(Math.random() * 720 - 360) | 0}deg)`,
            opacity: 0,
          },
        ],
        { duration: 750 + Math.random() * 550, easing: "cubic-bezier(.15,.6,.3,1)" },
      );
      anim.onfinish = () => p.remove();
    }
  };
  return (
    <button
      type="button"
      onClick={burst}
      style={{
        padding: "16px 30px",
        borderRadius: 16,
        border: "none",
        background: accent,
        color: klabOnAccent(accent),
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 12px 30px rgba(0,0,0,.4)",
        transition: "transform .12s",
        fontFamily: KLAB.ui,
      }}
    >
      {label}
    </button>
  );
};
