import { KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab equalizer loader — four bars scale with a staggered delay.
 * (kinetic-lab.md · [ANIMATION] EqualizerLoader, split from "08")
 */
export const EqualizerLoader = ({
  accent = "#E3B23C",
}: {
  /** Accent color (bars) */
  accent?: string;
}) => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", height: 42 }}>
    <style>{KLAB_KEYFRAMES}</style>
    {[0, 0.15, 0.3, 0.45].map((delay) => (
      <span
        key={delay}
        style={{
          width: 5,
          height: 34,
          borderRadius: 3,
          background: accent,
          animation: `kl-bars 1s ease-in-out ${delay}s infinite`,
        }}
      />
    ))}
  </div>
);
