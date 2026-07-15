/**
 * LampHeader — a glowing lamp bar lights a headline from above.
 * Rebuilt from scratch, inspired by Aceternity UI (lamp).
 * Inspiration: https://ui.aceternity.com/components/lamp
 * Original implementation for Component Style Studio. License: MIT.
 */

export const LampHeader = ({
  title = "Light the way",
  subtitle = "A section header lit by its own lamp.",
  accent = "#22d3ee",
  background = "#0a0a12",
}: {
  /** Headline under the lamp */
  title?: string;
  /** Supporting line */
  subtitle?: string;
  /** Lamp color */
  accent?: string;
  /** Section background color */
  background?: string;
}) => (
  <section
    style={{
      position: "relative",
      width: 640,
      maxWidth: "100%",
      padding: "72px 32px 48px",
      borderRadius: 20,
      overflow: "hidden",
      background,
      textAlign: "center",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <style>{`
@keyframes sslamp-breathe { 0%, 100% { opacity: .75; } 50% { opacity: 1; } }
`}</style>
    {/* the lamp bar */}
    <div
      style={{
        position: "absolute",
        top: 40,
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 4,
        borderRadius: 999,
        background: accent,
        boxShadow: `0 0 12px 2px ${accent}, 0 0 40px 8px ${accent}66`,
        animation: "sslamp-breathe 4s ease-in-out infinite",
      }}
    />
    {/* cone of light */}
    <div
      style={{
        position: "absolute",
        top: 42,
        left: "50%",
        transform: "translateX(-50%)",
        width: 420,
        height: 190,
        background: `conic-gradient(from 90deg at 50% 0%, transparent 40deg, ${accent}2e 90deg, transparent 140deg)`,
        filter: "blur(14px)",
        pointerEvents: "none",
        animation: "sslamp-breathe 4s ease-in-out infinite",
      }}
    />
    <h2
      style={{
        position: "relative",
        margin: "36px 0 0",
        fontSize: 34,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "#f4f4f6",
        textShadow: `0 0 24px ${accent}55`,
      }}
    >
      {title}
    </h2>
    <p style={{ position: "relative", margin: "10px 0 0", fontSize: 14, color: "#9a9aa8" }}>
      {subtitle}
    </p>
  </section>
);
