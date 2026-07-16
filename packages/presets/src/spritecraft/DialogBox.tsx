import { useEffect, useState } from "react";
import { SPR, SPR_FONT_IMPORT, pixelBorder } from "./libSprite";

/**
 * Spritecraft dialog box — the NPC text box: speaker plate, typewriter text,
 * blinking continue arrow. Original set for Component Style Studio, inspired
 * by 8-bit game HUDs. MIT.
 */
export const DialogBox = ({
  speaker = "VILLAGER",
  text = "Welcome, traveler! The library lies east of here. Take these components with you.",
  width = 380,
  typeSpeed = 35,
}: {
  /** Speaker plate name */
  speaker?: string;
  /** Dialog text (typewrites in) */
  text?: string;
  /** Box width in px */
  width?: number;
  /** Ms per character */
  typeSpeed?: number;
}) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const t = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          clearInterval(t);
          return n;
        }
        return n + 1;
      });
    }, Math.max(10, typeSpeed));
    return () => clearInterval(t);
  }, [text, typeSpeed]);
  return (
    <>
      <style>{`
        ${SPR_FONT_IMPORT}
        @keyframes spr-arrow { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(3px); opacity: .4; } }
      `}</style>
      <div style={{ padding: 8, display: "inline-block" }}>
        <div style={{ ...pixelBorder(SPR.ink), width, background: SPR.parchment, boxSizing: "border-box", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: -14,
              left: 12,
              background: SPR.sky,
              boxShadow: `0 0 0 3px ${SPR.ink}`,
              fontFamily: SPR.font,
              fontSize: 9,
              color: "#fff",
              padding: "4px 8px 3px",
              textShadow: `1px 1px 0 ${SPR.ink}`,
            }}
          >
            {speaker}
          </span>
          <p
            style={{
              margin: 0,
              padding: "18px 14px 16px",
              minHeight: 64,
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.55,
              color: SPR.ink,
            }}
          >
            {text.slice(0, shown)}
          </p>
          <span
            style={{
              position: "absolute",
              right: 10,
              bottom: 6,
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: `9px solid ${SPR.ink}`,
              animation: "spr-arrow .9s steps(2) infinite",
            }}
          />
        </div>
      </div>
    </>
  );
};
