import { BOLD, bentoFrame } from "./libBold";

/**
 * Boldcase halftone photo — an image behind a print-dot screen in a hard
 * frame with a caption plate. Original set for Component Style Studio,
 * inspired by studio-editorial bento systems. MIT.
 */
export const HalftonePhoto = ({
  imageSrc = "https://picsum.photos/seed/boldcase-a/640/440?grayscale",
  caption = "STUDIO, 2026",
  width = 300,
  height = 210,
  dotSize = 4,
}: {
  /** Image URL */
  imageSrc?: string;
  /** Caption plate text */
  caption?: string;
  /** Frame width in px */
  width?: number;
  /** Frame height in px */
  height?: number;
  /** Halftone dot pitch in px */
  dotSize?: number;
}) => (
  <div style={{ padding: 8, display: "inline-block" }}>
    <figure style={{ ...bentoFrame(), margin: 0, width, boxSizing: "border-box", position: "relative", overflow: "visible" }}>
      <div style={{ position: "relative", height, overflow: "hidden" }}>
        <img src={imageSrc} alt={caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "contrast(1.15)" }} />
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at center, ${BOLD.ink} 1px, transparent 1.2px)`,
            backgroundSize: `${dotSize}px ${dotSize}px`,
            mixBlendMode: "overlay",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />
      </div>
      <figcaption
        style={{
          position: "absolute",
          left: -8,
          bottom: -12,
          background: BOLD.yellow,
          border: `2px solid ${BOLD.ink}`,
          fontFamily: BOLD.display,
          fontSize: 12,
          padding: "3px 10px",
          color: BOLD.ink,
          transform: "rotate(-2deg)",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  </div>
);
