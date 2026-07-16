import { useId, useState } from "react";

/**
 * GliderRadio — a vertical option rail: a glowing marker glides along a
 * hairline to the selected row with a springy overshoot.
 * Ported from UIverse.io (quick-panther-98) by Smit-Prajapati.
 * Source: https://uiverse.io/Smit-Prajapati/quick-panther-98
 * License: MIT. Attribution: Smit-Prajapati via UIverse.io.
 */
export const GliderRadio = ({
  options = "Free, Basic, Premium",
  accent = "#f7e479",
  defaultIndex = 0,
}: {
  /** Comma-separated option labels */
  options?: string;
  /** Glider + selected-label color */
  accent?: string;
  /** Initially selected option (0-based) */
  defaultIndex?: number;
}) => {
  const items = options.split(",").map((s) => s.trim()).filter(Boolean);
  const [index, setIndex] = useState(Math.min(defaultIndex, items.length - 1));
  const name = useId();
  return (
    <>
      <style>{`
        .uv-glr-container {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 0.5rem;
        }
        .uv-glr-container .uv-glr-glider-track {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(27,27,27,1) 50%, rgba(0,0,0,0) 100%);
          width: 1px;
        }
        .uv-glr-glider {
          position: relative;
          width: 100%;
          background: linear-gradient(0deg, rgba(0,0,0,0) 0%, var(--uv-glr-c) 50%, rgba(0,0,0,0) 100%);
          transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56);
        }
        .uv-glr-glider::before {
          content: "";
          position: absolute;
          height: 60%;
          width: 300%;
          top: 50%;
          transform: translateY(-50%);
          background: var(--uv-glr-c);
          filter: blur(10px);
        }
        .uv-glr-glider::after {
          content: "";
          position: absolute;
          left: 0;
          height: 100%;
          width: 150px;
          background: linear-gradient(90deg, var(--uv-glr-c-soft) 0%, rgba(0,0,0,0) 100%);
        }
        .uv-glr-label {
          cursor: pointer;
          padding: 1rem;
          position: relative;
          color: grey;
          transition: all 0.3s ease-in-out;
          font-family: system-ui, sans-serif;
          font-size: 14px;
        }
        .uv-glr-label.uv-glr-active { color: var(--uv-glr-c); }
      `}</style>
      <div
        className="uv-glr-container"
        style={{ "--uv-glr-c": accent, "--uv-glr-c-soft": `${accent}1c` } as React.CSSProperties}
      >
        {items.map((label, i) => (
          <label key={`${label}-${i}`} className={`uv-glr-label${i === index ? " uv-glr-active" : ""}`}>
            <input
              type="radio"
              name={name}
              checked={i === index}
              onChange={() => setIndex(i)}
              style={{ appearance: "none", position: "absolute", inset: 0, cursor: "pointer", margin: 0 }}
            />
            {label}
          </label>
        ))}
        <div className="uv-glr-glider-track">
          <div
            className="uv-glr-glider"
            style={{ height: `${100 / Math.max(items.length, 1)}%`, transform: `translateY(${index * 100}%)` }}
          />
        </div>
      </div>
    </>
  );
};
