import { useState } from "react";

/**
 * BigRedSwitch — a chunky 3D industrial rocker: the whole red plate tips in
 * perspective, the lamp flickers on, and the shine/shadow layers sell the
 * plastic. Ported from UIverse.io (empty-snail-69) by Nawsome.
 * Source: https://uiverse.io/Nawsome/empty-snail-69
 * License: MIT. Attribution: Nawsome via UIverse.io.
 */
export const BigRedSwitch = ({
  defaultChecked = true,
}: {
  /** Initial on/off state */
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <>
      <style>{`
        .uv-brs-switch {
          display: block;
          background-color: black;
          width: 150px;
          height: 195px;
          box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0 1px 2px black, inset 0 2px 2px -2px white, inset 0 0 2px 15px #47434c, inset 0 0 2px 22px black;
          border-radius: 5px;
          padding: 20px;
          perspective: 700px;
          box-sizing: content-box;
        }
        .uv-brs-switch input { display: none; }
        .uv-brs-switch input:checked + .uv-brs-button {
          transform: translateZ(20px) rotateX(25deg);
          box-shadow: 0 -10px 20px #ff1818;
        }
        .uv-brs-switch input:checked + .uv-brs-button .uv-brs-light { animation: uv-brs-flicker 0.2s infinite 0.3s; }
        .uv-brs-switch input:checked + .uv-brs-button .uv-brs-shine { opacity: 1; }
        .uv-brs-switch input:checked + .uv-brs-button .uv-brs-shadow { opacity: 0; }
        .uv-brs-switch .uv-brs-button {
          display: block;
          transition: all 0.3s cubic-bezier(1, 0, 1, 1);
          transform-origin: center center -20px;
          transform: translateZ(20px) rotateX(-25deg);
          transform-style: preserve-3d;
          height: 100%;
          position: relative;
          cursor: pointer;
          background: linear-gradient(#980000 0%, #6f0000 30%, #6f0000 70%, #980000 100%);
          background-repeat: no-repeat;
        }
        .uv-brs-switch .uv-brs-button::before {
          content: "";
          background: linear-gradient(rgba(255, 255, 255, 0.8) 10%, rgba(255, 255, 255, 0.3) 30%, #650000 75%, #320000) 50% 50%/97% 97%, #b10000;
          background-repeat: no-repeat;
          width: 100%;
          height: 50px;
          transform-origin: top;
          transform: rotateX(-90deg);
          position: absolute;
          top: 0;
        }
        .uv-brs-switch .uv-brs-button::after {
          content: "";
          background-image: linear-gradient(#650000, #320000);
          width: 100%;
          height: 50px;
          transform-origin: top;
          transform: translateY(50px) rotateX(-90deg);
          position: absolute;
          bottom: 0;
          box-shadow: 0 50px 8px 0px black, 0 80px 20px 0px rgba(0, 0, 0, 0.5);
        }
        .uv-brs-light {
          opacity: 0;
          animation: uv-brs-light-off 1s;
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(#ffc97e, #ff1818 40%, transparent 70%);
        }
        .uv-brs-dots {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(transparent 30%, rgba(101, 0, 0, 0.7) 70%);
          background-size: 10px 10px;
        }
        .uv-brs-characters {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(white, white) 50% 20%/5% 20%, radial-gradient(circle, transparent 50%, white 52%, white 70%, transparent 72%) 50% 80%/33% 25%;
          background-repeat: no-repeat;
        }
        .uv-brs-shine {
          transition: all 0.3s cubic-bezier(1, 0, 1, 1);
          opacity: 0.3;
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(white, transparent 3%) 50% 50%/97% 97%, linear-gradient(rgba(255, 255, 255, 0.5), transparent 50%, transparent 80%, rgba(255, 255, 255, 0.5)) 50% 50%/97% 97%;
          background-repeat: no-repeat;
        }
        .uv-brs-shadow {
          transition: all 0.3s cubic-bezier(1, 0, 1, 1);
          opacity: 1;
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(transparent 70%, rgba(0, 0, 0, 0.8));
          background-repeat: no-repeat;
        }
        @keyframes uv-brs-flicker { 0% { opacity: 1; } 80% { opacity: 0.8; } 100% { opacity: 1; } }
        @keyframes uv-brs-light-off { 0% { opacity: 1; } 80% { opacity: 0; } }
      `}</style>
      <label className="uv-brs-switch">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <div className="uv-brs-button">
          <div className="uv-brs-light" />
          <div className="uv-brs-dots" />
          <div className="uv-brs-characters" />
          <div className="uv-brs-shine" />
          <div className="uv-brs-shadow" />
        </div>
      </label>
    </>
  );
};
