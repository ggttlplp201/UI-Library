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
}) => (
  <>
    <style>{OW_FONT_IMPORT}</style>
    <div
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
        style={{
          position: "absolute",
          top: 24,
          right: 10,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: `14px solid ${OW.ink}`,
        }}
      />
      <h3 style={{ margin: 0, fontFamily: OW.display, fontWeight: 700, fontSize: 17, color: OW.ink, paddingRight: 30 }}>{region}</h3>
      <div style={{ height: 3, width: 64, background: OW.dusk2, margin: "8px 0 10px" }} />
      <p style={{ margin: 0, fontFamily: OW.body, fontSize: 13.5, lineHeight: 1.55, color: "#4c3f2c" }}>{lore}</p>
      <div style={{ marginTop: 12, fontFamily: OW.display, fontSize: 11, color: OW.ink, opacity: 0.75 }}>{coordinates}</div>
    </div>
  </>
);
