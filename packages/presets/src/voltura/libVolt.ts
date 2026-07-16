import type { CSSProperties } from "react";

/**
 * Voltura — dark-luxe trading tokens: inky olive panels on a citrine field,
 * one acid-lime focal, tabular numerals. Original set for Component Style
 * Studio, inspired by dark-luxe trading workspaces. MIT.
 */
export const VOLT = {
  citrine: "#d8c26a",
  panel: "#1d2016",
  panel2: "#262a1c",
  hairline: "rgba(216,194,106,.22)",
  lime: "#c8f542",
  inkOnLime: "#1d2016",
  text: "#e9e4cf",
  dim: "rgba(233,228,207,.55)",
  up: "#7ddf6a",
  down: "#e0604f",
  font: "'Space Grotesk', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const VOLT_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');";

/** The olive workspace panel. */
export const voltPanel: CSSProperties = {
  background: `linear-gradient(165deg, ${VOLT.panel2}, ${VOLT.panel})`,
  border: `1px solid ${VOLT.hairline}`,
  borderRadius: 20,
  color: VOLT.text,
};
