/**
 * Divider — a hairline rule between sections.
 * Original component for Component Style Studio. License: MIT.
 */
export const Divider = ({
  width = 480,
  color = "rgba(180,175,160,0.25)",
  thickness = 1,
}: {
  /** Line length in px */
  width?: number;
  /** Line color */
  color?: string;
  /** Line thickness in px */
  thickness?: number;
}) => <div style={{ width, height: thickness, background: color }} />;
