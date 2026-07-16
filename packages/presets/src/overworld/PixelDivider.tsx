import { OW } from "./libWorld";

/**
 * Overworld pixel divider — a stepped terrain rule between sections.
 * Original set for Component Style Studio, inspired by worldbuilder
 * editorial systems. MIT.
 */
export const PixelDivider = ({
  color = "#c86a4a",
  width = 420,
}: {
  /** Step color */
  color?: string;
  /** Divider width in px */
  width?: number;
}) => {
  const steps = Math.max(6, Math.floor(width / 36));
  return (
    <div style={{ width, display: "flex", alignItems: "flex-end", gap: 0, height: 18 }}>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            height: 6 + ((i % 3) + 1) * 4,
            background: i % 2 ? color : OW.ink,
          }}
        />
      ))}
    </div>
  );
};
