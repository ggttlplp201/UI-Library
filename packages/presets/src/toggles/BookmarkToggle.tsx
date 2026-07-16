/**
 * BookmarkToggle — bookmark icon that squashes, fills with color, and fires
 * a ring + confetti-dot burst when saved.
 * Ported from UIverse.io (mighty-warthog-42) by Galahhad.
 * Source: https://uiverse.io/Galahhad/mighty-warthog-42
 * License: MIT. Attribution: Galahhad via UIverse.io.
 */
import { useState, type CSSProperties } from "react";

export const BookmarkToggle = ({
  defaultChecked = false,
  accent = "gold",
  idleColor = "rgb(77, 77, 77)",
  size = 24,
}: {
  /** Initial saved state */
  defaultChecked?: boolean;
  /** Fill + burst color when saved */
  accent?: string;
  /** Icon color when not saved */
  idleColor?: string;
  /** Icon width in px */
  size?: number;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <>
      <style>{`
        .uv-bmk {
          --uv-bmk-hover: rgb(97, 97, 97);
          --uv-bmk-circle-border: 1px solid var(--uv-bmk-primary);
          --uv-bmk-circle-size: 35px;
          --uv-bmk-anmt-duration: 0.3s;
        }
        .uv-bmk input {
          appearance: none;
          display: none;
        }
        .uv-bmk .uv-bmk-bookmark {
          width: var(--uv-bmk-icon-size);
          height: auto;
          fill: var(--uv-bmk-secondary);
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transform-origin: top;
        }
        .uv-bmk-bookmark::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          box-shadow: 0 30px 0 -4px var(--uv-bmk-primary),
            30px 0 0 -4px var(--uv-bmk-primary),
            0 -30px 0 -4px var(--uv-bmk-primary),
            -30px 0 0 -4px var(--uv-bmk-primary),
            -22px 22px 0 -4px var(--uv-bmk-primary),
            -22px -22px 0 -4px var(--uv-bmk-primary),
            22px -22px 0 -4px var(--uv-bmk-primary),
            22px 22px 0 -4px var(--uv-bmk-primary);
          border-radius: 50%;
          transform: scale(0);
        }
        .uv-bmk-bookmark::before {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: var(--uv-bmk-circle-border);
          opacity: 0;
        }
        .uv-bmk:hover .uv-bmk-bookmark {
          fill: var(--uv-bmk-hover);
        }
        .uv-bmk input:checked + .uv-bmk-bookmark::after {
          animation: uv-bmk-circles var(--uv-bmk-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--uv-bmk-anmt-duration);
        }
        .uv-bmk input:checked + .uv-bmk-bookmark {
          fill: var(--uv-bmk-primary);
          animation: uv-bmk-bookmark var(--uv-bmk-anmt-duration) forwards;
          transition-delay: 0.3s;
        }
        .uv-bmk input:checked + .uv-bmk-bookmark::before {
          animation: uv-bmk-circle var(--uv-bmk-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--uv-bmk-anmt-duration);
        }
        @keyframes uv-bmk-bookmark {
          50% {
            transform: scaleY(0.6);
          }
          100% {
            transform: scaleY(1);
          }
        }
        @keyframes uv-bmk-circle {
          from {
            width: 0;
            height: 0;
            opacity: 0;
          }
          90% {
            width: var(--uv-bmk-circle-size);
            height: var(--uv-bmk-circle-size);
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes uv-bmk-circles {
          from {
            transform: scale(0);
          }
          40% {
            opacity: 1;
          }
          to {
            transform: scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
      <label
        className="uv-bmk"
        style={
          {
            "--uv-bmk-icon-size": `${size}px`,
            "--uv-bmk-secondary": idleColor,
            "--uv-bmk-primary": accent,
          } as CSSProperties
        }
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="uv-bmk-bookmark">
          <svg viewBox="0 0 32 32">
            <g>
              <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
            </g>
          </svg>
        </div>
      </label>
    </>
  );
};
