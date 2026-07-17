import { useId } from "react";

/**
 * HoverIndexReveal — an Origami-style work index: big rows that underline on
 * hover while the matching image fades in beside the list. CSS-only
 * (`:has()`), so the reveal survives static exports.
 * Original component for Component Style Studio. License: MIT.
 */
export const HoverIndexReveal = ({
  rows = "HARBOR | 2026\nMARKET | 2025\nRIVER | 2025\nRIDGE | 2024",
  images = "https://picsum.photos/id/1041/640/800\nhttps://picsum.photos/id/1080/640/800?grayscale\nhttps://picsum.photos/id/1015/640/800\nhttps://picsum.photos/id/1036/640/800?grayscale",
  ink = "#17150f",
  accent = "#b3402f",
  font = "'EB Garamond', Georgia, serif",
  fontSize = 44,
  width = 1160,
  imageWidth = 300,
  imageHeight = 380,
}: {
  /** One row per line; columns separated by | (last column right-aligned) */
  rows?: string;
  /** One image URL per line — row hover reveals images[row % count] */
  images?: string;
  /** Text color */
  ink?: string;
  /** Hover underline color */
  accent?: string;
  /** Font stack */
  font?: string;
  /** Row text size in px */
  fontSize?: number;
  /** Block width in px */
  width?: number;
  /** Reveal image width in px */
  imageWidth?: number;
  /** Reveal image height in px */
  imageHeight?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `hir${uid}`;
  const data = rows
    .split("\n")
    .map((r) => r.split("|").map((s) => s.trim()))
    .filter((r) => r.some(Boolean));
  const imgs = images.split("\n").map((s) => s.trim()).filter(Boolean);
  const reveal =
    imgs.length === 0
      ? ""
      : data
          .map(
            (_, ri) =>
              `.${cls}:has(.${cls}-row[data-i="${ri}"]:hover) .${cls}-img[data-i="${ri % imgs.length}"] { opacity: 1; transform: none; }`,
          )
          .join("\n");
  return (
    <div className={cls} style={{ display: "flex", gap: 48, width, fontFamily: font, color: ink }}>
      <style>{`
        .${cls}-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          opacity: 0; transform: translateY(14px) rotate(-2deg); transition: opacity .3s ease, transform .3s ease; }
        .${cls}-row { display: flex; align-items: baseline; gap: 24px; padding: ${Math.round(fontSize * 0.32)}px 0;
          border-bottom: 1px solid ${ink}22; text-decoration: none; cursor: pointer; }
        .${cls}-row:hover { text-decoration: underline; text-decoration-color: ${accent}; text-underline-offset: 8px; }
        ${reveal}
      `}</style>
      <div style={{ position: "relative", flex: `0 0 ${imageWidth}px`, height: imageHeight }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} alt="" data-i={i} className={`${cls}-img`} />
        ))}
      </div>
      <div style={{ flex: 1, alignSelf: "center" }}>
        {data.map((r, ri) => (
          <div key={ri} className={`${cls}-row`} data-i={ri}>
            <span style={{ fontSize, fontWeight: 500, flex: 1, minWidth: 0 }}>{r[0]}</span>
            {r[1] ? (
              <span style={{ fontSize: Math.round(fontSize * 0.42), opacity: 0.6 }}>{r[1]}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
