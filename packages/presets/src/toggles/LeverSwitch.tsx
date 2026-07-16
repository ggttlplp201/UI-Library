import { useState } from "react";

/**
 * LeverSwitch — a physical lever that swings 50° across a chromed base; the
 * red ball knob counter-rotates and the base lights green when engaged.
 * Ported from UIverse.io (brave-firefox-90) by njesenberger.
 * Source: https://uiverse.io/njesenberger/brave-firefox-90
 * License: MIT. Attribution: njesenberger via UIverse.io.
 */
export const LeverSwitch = ({
  defaultChecked = false,
}: {
  /** Initial on/off state */
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <>
      <style>{`
        .uv-lvs-host { padding: 5.5em 2em 0.75em; display: inline-block; }
        .uv-lvs-container {
          --knob-size: 1.75em;
          display: flex;
          justify-content: center;
          position: relative;
        }
        .uv-lvs-input {
          position: absolute;
          z-index: 2;
          bottom: 132.5%;
          border-radius: 50%;
          transform: rotate(-25deg);
          transform-origin: 50% 4.75em;
          width: var(--knob-size);
          height: var(--knob-size);
          opacity: 0;
          font: inherit;
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
          cursor: pointer;
        }
        .uv-lvs-input:checked { transform: rotate(25deg); }
        .uv-lvs-handle-wrapper {
          position: absolute;
          z-index: 1;
          bottom: -135%;
          -webkit-mask-image: linear-gradient(to bottom, #000 62.125%, transparent 50%);
          mask-image: linear-gradient(to bottom, #000 62.125%, transparent 50%);
          width: 200%;
          overflow: hidden;
        }
        .uv-lvs-handle {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: rotate(-25deg);
          transform-origin: bottom center;
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
        }
        .uv-lvs-input:checked + .uv-lvs-handle-wrapper > .uv-lvs-handle { transform: rotate(25deg); }
        .uv-lvs-knob {
          position: relative;
          z-index: 1;
          border-radius: 50%;
          width: var(--knob-size);
          height: var(--knob-size);
          background-image: radial-gradient(farthest-corner at 70% 30%, #fedee2 4%, #d63534 12% 24%, #a81a1a 50% 65%, #d63534 75%);
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
        }
        .uv-lvs-input:checked + .uv-lvs-handle-wrapper .uv-lvs-knob { transform: rotate(-90deg); }
        .uv-lvs-knob::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 8px 2px rgb(255 255 255 / .4);
          opacity: 0;
          transition: opacity .2s;
        }
        @media (hover: hover) {
          .uv-lvs-input:hover + .uv-lvs-handle-wrapper .uv-lvs-knob::after,
          .uv-lvs-input:focus-visible + .uv-lvs-handle-wrapper .uv-lvs-knob::after { opacity: 1; }
        }
        .uv-lvs-bar-wrapper { position: relative; width: .5em; height: 3em; }
        .uv-lvs-bar {
          position: absolute;
          top: calc(var(--knob-size) / 2 * -1);
          left: 0;
          width: 100%;
          height: calc(100% + var(--knob-size) / 2);
          background-image: linear-gradient(to right, #777475, #a4a4a4, #fff 45% 55%, #a4a4a4, #777475);
          background-position-x: .06125em;
          transition: background-position-x .24s cubic-bezier(.65, 1.35, .5, 1);
          box-shadow: inset 0 1em .25em rgb(0 0 0 / .4);
        }
        .uv-lvs-input:checked + .uv-lvs-handle-wrapper .uv-lvs-bar { background-position-x: -.06125em; }
        .uv-lvs-base {
          position: relative;
          border-radius: 3.125em;
          padding: .25em;
          width: 3.5em;
          height: 1.125em;
          background-color: #fff;
          background-image: linear-gradient(to bottom, #fff, #d7d7d7);
          box-shadow: 0 -.25em .5em #fff, 0 .25em .5em #d7d7d7;
          box-sizing: content-box;
        }
        .uv-lvs-base-inside {
          position: relative;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(to bottom, #a6a6a6, #7d7d7d);
          box-shadow: inset 0 .0625em rgb(255 255 255 / .2), inset 0 -.03125em rgb(255 255 255 / 1), inset 0 -.0625em .25em rgb(0 0 0 / .1);
        }
        .uv-lvs-base-inside::after {
          content: '';
          position: absolute;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(to bottom, #5ab054, #438c3c);
          box-shadow: inherit;
          opacity: 0;
          transition: opacity .24s cubic-bezier(.65, 1.35, .5, 1);
        }
        .uv-lvs-input:checked ~ .uv-lvs-base .uv-lvs-base-inside::after { opacity: 1; }
      `}</style>
      {/* The lever swings well above the base — the host pads room for it. */}
      <div className="uv-lvs-host">
        <div className="uv-lvs-container">
          <input
            className="uv-lvs-input"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <div className="uv-lvs-handle-wrapper">
            <div className="uv-lvs-handle">
              <div className="uv-lvs-knob" />
              <div className="uv-lvs-bar-wrapper">
                <div className="uv-lvs-bar" />
              </div>
            </div>
          </div>
          <div className="uv-lvs-base">
            <div className="uv-lvs-base-inside" />
          </div>
        </div>
      </div>
    </>
  );
};
