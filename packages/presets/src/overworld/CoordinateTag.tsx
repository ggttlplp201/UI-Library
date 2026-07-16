import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld coordinate tag — a small blocky grid-reference marker.
 * Original set for Component Style Studio, inspired by worldbuilder
 * editorial systems. MIT.
 */
export const CoordinateTag = ({
  coordinates = "R-04 · K-11",
  color = "#4a7a9a",
}: {
  /** Grid reference */
  coordinates?: string;
  /** Plate color */
  color?: string;
}) => (
  <>
    <style>{OW_FONT_IMPORT}</style>
    <span
      style={{
        display: "inline-block",
        fontFamily: OW.display,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".08em",
        background: color,
        color: OW.parchment,
        border: `3px solid ${OW.ink}`,
        padding: "3px 10px 2px",
        textShadow: `1px 1px 0 ${OW.ink}`,
        boxShadow: `3px 3px 0 0 ${OW.ink}`,
      }}
    >
      {coordinates}
    </span>
  </>
);
