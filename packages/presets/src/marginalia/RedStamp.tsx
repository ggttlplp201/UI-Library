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
}) => (
  <>
    <style>{MARG_FONT_IMPORT}</style>
    <div style={{ padding: 10, display: "inline-block" }}>
      <span
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
