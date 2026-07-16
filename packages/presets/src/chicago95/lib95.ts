import type { CSSProperties } from "react";

/**
 * Chicago 95 — retro desktop OS tokens. Beveled silver chrome, navy title
 * bars, pixel-tight system type. Original set for Component Style Studio,
 * inspired by mid-90s desktop chrome. MIT.
 */
export const C95 = {
  chrome: "#c0c0c0",
  chromeLight: "#ffffff",
  chromeDark: "#808080",
  chromeDarker: "#404040",
  navy: "#000080",
  navy2: "#1084d0",
  ink: "#000000",
  paper: "#ffffff",
  desktop: "#008080",
  font: "'Tahoma', 'MS Sans Serif', 'Segoe UI', system-ui, sans-serif",
} as const;

/** Raised bevel (buttons, windows). */
export const bevelOut: CSSProperties = {
  background: C95.chrome,
  borderTop: `2px solid ${C95.chromeLight}`,
  borderLeft: `2px solid ${C95.chromeLight}`,
  borderRight: `2px solid ${C95.chromeDarker}`,
  borderBottom: `2px solid ${C95.chromeDarker}`,
  boxShadow: `inset -1px -1px 0 ${C95.chromeDark}, inset 1px 1px 0 ${C95.chrome}`,
};

/** Sunken bevel (fields, pressed states, wells). */
export const bevelIn: CSSProperties = {
  background: C95.paper,
  borderTop: `2px solid ${C95.chromeDarker}`,
  borderLeft: `2px solid ${C95.chromeDarker}`,
  borderRight: `2px solid ${C95.chromeLight}`,
  borderBottom: `2px solid ${C95.chromeLight}`,
  boxShadow: `inset 1px 1px 0 ${C95.chromeDark}`,
};

export const titleBar = (title: string) => ({ title });
