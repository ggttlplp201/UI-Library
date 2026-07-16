/**
 * RetroOrbsPattern — a repeating field of glossy orbs over a checkered conic
 * weave; reads as retro wallpaper at page scale.
 * Ported from UIverse.io (fuzzy-duck-40) by MikeAndrewDesigner.
 * Source: https://uiverse.io/MikeAndrewDesigner/fuzzy-duck-40
 * License: MIT. Attribution: MikeAndrewDesigner via UIverse.io.
 */
export const RetroOrbsPattern = ({
  size = 60,
  color1 = "#180a22",
  color2 = "#5b42f3",
}: {
  /** Tile size in px */
  size?: number;
  /** Dark weave color */
  color1?: string;
  /** Orb color */
  color2?: string;
}) => (
  <div
    style={
      {
        width: "100%",
        height: "100%",
        minWidth: 420,
        minHeight: 280,
        "--uv-rop-s": `${size}px`,
        "--uv-rop-c1": color1,
        "--uv-rop-c2": color2,
        "--uv-rop-g": "radial-gradient(25% 25% at 25% 25%, var(--uv-rop-c1) 99%, rgba(0,0,0,0) 101%)",
        background: `var(--uv-rop-g) var(--uv-rop-s) var(--uv-rop-s) / calc(2 * var(--uv-rop-s)) calc(2 * var(--uv-rop-s)),
          var(--uv-rop-g) 0 0 / calc(2 * var(--uv-rop-s)) calc(2 * var(--uv-rop-s)),
          radial-gradient(50% 50%, var(--uv-rop-c2) 98%, rgba(0,0,0,0)) 0 0 / var(--uv-rop-s) var(--uv-rop-s),
          repeating-conic-gradient(var(--uv-rop-c2) 0 50%, var(--uv-rop-c1) 0 100%) calc(0.5 * var(--uv-rop-s)) 0 / calc(2 * var(--uv-rop-s)) var(--uv-rop-s)`,
      } as React.CSSProperties
    }
  />
);
