import { C95, bevelIn } from "./lib95";

/**
 * Chicago 95 progress — the chunked navy block bar in a sunken well.
 * Original set for Component Style Studio, inspired by mid-90s desktop
 * chrome. MIT.
 */
export const Win95Progress = ({
  value = 60,
  width = 240,
}: {
  /** Progress 0–100 */
  value?: number;
  /** Bar width in px */
  width?: number;
}) => {
  const blocks = 16;
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * blocks);
  return (
    <div
      style={{
        ...bevelIn,
        width,
        padding: 3,
        display: "flex",
        gap: 2,
        boxSizing: "border-box",
        background: C95.paper,
      }}
    >
      {Array.from({ length: blocks }, (_, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            height: 16,
            background: i < filled ? C95.navy : "transparent",
          }}
        />
      ))}
    </div>
  );
};
