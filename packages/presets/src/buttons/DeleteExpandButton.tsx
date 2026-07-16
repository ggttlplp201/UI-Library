/**
 * DeleteExpandButton — round trash-icon button that stretches into a pill on
 * hover, dropping the icon and revealing a "Delete" label.
 * Ported from UIverse.io (smart-emu-83) by vinodjangid07.
 * Source: https://uiverse.io/vinodjangid07/smart-emu-83
 * License: MIT. Attribution: vinodjangid07 via UIverse.io.
 */
import type { CSSProperties } from "react";

export const DeleteExpandButton = ({
  label = "Delete",
  accent = "rgb(255, 69, 69)",
  size = 50,
}: {
  /** Label revealed on hover */
  label?: string;
  /** Hover background color */
  accent?: string;
  /** Resting diameter in px */
  size?: number;
}) => (
  <>
    <style>{`
      .uv-delx-btn {
        width: var(--uv-delx-size);
        height: var(--uv-delx-size);
        border-radius: 50%;
        background-color: rgb(20, 20, 20);
        border: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
        cursor: pointer;
        transition-duration: .3s;
        overflow: hidden;
        position: relative;
      }
      .uv-delx-icon {
        width: 12px;
        transition-duration: .3s;
      }
      .uv-delx-icon path {
        fill: white;
      }
      .uv-delx-btn:hover {
        width: calc(var(--uv-delx-size) + 90px);
        border-radius: 50px;
        transition-duration: .3s;
        background-color: var(--uv-delx-accent);
        align-items: center;
      }
      .uv-delx-btn:hover .uv-delx-icon {
        width: var(--uv-delx-size);
        transition-duration: .3s;
        transform: translateY(60%);
      }
      .uv-delx-btn::before {
        position: absolute;
        top: -20px;
        content: attr(data-label);
        color: white;
        transition-duration: .3s;
        font-size: 2px;
      }
      .uv-delx-btn:hover::before {
        font-size: 13px;
        opacity: 1;
        transform: translateY(30px);
        transition-duration: .3s;
      }
    `}</style>
    <button
      type="button"
      className="uv-delx-btn"
      data-label={label}
      style={
        {
          "--uv-delx-size": `${size}px`,
          "--uv-delx-accent": accent,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 448 512" className="uv-delx-icon">
        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
      </svg>
    </button>
  </>
);
