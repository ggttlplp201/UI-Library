import { useState } from "react";

/**
 * SegmentedToggleGroup — joined tactile segments that press in and turn
 * green when active; each segment toggles independently.
 * Ported from UIverse.io (wicked-deer-90) by WhiteNervosa.
 * Source: https://uiverse.io/WhiteNervosa/wicked-deer-90
 * License: MIT. Attribution: WhiteNervosa via UIverse.io.
 */
export const SegmentedToggleGroup = ({
  options = "Option, Option, Option",
  activeColor = "#2d6737",
}: {
  /** Comma-separated segment labels */
  options?: string;
  /** Pressed-in segment color */
  activeColor?: string;
}) => {
  const items = options.split(",").map((s) => s.trim()).filter(Boolean);
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
  return (
    <>
      <style>{`
        .uv-stg-holder { margin: 5px; display: flex; }
        .uv-stg-box {
          width: fit-content;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          padding: 2px 8px;
          background-color: rgba(0, 0, 0, 0.16);
          border-radius: 0px;
          color: rgba(255, 255, 255, 0.7);
          transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
          transition-duration: 300ms;
          transition-property: color, background-color, box-shadow;
          display: flex;
          height: 32px;
          align-items: center;
          box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px 1px 1px 0px;
          outline: none;
          justify-content: center;
          min-width: 55px;
          box-sizing: border-box;
        }
        .uv-stg-box:hover {
          background-color: #2c2c2c;
          color: white;
          box-shadow: rgba(0, 0, 0, 0.23) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.17) 0px 2px 4px 1px;
        }
        .uv-stg-inner {
          font-size: 18px;
          font-weight: 900;
          pointer-events: none;
          transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
          transform: translateY(0px);
          font-family: system-ui, sans-serif;
        }
        .uv-stg-box:hover .uv-stg-inner { transform: translateY(-2px); }
        .uv-stg-wrap:first-of-type .uv-stg-box { border-bottom-left-radius: 5px; border-top-left-radius: 5px; border-right: 0px; }
        .uv-stg-wrap:last-of-type .uv-stg-box { border-bottom-right-radius: 5px; border-top-right-radius: 5px; border-left: 0px; }
        .uv-stg-box.uv-stg-on {
          background-color: var(--uv-stg-c);
          color: white;
          box-shadow: rgba(0, 0, 0, 0.23) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.17) 0px 2px 4px 1px;
        }
        .uv-stg-box.uv-stg-on .uv-stg-inner { transform: translateY(-2px); }
        .uv-stg-box.uv-stg-on:hover { background-color: color-mix(in srgb, var(--uv-stg-c) 92%, white); }
      `}</style>
      <div className="uv-stg-holder" style={{ "--uv-stg-c": activeColor } as React.CSSProperties}>
        {items.map((label, i) => (
          <label key={`${label}-${i}`} className="uv-stg-wrap">
            <div
              role="checkbox"
              aria-checked={on[i]}
              tabIndex={0}
              className={`uv-stg-box${on[i] ? " uv-stg-on" : ""}`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle(i)}
            >
              <div className="uv-stg-inner">{label}</div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
