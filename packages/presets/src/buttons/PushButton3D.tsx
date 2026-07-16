/**
 * PushButton3D — layered shadow/edge/front button that physically depresses
 * on hover and click, like a mechanical key.
 * Ported from UIverse.io (pink-lizard-56) by zymantas-katinas.
 * Source: https://uiverse.io/zymantas-katinas/pink-lizard-56
 * License: MIT. Attribution: zymantas-katinas via UIverse.io.
 */
import type { CSSProperties } from "react";

export const PushButton3D = ({
  label = "Click me",
  hue = 217,
  fontSize = 20,
}: {
  /** Button text */
  label?: string;
  /** Base hue (0-360) of the button body */
  hue?: number;
  /** Font size in px */
  fontSize?: number;
}) => (
  <>
    <style>{`
      .uv-push3d {
        position: relative;
        border: none;
        background: transparent;
        padding: 0;
        outline: none;
        cursor: pointer;
        font-family: sans-serif;
      }
      .uv-push3d .uv-push3d-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        transform: translateY(2px);
        transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
      }
      .uv-push3d .uv-push3d-edge {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background: linear-gradient(
          to left,
          hsl(var(--uv-push3d-hue), 33%, 16%) 0%,
          hsl(var(--uv-push3d-hue), 33%, 32%) 8%,
          hsl(var(--uv-push3d-hue), 33%, 32%) 92%,
          hsl(var(--uv-push3d-hue), 33%, 16%) 100%
        );
      }
      .uv-push3d .uv-push3d-front {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 28px;
        font-size: var(--uv-push3d-font-size);
        color: white;
        background: hsl(var(--uv-push3d-hue), 33%, 17%);
        border-radius: 8px;
        transform: translateY(-4px);
        transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
      }
      .uv-push3d:hover .uv-push3d-shadow {
        transform: translateY(4px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }
      .uv-push3d:hover .uv-push3d-front {
        transform: translateY(-6px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }
      .uv-push3d:active .uv-push3d-shadow {
        transform: translateY(1px);
        transition: transform 34ms;
      }
      .uv-push3d:active .uv-push3d-front {
        transform: translateY(-2px);
        transition: transform 34ms;
      }
      .uv-push3d .uv-push3d-front span {
        user-select: none;
      }
    `}</style>
    <button
      type="button"
      className="uv-push3d"
      style={
        {
          "--uv-push3d-hue": hue,
          "--uv-push3d-font-size": `${fontSize}px`,
        } as CSSProperties
      }
    >
      <span className="uv-push3d-shadow"></span>
      <span className="uv-push3d-edge"></span>
      <div className="uv-push3d-front">
        <span>{label}</span>
      </div>
    </button>
  </>
);
