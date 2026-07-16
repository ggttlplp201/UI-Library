/**
 * GlossySwitch — glossy white pill switch with a metallic knob; the whole
 * pill tilts in perspective on hover and the knob slides across on toggle.
 * Ported from UIverse.io (bright-dolphin-91) by Yaya12085.
 * Source: https://uiverse.io/Yaya12085/bright-dolphin-91
 * License: MIT. Attribution: Yaya12085 via UIverse.io.
 */
import { useId, useState, type CSSProperties } from "react";

export const GlossySwitch = ({
  defaultChecked = false,
  accent = "#000000",
}: {
  /** Initial on/off state */
  defaultChecked?: boolean;
  /** Knob color when switched on */
  accent?: string;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const id = useId();
  return (
    <>
      <style>{`
        .uv-gsw-container input {
          display: none;
        }
        .uv-gsw-label {
          height: 60px;
          width: 120px;
          background-color: #ffffff;
          border-radius: 30px;
          box-shadow: inset 0 0 5px 4px rgba(255, 255, 255, 1),
            inset 0 0 20px 1px rgba(0, 0, 0, 0.488), 10px 20px 30px rgba(0, 0, 0, 0.096),
            inset 0 0 0 3px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          transition: transform 0.4s;
        }
        .uv-gsw-label:hover {
          transform: perspective(100px) rotateX(5deg) rotateY(-5deg);
        }
        .uv-gsw-container input:checked ~ .uv-gsw-label:hover {
          transform: perspective(100px) rotateX(-5deg) rotateY(5deg);
        }
        .uv-gsw-container input:checked ~ .uv-gsw-label::before {
          left: 70px;
          background-color: var(--uv-gsw-accent);
          background-image: linear-gradient(315deg, var(--uv-gsw-accent) 0%, #414141 70%);
          transition: 0.4s;
        }
        .uv-gsw-label::before {
          position: absolute;
          content: "";
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background-color: #000000;
          background-image: linear-gradient(
            130deg,
            #757272 10%,
            #ffffff 11%,
            #726f6f 62%
          );
          left: 10px;
          box-shadow: 0 2px 1px rgba(0, 0, 0, 0.3), 10px 10px 10px rgba(0, 0, 0, 0.3);
          transition: 0.4s;
        }
      `}</style>
      <div
        className="uv-gsw-container"
        style={{ "--uv-gsw-accent": accent } as CSSProperties}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor={id} className="uv-gsw-label" aria-label="Toggle"> </label>
      </div>
    </>
  );
};
