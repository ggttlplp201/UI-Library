import { KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab orbit loader — three dots orbit a common center.
 * (kinetic-lab.md · [ANIMATION] OrbitLoader, split from "08")
 */
export const OrbitLoader = ({
  accent = "#E3B23C",
}: {
  /** Accent color (dots) */
  accent?: string;
}) => {
  const dot: React.CSSProperties = {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: accent,
  };
  return (
    <div style={{ position: "relative", width: 42, height: 42, animation: "kl-orbit 1.2s linear infinite" }}>
      <style>{KLAB_KEYFRAMES}</style>
      <span style={{ ...dot, top: 0, left: "50%", marginLeft: -4.5 }} />
      <span style={{ ...dot, bottom: 0, left: "50%", marginLeft: -4.5 }} />
      <span style={{ ...dot, top: "50%", left: 0, marginTop: -4.5 }} />
    </div>
  );
};
