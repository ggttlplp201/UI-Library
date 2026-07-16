import type { CSSProperties } from "react";

/**
 * Overworld — pixel-art editorial tokens: warm parchment, 16-bit dusk
 * landscape strips, blocky display type, thick ink outlines. Original set
 * for Component Style Studio, inspired by worldbuilder editorial systems. MIT.
 */
export const OW = {
  parchment: "#ecdcb8",
  parchmentDeep: "#dfcda2",
  ink: "#2e2418",
  dusk1: "#7a4a8a",
  dusk2: "#c86a4a",
  dusk3: "#e8a25a",
  grass: "#5a8a4a",
  water: "#4a7a9a",
  display: "'Silkscreen', 'Press Start 2P', monospace",
  body: "'Georgia', serif",
} as const;

export const OW_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');";

/** A 16-bit dusk landscape strip: terraced mountain gradient bands. */
export const landscape = (h = 96): CSSProperties => ({
  height: h,
  background: [
    // stepped mountain silhouettes via hard-stop conic slices
    `linear-gradient(180deg, ${OW.dusk1} 0 30%, ${OW.dusk2} 30% 55%, ${OW.dusk3} 55% 72%, ${OW.grass} 72% 88%, ${OW.water} 88% 100%)`,
  ].join(", "),
  backgroundSize: "100% 100%",
  imageRendering: "pixelated",
  position: "relative",
  overflow: "hidden",
});
