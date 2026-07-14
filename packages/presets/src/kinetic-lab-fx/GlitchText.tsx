import { KLAB, KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab glitch text — two clipped accent clones jitter in periodic
 * bursts (steps(1) keyframes). (kinetic-lab.md · [ANIMATION] GlitchText)
 */
export const GlitchText = ({
  text = "GLITCH",
  accent = "#E3B23C",
}: {
  /** The glitching word */
  text?: string;
  /** Accent color (the clones) */
  accent?: string;
}) => {
  const clone: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    color: accent,
  };
  return (
    <div
      style={{
        position: "relative",
        fontFamily: KLAB.display,
        fontWeight: 800,
        fontSize: 44,
        letterSpacing: "-.02em",
        color: KLAB.text,
        padding: "6px 8px",
      }}
    >
      <style>{KLAB_KEYFRAMES}</style>
      {text}
      <span aria-hidden style={{ ...clone, animation: "kl-glitchtop 4s steps(1) infinite", padding: "6px 8px" }}>
        {text}
      </span>
      <span aria-hidden style={{ ...clone, animation: "kl-glitchbot 4s steps(1) infinite", padding: "6px 8px" }}>
        {text}
      </span>
    </div>
  );
};
