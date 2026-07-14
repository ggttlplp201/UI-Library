/**
 * Kinetic UI theme tokens + shared keyframes (design handoff: kinetic-ui.md).
 * Light editorial kit — Space Grotesk display, IBM Plex body/mono, indigo
 * accent. Every visual is pure CSS; components inline these tokens so each
 * unit stays self-contained (and serializes cleanly into exports).
 */
export const KUI = {
  page: "#F4F3EF",
  card: "#FFFFFF",
  border: "#E6E4DC",
  hairline: "#EDEBE4",
  ink: "#1A1A1E",
  secondary: "#54545c",
  muted: "#6B6B72",
  faint: "#a5a29a",
  accent: "#4B3BFF",
  softTint: "#ECEAFF",
  success: "#12A150",
  warn: "#B8760A",
  warnAlt: "#E08600",
  danger: "#E5484D",
  radius: "11px",
  cardRadius: "16px",
  shadow: "0 1px 2px rgba(20,20,30,.04), 0 10px 30px rgba(20,20,30,.03)",
  spring: "cubic-bezier(.34,1.56,.64,1)",
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
} as const;

/** Soft 12%-alpha tint of the accent (reference uses accent+'1f'). Non-hex
 * inputs (rgb(), var(), named colors) get a color-mix fallback instead of an
 * invalid hex-alpha concat. */
export const kuiSoft = (accent: string) =>
  /^#[0-9a-fA-F]{6}$/.test(accent)
    ? `${accent}1f`
    : `color-mix(in srgb, ${accent} 12%, transparent)`;

/** Shared keyframes; components render these in a local <style> tag. */
export const KUI_KEYFRAMES = `
@keyframes uk-spin{to{transform:rotate(360deg)}}
@keyframes uk-dots{0%,80%,100%{transform:scale(.5);opacity:.4}40%{transform:scale(1);opacity:1}}
@keyframes uk-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes uk-toastin{from{opacity:0;transform:translateX(46px) scale(.94)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes uk-modalin{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes uk-fadein{from{opacity:0}to{opacity:1}}
@keyframes uk-ring{0%{opacity:.5;transform:scale(.7)}70%{opacity:0;transform:scale(2.4)}100%{opacity:0;transform:scale(2.4)}}
@keyframes uk-menuin{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes uk-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes uk-bar{0%{left:-40%}100%{left:100%}}
@keyframes uk-pop{0%{transform:scale(1)}45%{transform:scale(1.35)}100%{transform:scale(1)}}
`;
