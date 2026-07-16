/**
 * PageBackdrop — a full-page atmosphere layer: base color with a soft accent
 * glow bleeding down from the top (the same lamp/stage light the section
 * headers cast), plus a faint vignette so a long page never reads as flat
 * black. Drop it first, stretch it over the whole page, build on top.
 * Original component for Component Style Studio. License: MIT.
 */
export const PageBackdrop = ({
  accent = "#4B3BFF",
  base = "#0b0b0d",
  glowStrength = 0.16,
}: {
  /** Glow color — usually the page's accent */
  accent?: string;
  /** Base page color */
  base?: string;
  /** 0–1 opacity of the top glow */
  glowStrength?: number;
}) => {
  const a = Math.round(Math.min(1, Math.max(0, glowStrength)) * 255)
    .toString(16)
    .padStart(2, "0");
  const half = Math.round(Math.min(1, Math.max(0, glowStrength * 0.45)) * 255)
    .toString(16)
    .padStart(2, "0");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: 320,
        minHeight: 200,
        background: [
          `radial-gradient(90% 42% at 50% -6%, ${accent}${a}, transparent 70%)`,
          `radial-gradient(45% 30% at 12% 30%, ${accent}${half}, transparent 75%)`,
          `radial-gradient(50% 34% at 88% 62%, ${accent}${half}, transparent 75%)`,
          base,
        ].join(", "),
      }}
    />
  );
};
