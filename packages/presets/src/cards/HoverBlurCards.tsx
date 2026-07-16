/**
 * HoverBlurCards — stack of color cards where the hovered card scales up
 * while its siblings blur and shrink away.
 * Ported from UIverse.io (chilly-snake-91) by kamehame-ha.
 * Source: https://uiverse.io/kamehame-ha/chilly-snake-91
 * License: MIT. Attribution: kamehame-ha via UIverse.io.
 */
export const HoverBlurCards = ({
  tip = "Hover Me",
  subtitle = "Lorem Ipsum",
  color1 = "#f43f5e",
  color2 = "#3b82f6",
  color3 = "#22c55e",
}: {
  /** Main text on each card */
  tip?: string;
  /** Secondary text on each card */
  subtitle?: string;
  /** First card color */
  color1?: string;
  /** Second card color */
  color2?: string;
  /** Third card color */
  color3?: string;
}) => (
  <>
    <style>{`
      .uv-hbc-cards {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .uv-hbc-cards .uv-hbc-card {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        height: 100px;
        width: 250px;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        transition: 400ms;
      }
      .uv-hbc-cards .uv-hbc-card p.uv-hbc-tip {
        font-size: 1em;
        font-weight: 700;
      }
      .uv-hbc-cards .uv-hbc-card p.uv-hbc-second-text {
        font-size: .7em;
      }
      .uv-hbc-cards .uv-hbc-card:hover {
        transform: scale(1.1, 1.1);
      }
      .uv-hbc-cards:hover > .uv-hbc-card:not(:hover) {
        filter: blur(10px);
        transform: scale(0.9, 0.9);
      }
    `}</style>
    <div className="uv-hbc-cards">
      {[color1, color2, color3].map((color, i) => (
        <div key={i} className="uv-hbc-card" data-link-slot={`card ${i + 1}`} style={{ backgroundColor: color }}>
          <p className="uv-hbc-tip">{tip}</p>
          <p className="uv-hbc-second-text">{subtitle}</p>
        </div>
      ))}
    </div>
  </>
);
