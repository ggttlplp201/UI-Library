import { useRef } from "react";
import { KLAB } from "../lib/klab";

/**
 * Kinetic Lab 3D tilt card — parallax tilt follows the cursor with a moving
 * specular glare; springs flat on leave.
 * (kinetic-lab.md · [ANIMATION] TiltCard)
 */
export const TiltCard = ({
  title = "Kinetic Card",
  subtitle = "** ** ** 4291",
  accent = "#E3B23C",
}: {
  /** Card display name */
  title?: string;
  /** Mono top line */
  subtitle?: string;
  /** Card color */
  accent?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const t = ref.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    t.style.transition = "transform .08s linear";
    t.style.transform = `rotateY(${(px * 22).toFixed(2)}deg) rotateX(${(-py * 22).toFixed(2)}deg) scale(1.05)`;
    if (glare.current)
      glare.current.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(0)}% ${((py + 0.5) * 100).toFixed(0)}%, rgba(255,255,255,.4), transparent 55%)`;
  };
  const onLeave = () => {
    const t = ref.current;
    if (!t) return;
    t.style.transition = "transform .55s cubic-bezier(.34,1.56,.64,1)";
    t.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    if (glare.current) glare.current.style.background = "none";
  };
  return (
    <div style={{ perspective: 900, padding: 24 }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          position: "relative",
          width: 180,
          height: 118,
          borderRadius: 16,
          background: accent,
          boxShadow: "0 18px 40px rgba(0,0,0,.45)",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#08080C",
          }}
        >
          <span style={{ fontFamily: KLAB.mono, fontSize: 11, opacity: 0.8 }}>{subtitle}</span>
          <span style={{ fontFamily: KLAB.display, fontWeight: 700, fontSize: 16 }}>{title}</span>
        </div>
        <div ref={glare} style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none" }} />
      </div>
    </div>
  );
};
