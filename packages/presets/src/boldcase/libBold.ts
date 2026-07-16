import type { CSSProperties } from "react";

/**
 * Boldcase — editorial bento tokens: warm paper, oversized grotesk display,
 * hard ink borders with offset shadows, pop accents. Original set for
 * Component Style Studio, inspired by studio-editorial bento systems. MIT.
 */
export const BOLD = {
  paper: "#efe9df",
  ink: "#181511",
  red: "#f91814",
  blue: "#2b46ff",
  yellow: "#ffd750",
  display: "'Archivo Black', 'Arial Black', sans-serif",
  body: "'Inter Tight', 'Helvetica Neue', system-ui, sans-serif",
} as const;

export const BOLD_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter+Tight:wght@400;600;800&display=swap');";

/** Hard-framed bento surface with the kit's signature offset shadow. */
export const bentoFrame = (offset = 5): CSSProperties => ({
  background: BOLD.paper,
  border: `2px solid ${BOLD.ink}`,
  boxShadow: `${offset}px ${offset}px 0 0 ${BOLD.ink}`,
  borderRadius: 2,
});
