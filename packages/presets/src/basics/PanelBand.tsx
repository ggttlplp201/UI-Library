/**
 * PanelBand — a soft background panel to group a cluster of components into
 * a section. Place it first so it sits behind everything in its zone.
 * Original component for Component Style Studio. License: MIT.
 */
export const PanelBand = ({
  background = "rgba(255,255,255,0.04)",
  borderColor = "rgba(255,255,255,0.09)",
  radius = 18,
  width = 1000,
  height = 320,
  borderStyle = "solid",
  borderWidth = 1,
}: {
  /** Panel fill */
  background?: string;
  /** 1px border color (transparent hides it) */
  borderColor?: string;
  /** Corner radius in px */
  radius?: number;
  /** Panel width in px */
  width?: number;
  /** Panel height in px */
  height?: number;
  /** Border style — dashed reads as a cutting-mat frame */
  borderStyle?: "solid" | "dashed" | "dotted";
  /** Border width in px */
  borderWidth?: number;
}) => (
  <div
    style={{
      width,
      height,
      background,
      border: `${borderWidth}px ${borderStyle} ${borderColor}`,
      borderRadius: radius,
      boxSizing: "border-box",
    }}
  />
);
