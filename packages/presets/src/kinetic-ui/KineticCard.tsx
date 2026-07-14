import { KUI } from "../lib/kinetic";

const COVERS = {
  aurora: { g: "linear-gradient(135deg,#4B3BFF,#8b6cff)", title: "Aurora", body: "Gradient hover with image zoom on a spring lift." },
  meadow: { g: "linear-gradient(135deg,#12A150,#63d69a)", title: "Meadow", body: "Cards elevate with a soft, layered shadow." },
  ember: { g: "linear-gradient(135deg,#E08600,#ffbe5c)", title: "Ember", body: "Every transition uses a shared easing token." },
} as const;

/**
 * Kinetic UI card — spring hover lift with inner cover zoom.
 * (kinetic-ui.md · [COMPONENT] Card)
 */
export const KineticCard = ({
  cover = "aurora",
  title = "",
  description = "",
}: {
  /** Cover gradient */
  cover?: "aurora" | "meadow" | "ember";
  /** Card title (defaults to the cover name) */
  title?: string;
  /** Card body copy */
  description?: string;
}) => {
  const c = COVERS[cover] ?? COVERS.aurora;
  return (
    <div
      className="kui-card"
      style={{
        width: 250,
        border: `1px solid ${KUI.hairline}`,
        borderRadius: KUI.cardRadius,
        overflow: "hidden",
        background: "#fff",
        transition: `transform .3s ${KUI.spring}, box-shadow .3s`,
        cursor: "pointer",
        fontFamily: KUI.body,
        color: KUI.ink,
      }}
    >
      <style>{`
.kui-card:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(20,20,30,.13)}
.kui-card:hover .kui-card-cover{transform:scale(1.08)}
`}</style>
      <div style={{ height: 130, overflow: "hidden", position: "relative" }}>
        <div
          className="kui-card-cover"
          style={{ position: "absolute", inset: 0, background: c.g, transition: "transform .45s ease" }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: KUI.display, fontWeight: 600, fontSize: 15 }}>{title || c.title}</div>
        <p style={{ margin: "5px 0 0", fontSize: 13, color: KUI.muted, lineHeight: 1.5 }}>
          {description || c.body}
        </p>
      </div>
    </div>
  );
};
