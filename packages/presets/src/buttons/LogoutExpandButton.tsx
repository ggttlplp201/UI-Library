/**
 * LogoutExpandButton — round sign-out button that widens into a pill on
 * hover, sliding the icon left and fading a text label in.
 * Ported from UIverse.io (thin-duck-22) by vinodjangid07.
 * Source: https://uiverse.io/vinodjangid07/thin-duck-22
 * License: MIT. Attribution: vinodjangid07 via UIverse.io.
 */
import type { CSSProperties } from "react";

export const LogoutExpandButton = ({
  label = "Logout",
  accent = "rgb(255, 65, 65)",
  size = 45,
}: {
  /** Label revealed on hover */
  label?: string;
  /** Background color */
  accent?: string;
  /** Resting diameter in px */
  size?: number;
}) => (
  <>
    <style>{`
      .uv-lox-btn {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: var(--uv-lox-size);
        height: var(--uv-lox-size);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition-duration: .3s;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
        background-color: var(--uv-lox-accent);
      }
      .uv-lox-sign {
        width: 100%;
        transition-duration: .3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .uv-lox-sign svg {
        width: 17px;
      }
      .uv-lox-sign svg path {
        fill: white;
      }
      .uv-lox-text {
        position: absolute;
        right: 0%;
        width: 0%;
        opacity: 0;
        color: white;
        font-size: 1.2em;
        font-weight: 600;
        transition-duration: .3s;
      }
      .uv-lox-btn:hover {
        width: calc(var(--uv-lox-size) + 80px);
        border-radius: 40px;
        transition-duration: .3s;
      }
      .uv-lox-btn:hover .uv-lox-sign {
        width: 30%;
        transition-duration: .3s;
        padding-left: 20px;
      }
      .uv-lox-btn:hover .uv-lox-text {
        opacity: 1;
        width: 70%;
        transition-duration: .3s;
        padding-right: 10px;
      }
      .uv-lox-btn:active {
        transform: translate(2px, 2px);
      }
    `}</style>
    <button
      type="button"
      className="uv-lox-btn"
      style={
        {
          "--uv-lox-size": `${size}px`,
          "--uv-lox-accent": accent,
        } as CSSProperties
      }
    >
      <div className="uv-lox-sign">
        <svg viewBox="0 0 512 512">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
        </svg>
      </div>
      <div className="uv-lox-text">{label}</div>
    </button>
  </>
);
