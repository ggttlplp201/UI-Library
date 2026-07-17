import { useId } from "react";
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
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `owbn${uid}`;
  return (
  <>
    <style>{`${OW_FONT_IMPORT}
      @keyframes ${cls}-cloud { from { transform: translateX(-80px); } to { transform: translateX(${width + 80}px); } }
      @keyframes ${cls}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes ${cls}-shimmer { from { background-position: 0 0; } to { background-position: 56px 0; } }
    `}</style>
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
      {/* pixel sun bobs */}
      <span style={{ position: "absolute", top: "14%", right: "12%", width: 26, height: 26, background: "#ffdf8a", boxShadow: `0 0 0 4px rgba(255,223,138,.35)`, animation: `${cls}-bob 3.4s steps(2) infinite` }} />
      {/* drifting pixel clouds */}
      <span style={{ position: "absolute", top: "12%", left: -60, width: 40, height: 10, background: "rgba(255,255,255,.75)", boxShadow: "12px -8px 0 0 rgba(255,255,255,.75), 26px 0 0 0 rgba(255,255,255,.6)", animation: `${cls}-cloud 16s linear infinite` }} />
      <span style={{ position: "absolute", top: "26%", left: -60, width: 30, height: 8, background: "rgba(255,255,255,.5)", boxShadow: "10px -6px 0 0 rgba(255,255,255,.5)", animation: `${cls}-cloud 24s linear 4s infinite` }} />
      {/* water shimmer */}
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "10%", backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.28) 0 10px, transparent 10px 28px)", animation: `${cls}-shimmer 2.4s steps(6) infinite` }} />
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
};
