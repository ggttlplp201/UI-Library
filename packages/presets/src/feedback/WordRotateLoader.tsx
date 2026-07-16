/**
 * WordRotateLoader — "loading" label with a vertical carousel of words that
 * flick upward behind a soft gradient clip.
 * Ported from UIverse.io (fresh-lizard-20) by kennyotsu.
 * Source: https://uiverse.io/kennyotsu/fresh-lizard-20
 * License: MIT. Attribution: kennyotsu via UIverse.io.
 */
export const WordRotateLoader = ({
  prefix = "loading",
  words = ["buttons", "forms", "switches", "cards"],
  accent = "#956afa",
  bgColor = "#111",
}: {
  /** Static text before the rotating words */
  prefix?: string;
  /** Rotating words (first four are used; the loop closes on the first) */
  words?: string[];
  /** Rotating word color */
  accent?: string;
  /** Card background (also clips the word column) */
  bgColor?: string;
}) => {
  const base = words.length > 0 ? words : ["loading"];
  const cycle = Array.from({ length: 4 }, (_, i) => base[i % base.length]);
  cycle.push(cycle[0]);
  return (
    <>
      <style>{`
        .uv-wrl-card {
          background-color: var(--uv-wrl-bg-color);
          padding: 1rem 2rem;
          border-radius: 1.25rem;
        }
        .uv-wrl-loader {
          color: rgb(124, 124, 124);
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 25px;
          box-sizing: content-box;
          height: 40px;
          padding: 10px 10px;
          display: flex;
          border-radius: 8px;
        }
        .uv-wrl-words {
          overflow: hidden;
          position: relative;
        }
        .uv-wrl-words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--uv-wrl-bg-color) 10%,
            transparent 30%,
            transparent 70%,
            var(--uv-wrl-bg-color) 90%
          );
          z-index: 20;
        }
        .uv-wrl-word {
          display: block;
          height: 100%;
          padding-left: 6px;
          color: var(--uv-wrl-accent);
          animation: uv-wrl-spin 4s infinite;
        }
        @keyframes uv-wrl-spin {
          10% { transform: translateY(-102%); }
          25% { transform: translateY(-100%); }
          35% { transform: translateY(-202%); }
          50% { transform: translateY(-200%); }
          60% { transform: translateY(-302%); }
          75% { transform: translateY(-300%); }
          85% { transform: translateY(-402%); }
          100% { transform: translateY(-400%); }
        }
      `}</style>
      <div
        className="uv-wrl-card"
        style={{
          ["--uv-wrl-bg-color" as string]: bgColor,
          ["--uv-wrl-accent" as string]: accent,
        }}
      >
        <div className="uv-wrl-loader">
          <p>{prefix}</p>
          <div className="uv-wrl-words">
            {cycle.map((word, i) => (
              <span key={i} className="uv-wrl-word">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
