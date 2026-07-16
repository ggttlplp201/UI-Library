/**
 * BouncingBallsLoader — three balls squash and bounce in sequence over soft
 * blurred floor shadows.
 * Ported from UIverse.io (grumpy-turtle-41) by mobinkakei.
 * Source: https://uiverse.io/mobinkakei/grumpy-turtle-41
 * License: MIT. Attribution: mobinkakei via UIverse.io.
 */
export const BouncingBallsLoader = ({
  color = "#fff",
  speed = 0.5,
}: {
  /** Ball color */
  color?: string;
  /** Bounce duration in seconds */
  speed?: number;
}) => (
  <>
    <style>{`
      .uv-bbl-wrapper {
        width: 200px;
        height: 60px;
        position: relative;
        z-index: 1;
      }
      .uv-bbl-circle {
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 50%;
        background-color: var(--uv-bbl-color);
        left: 15%;
        transform-origin: 50%;
        animation: uv-bbl-circle var(--uv-bbl-speed) alternate infinite ease;
      }
      @keyframes uv-bbl-circle {
        0% {
          top: 60px;
          height: 5px;
          border-radius: 50px 50px 25px 25px;
          transform: scaleX(1.7);
        }
        40% {
          height: 20px;
          border-radius: 50%;
          transform: scaleX(1);
        }
        100% {
          top: 0%;
        }
      }
      .uv-bbl-circle:nth-child(2) {
        left: 45%;
        animation-delay: var(--uv-bbl-delay-2);
      }
      .uv-bbl-circle:nth-child(3) {
        left: auto;
        right: 15%;
        animation-delay: var(--uv-bbl-delay-3);
      }
      .uv-bbl-shadow {
        width: 20px;
        height: 4px;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.9);
        position: absolute;
        top: 62px;
        transform-origin: 50%;
        z-index: -1;
        left: 15%;
        filter: blur(1px);
        animation: uv-bbl-shadow var(--uv-bbl-speed) alternate infinite ease;
      }
      @keyframes uv-bbl-shadow {
        0% {
          transform: scaleX(1.5);
        }
        40% {
          transform: scaleX(1);
          opacity: .7;
        }
        100% {
          transform: scaleX(.2);
          opacity: .4;
        }
      }
      .uv-bbl-shadow:nth-child(4) {
        left: 45%;
        animation-delay: var(--uv-bbl-delay-2);
      }
      .uv-bbl-shadow:nth-child(5) {
        left: auto;
        right: 15%;
        animation-delay: var(--uv-bbl-delay-3);
      }
    `}</style>
    <div
      className="uv-bbl-wrapper"
      style={{
        ["--uv-bbl-color" as string]: color,
        ["--uv-bbl-speed" as string]: `${speed}s`,
        ["--uv-bbl-delay-2" as string]: `${speed * 0.4}s`,
        ["--uv-bbl-delay-3" as string]: `${speed * 0.6}s`,
      }}
    >
      <div className="uv-bbl-circle"></div>
      <div className="uv-bbl-circle"></div>
      <div className="uv-bbl-circle"></div>
      <div className="uv-bbl-shadow"></div>
      <div className="uv-bbl-shadow"></div>
      <div className="uv-bbl-shadow"></div>
    </div>
  </>
);
