/**
 * ImageBlock — a picture with optional caption. Defaults to a seeded
 * placeholder photo; upload or paste any URL from the Controls panel.
 * Original component for Component Style Studio. License: MIT.
 */
export const ImageBlock = ({
  imageSrc = "https://picsum.photos/seed/studio-field/900/600",
  width = 420,
  height = 280,
  radius = 10,
  caption = "",
  fit = "cover",
}: {
  /** Image source (URL or uploaded) */
  imageSrc?: string;
  /** Display width in px */
  width?: number;
  /** Display height in px */
  height?: number;
  /** Corner radius in px */
  radius?: number;
  /** Small caption under the image (empty hides it) */
  caption?: string;
  /** How the photo fills the frame */
  fit?: "cover" | "contain";
}) => (
  <figure style={{ margin: 0, width, fontFamily: "system-ui, sans-serif" }}>
    <img
      src={imageSrc}
      alt={caption || "image"}
      style={{ width, height, objectFit: fit, borderRadius: radius, display: "block", background: "#1a1a1f" }}
    />
    {caption && (
      <figcaption style={{ marginTop: 8, fontSize: 12, color: "#8a8578" }}>{caption}</figcaption>
    )}
  </figure>
);
