import { useId, useState } from "react";
import { MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia red stamp — the teacher's rubber stamp: double ring, tilted,
 * slightly worn. Original set for Component Style Studio, inspired by
 * classroom journals. MIT.
 */
export const RedStamp = ({
  text = "GRADED",
  color = "#d94f43",
  tilt = -8,
}: {
  /** Stamp text */
  text?: string;
  /** Stamp ink */
  color?: string;
  /** Tilt in degrees */
  tilt?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mgst${uid}`;
  const [stamp, setStamp] = useState(0);
  return (
  <>
    <style>{`${MARG_FONT_IMPORT}
      @keyframes ${cls}-slam {
        0% { transform: rotate(${tilt}deg) scale(2.2); opacity: 0; }
        55% { transform: rotate(${tilt}deg) scale(.92); opacity: 1; }
        100% { transform: rotate(${tilt}deg) scale(1); opacity: .85; }
      }
      .${cls} { animation: ${cls}-slam .45s cubic-bezier(.2,.9,.3,1.4) both; cursor: pointer; }
    `}</style>
    <div style={{ padding: 10, display: "inline-block" }} title="Click to re-stamp">
      <span
        key={stamp}
        className={cls}
        onClick={() => setStamp((n) => n + 1)}
        style={{
          display: "inline-block",
          padding: "6px 18px",
          border: `3px double ${color}`,
          borderRadius: 6,
          transform: `rotate(${tilt}deg)`,
          fontFamily: "'Arial Black', 'Arial', sans-serif",
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: ".14em",
          color,
          opacity: 0.85,
          maskImage: "radial-gradient(120% 100% at 30% 40%, #000 60%, rgba(0,0,0,.55) 100%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 30% 40%, #000 60%, rgba(0,0,0,.55) 100%)",
        }}
      >
        {text}
      </span>
    </div>
  </>
  );
};
