import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld biome badge — a pixel terrain swatch with its biome name.
 * Original set for Component Style Studio, inspired by worldbuilder
 * editorial systems. MIT.
 */
export const BiomeBadge = ({
  biome = "MARSH",
  color = "#5a8a4a",
}: {
  /** Biome name */
  biome?: string;
  /** Terrain color */
  color?: string;
}) => (
  <>
    <style>{OW_FONT_IMPORT}</style>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: `3px solid ${OW.ink}`,
        background: OW.parchment,
        padding: "4px 12px 4px 6px",
        fontFamily: OW.display,
        fontWeight: 700,
        fontSize: 12,
        color: OW.ink,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          background: `linear-gradient(180deg, ${color} 0 62%, color-mix(in srgb, ${color} 60%, ${OW.ink}) 62% 100%)`,
          boxShadow: `inset 0 0 0 2px ${OW.ink}`,
        }}
      />
      {biome}
    </span>
  </>
);
