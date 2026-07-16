import { useState } from "react";
import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase pop button — an accent slab that slams onto its own offset shadow
 * when pressed. Original set for Component Style Studio, inspired by
 * studio-editorial bento systems. MIT.
 */
export const PopButton = ({
  label = "SEE THE WORK",
  color = "#f91814",
  textColor = "#ffffff",
}: {
  /** Button label */
  label?: string;
  /** Slab color */
  color?: string;
  /** Label color */
  textColor?: string;
}) => {
  const [down, setDown] = useState(false);
  return (
    <>
      <style>{BOLD_FONT_IMPORT}</style>
      <div style={{ padding: 8, display: "inline-block" }}>
        <button
          type="button"
          data-link-slot="button"
          onPointerDown={() => setDown(true)}
          onPointerUp={() => setDown(false)}
          onPointerLeave={() => setDown(false)}
          style={{
            fontFamily: BOLD.display,
            fontSize: 16,
            letterSpacing: ".02em",
            textTransform: "uppercase",
            padding: "13px 26px 12px",
            background: color,
            color: textColor,
            border: `2px solid ${BOLD.ink}`,
            borderRadius: 2,
            cursor: "pointer",
            transform: down ? "translate(5px, 5px)" : "none",
            boxShadow: down ? "0 0 0 0 " + BOLD.ink : `5px 5px 0 0 ${BOLD.ink}`,
            transition: "transform .1s ease, box-shadow .1s ease",
          }}
        >
          {label}
        </button>
      </div>
    </>
  );
};
