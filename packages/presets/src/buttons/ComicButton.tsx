/**
 * ComicButton — chunky comic-book button with a hard offset shadow that
 * flattens on press.
 * Ported from UIverse.io (wicked-cobra-3) by Gautammsharma.
 * Source: https://uiverse.io/Gautammsharma/wicked-cobra-3
 * License: MIT. Attribution: Gautammsharma via UIverse.io.
 */
import type { CSSProperties } from "react";

export const ComicButton = ({
  label = "Click me!",
  accent = "#ff5252",
  activeColor = "#fcf414",
  fontSize = 24,
}: {
  /** Button text */
  label?: string;
  /** Fill color (becomes outline color on hover) */
  accent?: string;
  /** Flash color while pressed */
  activeColor?: string;
  /** Font size in px */
  fontSize?: number;
}) => (
  <>
    <style>{`
      .uv-comic-button {
        display: inline-block;
        padding: 10px 20px;
        font-size: var(--uv-cb-font-size);
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background-color: var(--uv-cb-accent);
        border: 2px solid #000;
        border-radius: 10px;
        box-shadow: 5px 5px 0px #000;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .uv-comic-button:hover {
        background-color: #fff;
        color: var(--uv-cb-accent);
        border: 2px solid var(--uv-cb-accent);
        box-shadow: 5px 5px 0px var(--uv-cb-accent);
      }
      .uv-comic-button:active {
        background-color: var(--uv-cb-active-color);
        box-shadow: none;
        transform: translateY(4px);
      }
    `}</style>
    <button
      type="button"
      className="uv-comic-button"
      style={
        {
          "--uv-cb-accent": accent,
          "--uv-cb-active-color": activeColor,
          "--uv-cb-font-size": `${fontSize}px`,
        } as CSSProperties
      }
    >
      {label}
    </button>
  </>
);
