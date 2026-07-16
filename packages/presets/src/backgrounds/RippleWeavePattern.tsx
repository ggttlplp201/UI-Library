/**
 * RippleWeavePattern — interlocking quarter-ripples in two inks, tiled into a
 * woven wave field.
 * Ported from UIverse.io (kind-panther-75) by marcelodolza.
 * Source: https://uiverse.io/marcelodolza/kind-panther-75
 * License: MIT. Attribution: marcelodolza via UIverse.io.
 */
export const RippleWeavePattern = ({
  size = 100,
  color1 = "#f8b195",
  color2 = "#355c7d",
}: {
  /** Tile size in px */
  size?: number;
  /** Warm ripple color */
  color1?: string;
  /** Cool ripple color */
  color2?: string;
}) => (
  <div
    style={
      {
        width: "100%",
        height: "100%",
        minWidth: 420,
        minHeight: 280,
        "--uv-rwp-s": `${size}px`,
        "--uv-rwp-c1": color1,
        "--uv-rwp-c2": color2,
        "--uv-rwp-g":
          "var(--uv-rwp-c2) 4% 14%, var(--uv-rwp-c1) 14% 24%, var(--uv-rwp-c2) 22% 34%, var(--uv-rwp-c1) 34% 44%, var(--uv-rwp-c2) 44% 56%, var(--uv-rwp-c1) 56% 66%, var(--uv-rwp-c2) 66% 76%, var(--uv-rwp-c1) 76% 86%, var(--uv-rwp-c2) 86% 96%",
        background: `radial-gradient(100% 100% at 100% 0, var(--uv-rwp-c1) 4%, var(--uv-rwp-g), #0008 96%, #0000),
          radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, var(--uv-rwp-g), var(--uv-rwp-c1) 96%) var(--uv-rwp-c1)`,
        backgroundSize: "var(--uv-rwp-s) var(--uv-rwp-s)",
      } as React.CSSProperties
    }
  />
);
