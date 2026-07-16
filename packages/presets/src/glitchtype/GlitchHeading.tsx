/**
 * Glitchtype heading — VT323 terminal display type with chromatic RGB
 * aberration that jitters on hover. Original set for Component Style Studio,
 * inspired by the Glitchtype design language. MIT.
 */
export const GlitchHeading = ({
  text = "GLITCH TYPE",
  size = 56,
  ink = "#141310",
  highlight = "#f5e04b",
  highlightWord = 1,
}: {
  /** Heading text */
  text?: string;
  /** Font size in px */
  size?: number;
  /** Ink color */
  ink?: string;
  /** Highlight block color */
  highlight?: string;
  /** Which word gets the highlight block (0-based, -1 for none) */
  highlightWord?: number;
}) => {
  const words = text.split(" ");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .gt-heading { font-family: 'VT323', 'Courier New', monospace; line-height: .95; letter-spacing: .01em; margin: 0; }
        .gt-heading:hover .gt-h-word { animation: gt-aberrate .35s steps(2) 2; }
        @keyframes gt-aberrate {
          0% { text-shadow: 3px 0 #f0323c, -3px 0 #32c8f0; transform: translateX(-2px); }
          50% { text-shadow: -3px 0 #f0323c, 3px 0 #32c8f0; transform: translateX(2px); }
          100% { text-shadow: 2px 0 #f0323c, -2px 0 #32c8f0; transform: translateX(0); }
        }
      `}</style>
      <h2 className="gt-heading" style={{ fontSize: size, color: ink }}>
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="gt-h-word"
            style={{
              display: "inline-block",
              background: i === highlightWord ? highlight : "transparent",
              padding: i === highlightWord ? "0 .12em" : 0,
              outline: i === highlightWord ? `1px solid ${ink}` : "none",
              marginRight: ".26em",
            }}
          >
            {w}
          </span>
        ))}
      </h2>
    </>
  );
};
