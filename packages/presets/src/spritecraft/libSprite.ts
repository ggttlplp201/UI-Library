import type { CSSProperties } from "react";

/**
 * Spritecraft — light pixel-art game UI tokens: parchment surfaces, chunky
 * stepped "pixel" borders, coin gold / grass green / sky blue. Original set
 * for Component Style Studio, inspired by 8-bit game HUDs. MIT.
 */
export const SPR = {
  parchment: "#f4e7c8",
  parchmentDeep: "#e8d5a8",
  ink: "#3a2c1e",
  grass: "#57a63a",
  sky: "#4aa3e0",
  gold: "#f2b632",
  heart: "#e04a4a",
  font: "'Press Start 2P', 'Courier New', monospace",
} as const;

export const SPR_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');";

/** Chunky stepped pixel border via box-shadow staircase (no radius, ever). */
export const pixelBorder = (ink: string = SPR.ink, px = 3): CSSProperties => ({
  boxShadow: [
    `0 ${-px}px 0 0 ${ink}`,
    `0 ${px}px 0 0 ${ink}`,
    `${-px}px 0 0 0 ${ink}`,
    `${px}px 0 0 0 ${ink}`,
  ].join(", "),
  borderRadius: 0,
});
