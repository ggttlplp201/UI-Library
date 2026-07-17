import { useId } from "react";

/**
 * ImageRevealIndex — a full-bleed hero in the Depot register: a frosted
 * glass console floating over photography, with a mono index whose rows
 * flood white on hover — and each row swaps the background image behind
 * the glass. Pure CSS (`:has()`), so the effect survives static exports.
 * Original component for Component Style Studio. License: MIT.
 */
export const ImageRevealIndex = ({
  brand = "CONTROL ROOM",
  tagline = "THOUGHTFUL FROM START TO FINISH\n— PRECISE, SIMPLE, EFFECTIVE.",
  nav = "HOME | WORK | ABOUT | CALL",
  label = "PROJECT",
  header = "NAME | TYPE | YEAR",
  rows = "HOLO | IDENTITY | 2027\nNEURAL | BRANDING | 2028\nFLUX | CAMPAIGN | 2028\nGHOST | INTERFACE | 2029\nPULSE | VISUALS | 2026\nNANO | NARRATIVE | 2029\nECHO | MATE | 2030\nPHOTON | LAUNCH | 2030",
  images = "https://picsum.photos/id/1015/1600/900?grayscale\nhttps://picsum.photos/id/1016/1600/900?grayscale\nhttps://picsum.photos/id/1018/1600/900?grayscale\nhttps://picsum.photos/id/1036/1600/900?grayscale\nhttps://picsum.photos/id/1041/1600/900?grayscale",
  width = 1280,
  height = 860,
  ink = "#eef3f6",
  hoverBg = "#eef3f6",
  hoverInk = "#05080b",
}: {
  /** Console wordmark */
  brand?: string;
  /** Mono tagline, top right */
  tagline?: string;
  /** Nav items, separated by | */
  nav?: string;
  /** Small label above the index */
  label?: string;
  /** Column titles, separated by | */
  header?: string;
  /** One row per line; columns separated by | */
  rows?: string;
  /** One image URL per line — row hover reveals images[row % count] */
  images?: string;
  /** Section width in px */
  width?: number;
  /** Section height in px */
  height?: number;
  /** Text color */
  ink?: string;
  /** Row fill on hover */
  hoverBg?: string;
  /** Row text on hover */
  hoverInk?: string;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `iri${uid}`;
  const MONO = "'IBM Plex Mono', ui-monospace, monospace";
  const cols = header.split("|").map((s) => s.trim());
  const data = rows
    .split("\n")
    .map((r) => r.split("|").map((s) => s.trim()))
    .filter((r) => r.some(Boolean));
  const imgs = images.split("\n").map((s) => s.trim()).filter(Boolean);
  const dim = "rgba(238,243,246,0.55)";
  const cell = (i: number): React.CSSProperties => ({
    flex: i === cols.length - 1 ? "0 0 auto" : "1 1 0",
    textAlign: i === cols.length - 1 ? "right" : "left",
    minWidth: i === cols.length - 1 ? 48 : 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });
  // CSS-only reveal: :has() maps the hovered row index to its image, so the
  // interaction works identically in the live canvas and in static exports.
  const revealRules = data
    .map(
      (_, ri) =>
        `.${cls}:has(.${cls}-row[data-i="${ri}"]:hover) .${cls}-img[data-i="${ri % imgs.length}"] { opacity: 1; }`,
    )
    .join("\n");
  return (
    <div className={cls} style={{ position: "relative", width, height, overflow: "hidden", background: "#05080b" }}>
      <style>{`
        .${cls}-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          opacity: 0; transition: opacity .45s ease; }
        .${cls}-img[data-i="0"] { opacity: 1; }
        .${cls}:has(.${cls}-row:hover) .${cls}-img { opacity: 0; }
        ${revealRules}
        .${cls}-row { display: flex; gap: 20px; padding: 3px 10px; transition: background .12s ease, color .12s ease; }
        .${cls}-row:hover { background: ${hoverBg}; color: ${hoverInk}; }
      `}</style>
      {imgs.map((src, i) => (
        <img key={i} src={src} alt="" data-i={i} className={`${cls}-img`} />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(4,7,10,.3), rgba(4,7,10,.72))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 56,
          transform: "translateX(-50%)",
          width: 640,
          height: height - 112,
          boxSizing: "border-box",
          padding: "40px 44px",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(12,17,22,0.42)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: ink,
          fontFamily: MONO,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
          <span
            style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {brand}
          </span>
          <span style={{ fontSize: 10, color: dim, whiteSpace: "pre-wrap", textAlign: "right", lineHeight: 1.6 }}>
            {tagline}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 26 }}>
          {nav.split("|").map((item, i) => (
            <span key={i}>{item.trim()}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: dim, marginTop: 30 }}>{label}</div>
        <div
          style={{
            display: "flex",
            gap: 20,
            padding: "3px 10px",
            fontSize: 11,
            color: dim,
            marginTop: 14,
            letterSpacing: ".06em",
          }}
        >
          {cols.map((c, i) => (
            <span key={i} style={cell(i)}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
          {data.map((r, ri) => (
            <div key={ri} className={`${cls}-row`} data-i={ri}>
              {r.map((value, i) => (
                <span key={i} style={cell(i)}>
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* Bottom of the glass stays open — stat blocks land here on the canvas. */}
      </div>
    </div>
  );
};
