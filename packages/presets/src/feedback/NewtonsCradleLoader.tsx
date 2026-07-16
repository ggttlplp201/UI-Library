/**
 * NewtonsCradleLoader — four dots swing like a Newton's cradle, the outer
 * dots alternately kicking out and returning.
 * Ported from UIverse.io (jolly-kangaroo-36) by dovatgabriel.
 * Source: https://uiverse.io/dovatgabriel/jolly-kangaroo-36
 * License: MIT. Attribution: dovatgabriel via UIverse.io.
 */
export const NewtonsCradleLoader = ({
  size = 50,
  speed = 1.2,
  color = "#474554",
}: {
  /** Overall size in px */
  size?: number;
  /** Swing period in seconds */
  speed?: number;
  /** Dot color */
  color?: string;
}) => (
  <>
    <style>{`
      .uv-ncl {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--uv-ncl-size);
        height: var(--uv-ncl-size);
      }
      .uv-ncl-dot {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: 25%;
        transform-origin: center top;
      }
      .uv-ncl-dot::after {
        content: '';
        display: block;
        width: 100%;
        height: 25%;
        border-radius: 50%;
        background-color: var(--uv-ncl-color);
      }
      .uv-ncl-dot:first-child {
        animation: uv-ncl-swing var(--uv-ncl-speed) linear infinite;
      }
      .uv-ncl-dot:last-child {
        animation: uv-ncl-swing2 var(--uv-ncl-speed) linear infinite;
      }
      @keyframes uv-ncl-swing {
        0% {
          transform: rotate(0deg);
          animation-timing-function: ease-out;
        }
        25% {
          transform: rotate(70deg);
          animation-timing-function: ease-in;
        }
        50% {
          transform: rotate(0deg);
          animation-timing-function: linear;
        }
      }
      @keyframes uv-ncl-swing2 {
        0% {
          transform: rotate(0deg);
          animation-timing-function: linear;
        }
        50% {
          transform: rotate(0deg);
          animation-timing-function: ease-out;
        }
        75% {
          transform: rotate(-70deg);
          animation-timing-function: ease-in;
        }
      }
    `}</style>
    <div
      className="uv-ncl"
      style={{
        ["--uv-ncl-size" as string]: `${size}px`,
        ["--uv-ncl-speed" as string]: `${speed}s`,
        ["--uv-ncl-color" as string]: color,
      }}
    >
      <div className="uv-ncl-dot"></div>
      <div className="uv-ncl-dot"></div>
      <div className="uv-ncl-dot"></div>
      <div className="uv-ncl-dot"></div>
    </div>
  </>
);
