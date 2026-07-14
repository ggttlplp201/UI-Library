import { useRef } from "react";
import { KLAB, KLAB_KEYFRAMES, klabOnAccent } from "../lib/klab";

/**
 * Kinetic Lab magnetic button — translates toward the cursor (0.4× offset)
 * and springs back on leave; shine sweep on hover.
 * (kinetic-lab.md · [ANIMATION] MagneticButton)
 */
export const MagneticButton = ({
  label = "Pull me →",
  accent = "#E3B23C",
}: {
  /** Button text */
  label?: string;
  /** Accent color */
  accent?: string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const t = ref.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    t.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.04)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0) scale(1)";
  };
  return (
    // Generous hover field so the pull is felt before touching the button.
    <div style={{ padding: 34 }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <style>{`${KLAB_KEYFRAMES}
.kl-mag{overflow:hidden}
.kl-mag:hover .kl-mag-shine{animation:kl-shine .8s ease}
`}</style>
      <button
        ref={ref}
        type="button"
        className="kl-mag"
        style={{
          position: "relative",
          padding: "16px 32px",
          borderRadius: 16,
          border: "none",
          background: accent,
          color: klabOnAccent(accent),
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          transition: `transform .35s ${KLAB.springHard}`,
          boxShadow: "0 12px 30px rgba(0,0,0,.4)",
          fontFamily: KLAB.ui,
        }}
      >
        <span
          className="kl-mag-shine"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "40%",
            background: "linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)",
            transform: "translateX(-160%) skewX(-18deg)",
            pointerEvents: "none",
          }}
        />
        {label}
      </button>
    </div>
  );
};
