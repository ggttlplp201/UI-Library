/**
 * Glitchtype marquee — an ink ticker band rolling terminal text; the strip
 * aberrates on hover. Original set for Component Style Studio, inspired by
 * the Glitchtype design language. MIT.
 */
export const GlitchMarquee = ({
  text = "SIGNAL LOCKED /// 60FPS /// NO PACKET LOSS /// ",
  ink = "#141310",
  paper = "#f3efe4",
  speed = 14,
}: {
  /** Ticker text (repeats) */
  text?: string;
  /** Band color */
  ink?: string;
  /** Text color */
  paper?: string;
  /** Seconds per loop */
  speed?: number;
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
      @keyframes gt-roll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .gt-mq:hover .gt-mq-track { text-shadow: 2px 0 #f0323c, -2px 0 #32c8f0; }
    `}</style>
    <div
      className="gt-mq"
      style={{
        width: 640,
        maxWidth: "100%",
        overflow: "hidden",
        background: ink,
        borderTop: `1px solid ${ink}`,
        borderBottom: `1px solid ${ink}`,
        padding: "4px 0 2px",
      }}
    >
      <div
        className="gt-mq-track"
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontFamily: "'VT323', monospace",
          fontSize: 22,
          letterSpacing: ".08em",
          color: paper,
          animation: `gt-roll ${speed}s linear infinite`,
        }}
      >
        <span>{text.repeat(4)}</span>
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  </>
);
