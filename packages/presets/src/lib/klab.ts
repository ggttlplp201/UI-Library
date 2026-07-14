/**
 * Kinetic Lab theme tokens + shared keyframes (design handoff: kinetic-lab.md).
 * Dark, high-energy motion lab — Syne display, Space Grotesk UI, JetBrains
 * mono, single-hue gold accent. Pure CSS + rAF/WAAPI interactions.
 */
export const KLAB = {
  page: "#08080C",
  cardBg: "rgba(255,255,255,.04)",
  cardBorder: "1px solid rgba(255,255,255,.08)",
  text: "#F4F4F6",
  muted: "#9A9AA8",
  faint: "#63636f",
  accent: "#E3B23C",
  tileRadius: 22,
  spring: "cubic-bezier(.34,1.6,.5,1)",
  springHard: "cubic-bezier(.34,1.7,.45,1)",
  display: "'Syne', system-ui, sans-serif",
  ui: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Black-or-white ink that reads on a given accent (reference `onAccent`). */
export function klabOnAccent(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  if (Number.isNaN(n)) return "#fff";
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#08080C" : "#fff";
}

/** Small ghost button used by the lab's Replay/Fill controls. */
export const KLAB_SMALL_BTN: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.05)",
  color: "#F4F4F6",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all .15s",
  fontFamily: KLAB.ui,
};

export const KLAB_KEYFRAMES = `
@keyframes kl-ripple{to{transform:scale(4);opacity:0}}
@keyframes kl-spin{to{transform:rotate(360deg)}}
@keyframes kl-blob{0%{border-radius:42% 58% 63% 37%/41% 44% 56% 59%}50%{border-radius:63% 37% 41% 59%/58% 63% 37% 42%}100%{border-radius:42% 58% 63% 37%/41% 44% 56% 59%}}
@keyframes kl-bars{0%,100%{transform:scaleY(.28)}50%{transform:scaleY(1)}}
@keyframes kl-water{to{transform:translate(-50%,-72%) rotate(360deg)}}
@keyframes kl-orbit{to{transform:rotate(360deg)}}
@keyframes kl-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
@keyframes kl-glitchtop{0%{clip-path:inset(0 0 90% 0);transform:translate(0)}2%{clip-path:inset(18% 0 55% 0);transform:translate(-5px,-2px)}4%{clip-path:inset(60% 0 22% 0);transform:translate(5px,2px)}6%{clip-path:inset(8% 0 78% 0);transform:translate(-4px,1px)}8%{clip-path:inset(45% 0 33% 0);transform:translate(4px,-1px)}10%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)}}
@keyframes kl-glitchbot{0%{clip-path:inset(90% 0 0 0);transform:translate(0)}3%{clip-path:inset(55% 0 20% 0);transform:translate(5px,2px)}5%{clip-path:inset(22% 0 60% 0);transform:translate(-5px,-2px)}7%{clip-path:inset(75% 0 10% 0);transform:translate(4px,-1px)}9%{clip-path:inset(33% 0 45% 0);transform:translate(-4px,1px)}11%,100%{clip-path:inset(100% 0 0 0);transform:translate(0)}}
@keyframes kl-shine{0%{transform:translateX(-160%) skewX(-18deg)}100%{transform:translateX(260%) skewX(-18deg)}}
`;
