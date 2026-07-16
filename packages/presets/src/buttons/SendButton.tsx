/**
 * SendButton — on hover the paper-plane icon flies off while the label
 * slides away, like the message just departed.
 * Ported from UIverse.io (smart-moth-68) by adamgiebl.
 * Source: https://uiverse.io/adamgiebl/smart-moth-68
 * License: MIT. Attribution: adamgiebl via UIverse.io.
 */
import type { CSSProperties } from "react";

export const SendButton = ({
  label = "Send",
  accent = "royalblue",
  fontSize = 20,
}: {
  /** Button text */
  label?: string;
  /** Background color */
  accent?: string;
  /** Font size in px */
  fontSize?: number;
}) => (
  <>
    <style>{`
      .uv-send-btn {
        font-family: inherit;
        font-size: var(--uv-send-font-size);
        background: var(--uv-send-accent);
        color: white;
        padding: 0.7em 1em;
        padding-left: 0.9em;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.2s;
        cursor: pointer;
      }
      .uv-send-btn span {
        display: block;
        margin-left: 0.3em;
        transition: all 0.3s ease-in-out;
      }
      .uv-send-btn svg {
        display: block;
        transform-origin: center center;
        transition: transform 0.3s ease-in-out;
      }
      .uv-send-btn:hover .uv-send-svg-wrapper {
        animation: uv-send-fly 0.6s ease-in-out infinite alternate;
      }
      .uv-send-btn:hover svg {
        transform: translateX(1.2em) rotate(45deg) scale(1.1);
      }
      .uv-send-btn:hover span {
        transform: translateX(5em);
      }
      .uv-send-btn:active {
        transform: scale(0.95);
      }
      @keyframes uv-send-fly {
        from { transform: translateY(0.1em); }
        to { transform: translateY(-0.1em); }
      }
    `}</style>
    <button
      type="button"
      className="uv-send-btn"
      style={
        {
          "--uv-send-accent": accent,
          "--uv-send-font-size": `${fontSize}px`,
        } as CSSProperties
      }
    >
      <div className="uv-send-svg-wrapper-1">
        <div className="uv-send-svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </div>
      <span>{label}</span>
    </button>
  </>
);
