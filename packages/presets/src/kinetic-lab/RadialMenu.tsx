import { useState } from "react";
import { KLAB, klabOnAccent } from "../lib/klab";

const ANGLES = [-150, -110, -70, -30];
const ICONS = ["★", "✎", "↗", "♥"];

/**
 * Kinetic Lab radial menu — FAB whose 4 actions fan out on an arc with a
 * staggered spring; the center "+" rotates 135°.
 * (kinetic-lab.md · [COMPONENT] RadialMenu)
 */
export const RadialMenu = ({
  accent = "#E3B23C",
}: {
  /** Accent color (FAB + actions) */
  accent?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ink = klabOnAccent(accent);
  return (
    // Room above for the fanned-out actions.
    <div style={{ paddingTop: 96, paddingLeft: 70, paddingRight: 70, paddingBottom: 8 }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        {ANGLES.map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const dist = 74;
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;
          return (
            <button
              key={a}
              type="button"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#08080C",
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,.4)",
                transition: `transform .45s ${KLAB.spring} ${open ? i * 0.05 : (3 - i) * 0.05}s, opacity .3s`,
                transform: `translate(${open ? x.toFixed(0) : 0}px, ${open ? y.toFixed(0) : 0}px) scale(${open ? 1 : 0})`,
                opacity: open ? 1 : 0,
              }}
            >
              {ICONS[i]}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: accent,
            boxShadow: "0 10px 26px rgba(0,0,0,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform .3s",
          }}
        >
          <span
            style={{
              fontSize: 30,
              color: ink,
              lineHeight: 1,
              transition: `transform .4s ${KLAB.spring}`,
              transform: open ? "rotate(135deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
        </button>
      </div>
    </div>
  );
};
