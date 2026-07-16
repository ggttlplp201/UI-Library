import { MARG, MARG_FONT_IMPORT } from "./libMarg";

/**
 * Marginalia sticky note — a tilted post-it with handwritten text that
 * straightens when you hover it. Original set for Component Style Studio,
 * inspired by classroom journals. MIT.
 */
export const StickyNote = ({
  text = "don't forget:\nship the kit!",
  color = "#fff3a8",
  tilt = -3,
}: {
  /** Note text (\\n for lines) */
  text?: string;
  /** Paper color */
  color?: string;
  /** Resting tilt in degrees */
  tilt?: number;
}) => (
  <>
    <style>{`
      ${MARG_FONT_IMPORT}
      .mg-sticky { transition: transform .25s ease; }
      .mg-sticky:hover { transform: rotate(0deg) scale(1.03) !important; }
    `}</style>
    <div style={{ padding: 12, display: "inline-block" }}>
      <div
        className="mg-sticky"
        style={{
          width: 150,
          minHeight: 130,
          background: color,
          transform: `rotate(${tilt}deg)`,
          boxShadow: "0 6px 14px rgba(60,50,30,.25), 0 1px 3px rgba(60,50,30,.2)",
          padding: "26px 14px 14px",
          fontFamily: MARG.hand,
          fontWeight: 500,
          fontSize: 21,
          lineHeight: 1.25,
          color: "#4a4436",
          whiteSpace: "pre-line",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 6,
            left: "50%",
            transform: "translateX(-50%) rotate(2deg)",
            width: 52,
            height: 14,
            background: "rgba(255,255,255,.55)",
            boxShadow: "0 1px 2px rgba(60,50,30,.15)",
          }}
        />
        {text}
      </div>
    </div>
  </>
);
