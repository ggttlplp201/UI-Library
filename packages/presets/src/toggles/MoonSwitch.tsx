import { useState } from "react";

/**
 * MoonSwitch — a night-sky toggle where the knob is a crescent moon that
 * waxes to full as it slides across. Ported from UIverse.io
 * (splendid-liger-23) by alexruix.
 * Source: https://uiverse.io/alexruix/splendid-liger-23
 * License: MIT. Attribution: alexruix via UIverse.io.
 */
export const MoonSwitch = ({
  defaultChecked = false,
  background = "#28096b",
  checkedBackground = "#522ba7",
  moonColor = "#fff000",
}: {
  /** Initial on/off state */
  defaultChecked?: boolean;
  /** Track color when off */
  background?: string;
  /** Track color when on */
  checkedBackground?: string;
  /** Moon color */
  moonColor?: string;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <>
      <style>{`
        .uv-msw-switch {
          font-size: 17px;
          position: relative;
          display: inline-block;
          width: 3.5em;
          height: 2em;
        }
        .uv-msw-switch input { opacity: 0; width: 0; height: 0; }
        .uv-msw-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: var(--uv-msw-bg);
          transition: .5s;
          border-radius: 30px;
        }
        .uv-msw-slider:before {
          position: absolute;
          content: "";
          height: 1.4em;
          width: 1.4em;
          border-radius: 50%;
          left: 10%;
          bottom: 15%;
          box-shadow: inset 8px -4px 0px 0px var(--uv-msw-moon);
          background: var(--uv-msw-bg);
          transition: .5s;
        }
        .uv-msw-switch input:checked + .uv-msw-slider { background-color: var(--uv-msw-bg-on); }
        .uv-msw-switch input:checked + .uv-msw-slider:before {
          transform: translateX(100%);
          box-shadow: inset 15px -4px 0px 15px var(--uv-msw-moon);
        }
      `}</style>
      <label
        className="uv-msw-switch"
        style={
          {
            "--uv-msw-bg": background,
            "--uv-msw-bg-on": checkedBackground,
            "--uv-msw-moon": moonColor,
          } as React.CSSProperties
        }
      >
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span className="uv-msw-slider" />
      </label>
    </>
  );
};
