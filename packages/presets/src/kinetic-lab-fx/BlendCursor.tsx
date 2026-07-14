import { useRef } from "react";
import { KLAB } from "../lib/klab";

/**
 * Kinetic Lab blend cursor — a solid accent disc trails the cursor and
 * inverts whatever it crosses via mix-blend-mode: difference.
 * (kinetic-lab.md · [ANIMATION] BlendCursor)
 */
export const BlendCursor = ({
  text = "HOVER",
  accent = "#E3B23C",
}: {
  /** Display text the disc inverts over */
  text?: string;
  /** Disc color */
  accent?: string;
}) => {
  const dot = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = dot.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.transform = `translate(${e.clientX - r.left - 33}px, ${e.clientY - r.top - 33}px)`;
  };
  const onLeave = () => {
    if (dot.current) dot.current.style.transform = "translate(-120px,-120px)";
  };
  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        width: 300,
        height: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 14,
        cursor: "none",
        background: KLAB.page,
      }}
    >
      <span
        style={{
          fontFamily: KLAB.display,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: "-.03em",
          color: KLAB.text,
        }}
      >
        {text}
      </span>
      <div
        ref={dot}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 66,
          height: 66,
          borderRadius: "50%",
          background: accent,
          mixBlendMode: "difference",
          pointerEvents: "none",
          transform: "translate(-120px,-120px)",
          transition: "transform .14s cubic-bezier(.2,.8,.3,1)",
          willChange: "transform",
        }}
      />
    </div>
  );
};
