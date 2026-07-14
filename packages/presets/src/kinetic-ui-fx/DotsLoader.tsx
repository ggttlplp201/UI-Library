import { KUI_KEYFRAMES } from "../lib/kinetic";

/**
 * Kinetic UI dots loader — three dots bounce with a staggered delay.
 * (kinetic-ui.md · [ANIMATION], split from card 11)
 */
export const DotsLoader = ({
  accent = "#4B3BFF",
}: {
  /** Accent color (dots) */
  accent?: string;
}) => (
  <div style={{ display: "flex", gap: 8 }}>
    <style>{KUI_KEYFRAMES}</style>
    {[0, 0.16, 0.32].map((delay) => (
      <span
        key={delay}
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: accent,
          animation: `uk-dots 1.2s ease-in-out ${delay}s infinite`,
        }}
      />
    ))}
  </div>
);
