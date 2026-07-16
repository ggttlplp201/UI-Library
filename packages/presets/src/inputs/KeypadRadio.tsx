import { useId, useState } from "react";

/**
 * KeypadRadio — a bank of chunky keycaps; the selected key physically
 * depresses in perspective and its legend lights up console-blue.
 * Ported from UIverse.io (orange-horse-8) by m1her.
 * Source: https://uiverse.io/m1her/orange-horse-8
 * License: MIT. Attribution: m1her via UIverse.io.
 */
export const KeypadRadio = ({
  options = "play, stop, again",
  accent = "#258ac3",
  defaultIndex = 0,
}: {
  /** Comma-separated key labels */
  options?: string;
  /** Lit legend color for the pressed key */
  accent?: string;
  /** Initially pressed key (0-based) */
  defaultIndex?: number;
}) => {
  const items = options.split(",").map((s) => s.trim()).filter(Boolean);
  const [index, setIndex] = useState(Math.min(defaultIndex, items.length - 1));
  const name = useId();
  return (
    <>
      <style>{`
        .uv-kpr-input {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: black;
          padding: 6px;
          border-radius: 8px;
          overflow: hidden;
          height: 94px;
          box-sizing: border-box;
        }
        .uv-kpr-input input { display: none; }
        .uv-kpr-label {
          width: 70px;
          height: 80px;
          background-color: #2a2a2a;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 8px 6px;
          border-top: 1px solid #383838;
          transition: all 0.1s linear;
          position: relative;
          z-index: 2;
          cursor: pointer;
          box-sizing: border-box;
        }
        .uv-kpr-back {
          position: absolute;
          top: -10px;
          left: 0px;
          background-color: #2a2a2a;
          border-radius: 4px 4px 2px 2px;
          width: 100%;
          height: 14px;
          box-shadow: inset 0 5px 3px 1px rgba(0, 0, 0, 0.5), inset 0px -5px 2px 0px rgba(56, 163, 224, 0.1);
          transform: perspective(300px) rotateX(50deg);
          z-index: 1;
          opacity: 0;
          transition: all 0.1s linear;
        }
        .uv-kpr-label.uv-kpr-on .uv-kpr-back { opacity: 1; }
        .uv-kpr-label.uv-kpr-on {
          transform: perspective(200px) rotateX(-18deg);
          transform-origin: 50% 40%;
          box-shadow: inset 0px -20px 15px 0px rgba(0, 0, 0, 0.5);
          border-top: 1px solid color-mix(in srgb, var(--uv-kpr-c) 38%, transparent);
          margin-top: 6px;
          border-radius: 0 0 4px 4px;
        }
        .uv-kpr-text {
          color: black;
          font-size: 15px;
          line-height: 12px;
          padding: 0px;
          font-weight: 800;
          text-transform: uppercase;
          transition: all 0.1s linear;
          text-shadow: -1px -1px 1px rgb(224, 224, 224, 0.1);
          font-family: system-ui, sans-serif;
        }
        .uv-kpr-label.uv-kpr-on .uv-kpr-text {
          color: var(--uv-kpr-c);
          text-shadow: 0px 0px 8px var(--uv-kpr-c), 1px 1px 2px rgb(0, 0, 0, 1);
        }
        .uv-kpr-line {
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background-color: #2a2a2a;
          box-shadow: 0 0 3px 0px rgb(19, 19, 19);
          border-top: 1px solid #383838;
          transition: all 0.1s linear;
        }
        .uv-kpr-label.uv-kpr-on .uv-kpr-line {
          background-color: #1a1a1a;
          border-top: 1px solid color-mix(in srgb, var(--uv-kpr-c) 25%, transparent);
        }
      `}</style>
      <div className="uv-kpr-input" style={{ "--uv-kpr-c": accent } as React.CSSProperties}>
        {items.map((label, i) => (
          <label key={`${label}-${i}`} className={`uv-kpr-label${i === index ? " uv-kpr-on" : ""}`}>
            <div className="uv-kpr-back" />
            <input type="radio" name={name} checked={i === index} onChange={() => setIndex(i)} />
            <span className="uv-kpr-text">{label}</span>
            <span className="uv-kpr-line" />
          </label>
        ))}
      </div>
    </>
  );
};
