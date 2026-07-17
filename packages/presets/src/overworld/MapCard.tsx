import { useId } from "react";
import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld map card — a parchment region card with a compass corner, name
 * plate, and lore line. Original set for Component Style Studio, inspired by
 * worldbuilder editorial systems. MIT.
 */
export const MapCard = ({
  region = "THE AMBER MARSH",
  lore = "Low fog, older gods. Travelers report the reeds hum at dusk — bring a lantern and a spare map.",
  coordinates = "R-04 · K-11",
  width = 300,
}: {
  /** Region name */
  region?: string;
  /** Lore copy */
  lore?: string;
  /** Coordinate tag */
  coordinates?: string;
  /** Card width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `owmc${uid}`;
  return (
  <>
    <style>{`${OW_FONT_IMPORT}
      .${cls} { transition: transform .18s steps(3), box-shadow .18s steps(3); }
      .${cls}:hover { transform: translate(-2px, -3px); box-shadow: 6px 7px 0 0 ${OW.ink}; }
      .${cls}:hover .${cls}-needle { animation: ${cls}-wiggle .5s steps(4); }
      @keyframes ${cls}-wiggle { 0% { transform: rotate(0); } 30% { transform: rotate(-24deg); } 65% { transform: rotate(14deg); } 100% { transform: rotate(0); } }
      @keyframes ${cls}-ping { 0% { box-shadow: 0 0 0 0 ${OW.ink}66; } 100% { box-shadow: 0 0 0 9px transparent; } }
    `}</style>
    <div
      className={cls}
      style={{
        width,
        border: `4px solid ${OW.ink}`,
        background: `radial-gradient(140% 120% at 20% 0%, ${OW.parchment}, ${OW.parchmentDeep})`,
        position: "relative",
        boxSizing: "border-box",
        padding: "16px 16px 14px",
      }}
    >
      {/* compass */}
      <span style={{ position: "absolute", top: 10, right: 12, fontFamily: OW.display, fontSize: 11, color: OW.ink }}>N</span>
      <span
        className={`${cls}-needle`}
        style={{
          position: "absolute",
          top: 24,
          right: 10,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: `14px solid ${OW.ink}`,
          transformOrigin: "50% 100%",
        }}
      />
      {/* you-are-here ping */}
      <span style={{ position: "absolute", left: "62%", top: "56%", width: 8, height: 8, borderRadius: "50%", background: OW.dusk2, border: `2px solid ${OW.ink}`, animation: `${cls}-ping 1.8s ease-out infinite` }} />
      <h3 style={{ margin: 0, fontFamily: OW.display, fontWeight: 700, fontSize: 17, color: OW.ink, paddingRight: 30 }}>{region}</h3>
      <div style={{ height: 3, width: 64, background: OW.dusk2, margin: "8px 0 10px" }} />
      <p style={{ margin: 0, fontFamily: OW.body, fontSize: 13.5, lineHeight: 1.55, color: "#4c3f2c" }}>{lore}</p>
      <div style={{ marginTop: 12, fontFamily: OW.display, fontSize: 11, color: OW.ink, opacity: 0.75 }}>{coordinates}</div>
    </div>
  </>
  );
};
