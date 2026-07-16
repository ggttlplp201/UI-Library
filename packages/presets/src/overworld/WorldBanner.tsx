import { OW, OW_FONT_IMPORT } from "./libWorld";

/**
 * Overworld banner — a 16-bit dusk landscape strip with oversized blocky
 * display type punching through, pixel sun included. Original set for
 * Component Style Studio, inspired by worldbuilder editorial systems. MIT.
 */
export const WorldBanner = ({
  title = "OVERWORLD",
  subtitle = "chapter one",
  width = 560,
  height = 170,
}: {
  /** Banner title */
  title?: string;
  /** Small line under the title */
  subtitle?: string;
  /** Banner width in px */
  width?: number;
  /** Banner height in px */
  height?: number;
}) => (
  <>
    <style>{OW_FONT_IMPORT}</style>
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        border: `4px solid ${OW.ink}`,
        boxSizing: "border-box",
        background: `linear-gradient(180deg, ${OW.dusk1} 0 34%, ${OW.dusk2} 34% 58%, ${OW.dusk3} 58% 74%, ${OW.grass} 74% 90%, ${OW.water} 90% 100%)`,
      }}
    >
      {/* pixel sun */}
      <span style={{ position: "absolute", top: "14%", right: "12%", width: 26, height: 26, background: "#ffdf8a", boxShadow: `0 0 0 4px rgba(255,223,138,.35)` }} />
      {/* stepped mountain */}
      <span style={{ position: "absolute", left: "8%", top: "34%", width: 60, height: 16, background: OW.dusk2, boxShadow: `20px -14px 0 0 ${OW.dusk2}, 40px -28px 0 0 ${OW.dusk2}` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: OW.display,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: ".04em",
            color: OW.parchment,
            textShadow: `4px 4px 0 ${OW.ink}`,
          }}
        >
          {title}
        </h2>
        <span style={{ fontFamily: OW.display, fontSize: 13, color: OW.parchment, textShadow: `2px 2px 0 ${OW.ink}`, marginTop: 4 }}>
          {subtitle}
        </span>
      </div>
    </div>
  </>
);
