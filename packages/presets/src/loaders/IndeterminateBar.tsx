import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

/**
 * Kinetic UI indeterminate bar — a 40% segment loops across the track.
 * (kinetic-ui.md · [ANIMATION], split from card 11)
 */
export const IndeterminateBar = ({
  accent = "#4B3BFF",
}: {
  /** Accent color (moving segment) */
  accent?: string;
}) => (
  <div
    style={{
      position: "relative",
      width: 260,
      height: 8,
      background: KUI.hairline,
      borderRadius: 999,
      overflow: "hidden",
    }}
  >
    <style>{KUI_KEYFRAMES}</style>
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "40%",
        height: "100%",
        background: accent,
        borderRadius: 999,
        animation: "uk-bar 1.3s ease-in-out infinite",
      }}
    />
  </div>
);
