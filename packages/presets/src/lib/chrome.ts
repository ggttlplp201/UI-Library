/**
 * Chrome Console theme — material recipes + panel chrome (design handoff:
 * chrome-console.md). Industrial photographed-hardware feel, pure CSS:
 * polished mirror gradients, conic knob grain, knurl, brushed-steel panels,
 * engraved labels. Accent is used ONLY as small active highlights.
 */
import type { CSSProperties } from "react";

/** Parse an inline-CSS string into a React style object (keeps the handoff's
 * exact gradient/shadow recipes verbatim). */
export function sx(css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const part of css.split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const key = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (!key) continue;
    out[key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = value;
  }
  return out as CSSProperties;
}

export const CC_KEYFRAMES = `
@keyframes cc-spin{to{transform:rotate(360deg)}}
@keyframes cc-spinr{to{transform:rotate(-360deg)}}
@keyframes cc-lamp{0%,100%{opacity:1}50%{opacity:.82}}
`;

export type CCFinish = "chrome" | "graphite";

export interface CCMaterials {
  A: (a: number) => string;
  chromeV: string;
  grain: string;
  knurl: string;
  panelBg: string;
  panelText: string;
  panelSh: string;
  raised: string;
  wellIn: string;
  panel: string;
  label: string;
  readout: string;
  readVal: string;
  miniBtn: string;
  dot: (on: boolean) => string;
  screws: { s: string; slot: string }[];
  accent: string;
}

/** Build the full material set for an accent + finish (mirrors the handoff). */
export function ccMaterials(accent: string, finish: CCFinish): CCMaterials {
  const graphite = finish === "graphite";
  // Normalize the accent to 6-digit hex; anything unparseable falls back to
  // the theme default so the glow rgba() stays valid CSS.
  let h = accent.replace("#", "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.replace(/./g, (c) => c + c);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) h = "FF7A1A";
  accent = `#${h}`;
  const rgb = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  const A = (a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

  const chromeV = graphite
    ? "linear-gradient(180deg,#8c98a3 0%,#c2ccd4 7%,#3c454e 22%,#12181e 46%,#05080b 50%,#1a222a 55%,#5a6670 68%,#aab6bf 80%,#20272e 92%,#0b0f13 100%)"
    : "linear-gradient(180deg,#fbfdfe 0%,#dfe7ed 8%,#9aa6b1 23%,#4f5a65 41%,#232b33 49%,#161d24 52%,#48535e 57%,#b4c0c9 71%,#f4f8fb 82%,#c0cbd3 92%,#79858f 100%)";
  const grain = graphite
    ? "conic-gradient(from 0deg,#c4ccd3,#20272e,#8a939b,#0c1013,#aab3ba,#161d24,#dfe6ec,#12181e,#9aa3ab,#080b0e,#c4ccd3)"
    : "conic-gradient(from 0deg,#ffffff,#5a646e,#e8eef3,#28313a,#c4ccd3,#3c454e,#ffffff,#333c45,#c8d0d7,#20272e,#ffffff)";
  const knurl = graphite
    ? "repeating-linear-gradient(90deg,rgba(255,255,255,.32) 0 1px,rgba(0,0,0,.7) 1px 3px)"
    : "repeating-linear-gradient(90deg,rgba(255,255,255,.9) 0 1px,rgba(20,26,32,.65) 1px 3px)";
  const panelBg = graphite
    ? "repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0 1px,rgba(0,0,0,.08) 1px 2px),linear-gradient(180deg,#3d454d,#2b323a 50%,#39414a)"
    : "repeating-linear-gradient(90deg,rgba(255,255,255,.055) 0 1px,rgba(30,36,42,.05) 1px 2px),linear-gradient(180deg,#c7ced5,#aeb6be 48%,#c2c9d1)";
  const panelText = graphite ? "#c7ced4" : "#3a424b";
  const panelSh = graphite ? "0 1px 0 rgba(0,0,0,.6)" : "0 1px 0 rgba(255,255,255,.7)";
  const raised =
    "inset 0 1.5px 0 rgba(255,255,255,.9),inset 0 0 0 1px rgba(255,255,255,.3),inset 0 -3px 6px rgba(0,0,0,.45),0 6px 12px rgba(0,0,0,.5)";
  const wellIn =
    "inset 0 5px 12px rgba(0,0,0,.85),inset 0 -1.5px 1px rgba(255,255,255,.14),inset 0 0 0 1px rgba(0,0,0,.5)";

  const panel = `position:relative;border-radius:18px;padding:22px 20px 18px;min-height:246px;width:230px;display:flex;flex-direction:column;font-family:'Saira Condensed','Arial Narrow',sans-serif;background:${panelBg};box-shadow:inset 0 1px 0 rgba(255,255,255,${graphite ? ".22" : ".75"}),inset 0 0 0 1px rgba(0,0,0,.16),inset 0 -3px 5px rgba(0,0,0,.28),0 14px 30px rgba(0,0,0,.42)`;
  const label = `font-weight:700;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:${panelText};text-shadow:${panelSh};margin-bottom:4px`;
  const readout = `display:flex;align-items:center;justify-content:center;gap:7px;margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;color:${panelText};text-shadow:${panelSh}`;
  const readVal = `color:${accent};font-weight:700;text-shadow:0 0 6px ${A(0.55)}`;
  const miniBtn = `font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.16em;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;color:${panelText};text-shadow:${panelSh};background:${chromeV};box-shadow:${raised}`;
  const dot = (on: boolean) =>
    `width:7px;height:7px;border-radius:50%;background:${on ? `radial-gradient(circle at 40% 35%,#fff,${accent} 55%,${A(0.9)})` : "#5c666f"};box-shadow:${on ? `0 0 5px 1px ${A(0.9)},0 0 10px 2px ${A(0.5)}` : "inset 0 0 2px rgba(0,0,0,.6)"}`;

  const slotRot = [22, -16, -34, 12];
  const posv = ["top:10px;left:10px", "top:10px;right:10px", "bottom:10px;left:10px", "bottom:10px;right:10px"];
  const screws = posv.map((ps, i) => ({
    s: `position:absolute;${ps};width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 36% 28%,#ffffff,#b8c0c8 42%,#2e353c 100%);box-shadow:inset 0 1px 1px rgba(255,255,255,.9),inset 0 -1px 2px rgba(0,0,0,.6),0 1px 2px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center`,
    slot: `width:8px;height:2px;border-radius:1px;background:linear-gradient(90deg,#3a424b,#7a838c);box-shadow:0 1px 0 rgba(255,255,255,.4);transform:rotate(${slotRot[i]}deg)`,
  }));

  return { A, chromeV, grain, knurl, panelBg, panelText, panelSh, raised, wellIn, panel, label, readout, readVal, miniBtn, dot, screws, accent };
}
