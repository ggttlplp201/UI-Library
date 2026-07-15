import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

/**
 * Kinetic UI spinner — border-spin circle.
 * (kinetic-ui.md · [ANIMATION], split from card 11)
 */
export const KineticSpinner = ({
  size = 40,
  accent = "#4B3BFF",
}: {
  /** Diameter in px */
  size?: number;
  /** Accent color (spinning arc) */
  accent?: string;
}) => (
  <div
    style={{
      width: size,
      height: size,
      border: `4px solid ${KUI.hairline}`,
      borderTopColor: accent,
      borderRadius: "50%",
      animation: "uk-spin .7s linear infinite",
      boxSizing: "border-box",
    }}
  >
    <style>{KUI_KEYFRAMES}</style>
  </div>
);
