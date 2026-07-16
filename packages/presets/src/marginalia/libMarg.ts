import type { CSSProperties } from "react";

/**
 * Marginalia — school-notebook tokens: ruled cream paper, ink-blue lines, a
 * red margin rule, handwriting accents. Original set for Component Style
 * Studio, inspired by classroom journals. MIT.
 */
export const MARG = {
  paper: "#fdf9ee",
  rule: "rgba(43,74,155,.22)",
  margin: "#d94f43",
  ink: "#2b4a9b",
  pencil: "#5c5850",
  hand: "'Caveat', 'Comic Sans MS', cursive",
  body: "'Georgia', 'Times New Roman', serif",
} as const;

export const MARG_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');";

/** Ruled notebook paper with the red margin rule at `marginX` px. */
export const ruledPaper = (marginX = 34, lineGap = 28): CSSProperties => ({
  background: `linear-gradient(90deg, transparent ${marginX - 1}px, ${MARG.margin} ${marginX - 1}px, ${MARG.margin} ${marginX + 1}px, transparent ${marginX + 1}px), repeating-linear-gradient(0deg, transparent 0 ${lineGap - 1}px, ${MARG.rule} ${lineGap - 1}px ${lineGap}px), ${MARG.paper}`,
  boxShadow: "0 1px 3px rgba(60,50,30,.18), 0 6px 18px rgba(60,50,30,.08)",
});
