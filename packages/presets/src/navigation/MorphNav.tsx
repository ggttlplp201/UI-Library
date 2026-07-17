import { useId } from "react";

/**
 * MorphNav — navigation as a hover effect: a column of giant repeated words
 * that each morph into their destination label (accent color) on hover.
 * CSS-only crossfade, so it survives static exports.
 * Original component for Component Style Studio. License: MIT.
 */
export const MorphNav = ({
  word = "CLICK",
  items = "Projects | About | Contact",
  ink = "#f2f0eb",
  accent = "#c8f542",
  font = "'Inter Tight', system-ui, sans-serif",
  size = 72,
  width = 520,
}: {
  /** The repeated word shown at rest */
  word?: string;
  /** Destination labels, separated by | */
  items?: string;
  /** Resting text color */
  ink?: string;
  /** Hover label color */
  accent?: string;
  /** Font stack */
  font?: string;
  /** Word size in px */
  size?: number;
  /** Block width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mnv${uid}`;
  const labels = items.split("|").map((s) => s.trim()).filter(Boolean);
  return (
    <nav style={{ width, fontFamily: font, fontWeight: 800, textAlign: "center" }}>
      <style>{`
        .${cls}-row { position: relative; display: block; height: ${Math.round(size * 1.16)}px;
          cursor: pointer; }
        .${cls}-row > span { position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; font-size: ${size}px; letter-spacing: -0.02em; line-height: 1;
          transition: opacity .22s ease; white-space: nowrap; }
        .${cls}-base { color: ${ink}; opacity: 1; }
        .${cls}-alt { color: ${accent}; opacity: 0; text-transform: uppercase; }
        .${cls}-row:hover .${cls}-base { opacity: 0; }
        .${cls}-row:hover .${cls}-alt { opacity: 1; }
      `}</style>
      {labels.map((label, i) => (
        <div key={i} className={`${cls}-row`} data-nav-item={label}>
          <span className={`${cls}-base`}>{word}</span>
          <span className={`${cls}-alt`}>{label}</span>
        </div>
      ))}
    </nav>
  );
};
