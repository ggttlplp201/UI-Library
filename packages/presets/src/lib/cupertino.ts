import type { CSSProperties } from "react";

/**
 * Cupertino — Liquid Glass tokens + material helpers (design handoff:
 * design_handoff_cupertino). Every component is visually self-contained: the
 * colorful tint is baked into each unit's own glass card, so it reads as
 * glass alone on any neutral surface.
 */

export type CuAppearance = "light" | "dark";

export const CU_FONT = "-apple-system, 'Inter', system-ui, sans-serif";

export const CU_KEYFRAMES = `
@keyframes cu-spin{to{transform:rotate(360deg)}}
@keyframes cu-indet{0%{left:-40%}100%{left:100%}}
@keyframes cu-toastin{from{opacity:0;transform:translateY(-14px) scale(.96)}to{opacity:1;transform:none}}
@keyframes cu-sheetin{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes cu-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
`;

export const cuInk = (dark: boolean) => ({
  head: dark ? "#f5f5f7" : "#1c1c1e",
  sub: dark ? "rgba(235,235,245,.6)" : "rgba(60,60,67,.6)",
});

export const cuAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const glassBorder = (dark: boolean) =>
  dark ? ".5px solid rgba(255,255,255,.16)" : ".5px solid rgba(255,255,255,.65)";

const glassShadow = (dark: boolean) =>
  dark
    ? "inset 0 1px 0 rgba(255,255,255,.14), inset 0 -.5px 0 rgba(255,255,255,.05), 0 12px 34px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.28)"
    : "inset 0 1px 0 rgba(255,255,255,.9), inset 0 -.5px 0 rgba(255,255,255,.3), 0 12px 34px rgba(30,40,80,.14), 0 2px 8px rgba(30,40,80,.08)";

const glassOverlay = (dark: boolean) =>
  dark
    ? "radial-gradient(120% 92% at 14% 0%, rgba(255,255,255,.14), transparent 52%), linear-gradient(160deg, rgba(30,32,38,.52), rgba(30,32,38,.4))"
    : "radial-gradient(120% 92% at 14% 0%, rgba(255,255,255,.6), transparent 52%), linear-gradient(160deg, rgba(255,255,255,.5), rgba(255,255,255,.34))";

/** The liquid-glass card every unit sits on: frosted overlay + its own tint. */
export const cuCard = (tint1: string, tint2: string, dark: boolean): CSSProperties => ({
  position: "relative",
  borderRadius: 22,
  padding: 20,
  overflow: "hidden",
  background: `${glassOverlay(dark)}, linear-gradient(135deg, ${tint1}, ${tint2})`,
  border: glassBorder(dark),
  boxShadow: glassShadow(dark),
  fontFamily: CU_FONT,
  boxSizing: "border-box",
});

/** Inline control glass (segmented track, fields, steppers) — sits ON a tinted card. */
export const cuControlGlass = (dark: boolean): CSSProperties => ({
  background: dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.5)",
  backdropFilter: "blur(14px) saturate(180%)",
  WebkitBackdropFilter: "blur(14px) saturate(180%)",
  border: glassBorder(dark),
});

/** Overlay glass (sheet / alert / toast) — frosts whatever is behind it. */
export const cuOverlayGlass = (dark: boolean): CSSProperties => ({
  background: dark ? "rgba(30,30,34,.7)" : "rgba(255,255,255,.7)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  border: glassBorder(dark),
});

export const cuLabelStyle = (dark: boolean): CSSProperties => ({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: ".04em",
  textTransform: "uppercase",
  color: cuInk(dark).sub,
  marginBottom: 14,
});

export const cuRowText = (dark: boolean): CSSProperties => ({
  fontSize: 15,
  fontWeight: 500,
  color: cuInk(dark).head,
});
