import { useId } from "react";

/**
 * SignatureOverType — colossal condensed display lines with a handwritten
 * signature scrawled across them, Elias-Rowen style. The signature inks in
 * on mount.
 * Original component for Component Style Studio. License: MIT.
 */
export const SignatureOverType = ({
  lines = "FULL DISCOGRAPHY\n1990–1998",
  signature = "Elias Rowen",
  ink = "#f2f0eb",
  signatureColor = "#a5772a",
  font = "'Bebas Neue', 'Arial Narrow', sans-serif",
  size = 150,
  signatureSize = 92,
  width = 1160,
}: {
  /** Display lines (\n separated) */
  lines?: string;
  /** Handwritten overlay text */
  signature?: string;
  /** Display type color */
  ink?: string;
  /** Signature color */
  signatureColor?: string;
  /** Display font stack (condensed works best) */
  font?: string;
  /** Display size in px */
  size?: number;
  /** Signature size in px */
  signatureSize?: number;
  /** Block width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `sot${uid}`;
  return (
    <div className={cls} style={{ position: "relative", width, textAlign: "center" }}>
      <style>{`
        @keyframes ${cls}-ink { from { opacity: 0; transform: translate(-50%, -46%) rotate(-8deg) scale(.92); }
          to { opacity: 1; transform: translate(-50%, -50%) rotate(-8deg) scale(1); } }
        .${cls}-sig { animation: ${cls}-ink .7s ease .35s both; }
      `}</style>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: 0.92,
          color: ink,
          letterSpacing: "0.01em",
          whiteSpace: "pre-wrap",
        }}
      >
        {lines}
      </div>
      <div
        className={`${cls}-sig`}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-8deg)",
          fontFamily: "'Caveat', cursive",
          fontSize: signatureSize,
          color: signatureColor,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          textShadow: "0 1px 0 rgba(0,0,0,0.08)",
        }}
      >
        {signature}
      </div>
    </div>
  );
};
