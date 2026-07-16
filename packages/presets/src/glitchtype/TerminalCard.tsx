/**
 * Glitchtype terminal card — a spec-sheet block on paper: hairline ink
 * frame, corner ticks, mono header row with an index, body copy set in
 * terminal type. Original set for Component Style Studio, inspired by the
 * Glitchtype design language. MIT.
 */
export const TerminalCard = ({
  index = "01",
  title = "SYSTEM MODULE",
  body = "A paper-bright, code-forward surface. Hairline ink borders and hard edges keep it precise; the yellow block keeps it alive.",
  footer = "STATUS: NOMINAL",
  ink = "#141310",
  paper = "#f3efe4",
  highlight = "#f5e04b",
}: {
  /** Corner index */
  index?: string;
  /** Card title */
  title?: string;
  /** Body copy */
  body?: string;
  /** Footer status line */
  footer?: string;
  /** Ink color */
  ink?: string;
  /** Paper color */
  paper?: string;
  /** Highlight color */
  highlight?: string;
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@400;500&display=swap');
      .gt-card { position: relative; font-family: 'IBM Plex Mono', monospace; }
      .gt-card .gt-tick { position: absolute; width: 9px; height: 9px; }
      .gt-card .gt-tick.tl { top: -1px; left: -1px; border-top: 3px solid var(--gt-ink); border-left: 3px solid var(--gt-ink); }
      .gt-card .gt-tick.tr { top: -1px; right: -1px; border-top: 3px solid var(--gt-ink); border-right: 3px solid var(--gt-ink); }
      .gt-card .gt-tick.bl { bottom: -1px; left: -1px; border-bottom: 3px solid var(--gt-ink); border-left: 3px solid var(--gt-ink); }
      .gt-card .gt-tick.br { bottom: -1px; right: -1px; border-bottom: 3px solid var(--gt-ink); border-right: 3px solid var(--gt-ink); }
    `}</style>
    <div
      className="gt-card"
      style={
        {
          "--gt-ink": ink,
          width: 320,
          background: paper,
          border: `1px solid ${ink}`,
          color: ink,
        } as React.CSSProperties
      }
    >
      <span className="gt-tick tl" />
      <span className="gt-tick tr" />
      <span className="gt-tick bl" />
      <span className="gt-tick br" />
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          borderBottom: `1px solid ${ink}`,
          padding: "8px 12px 6px",
        }}
      >
        <span style={{ background: highlight, outline: `1px solid ${ink}`, padding: "0 6px", fontFamily: "'VT323', monospace", fontSize: 20 }}>
          {index}
        </span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: 22, letterSpacing: ".04em" }}>{title}</span>
      </div>
      <p style={{ margin: 0, padding: "12px 12px 14px", fontSize: 12.5, lineHeight: 1.55 }}>{body}</p>
      <div style={{ borderTop: `1px dashed ${ink}`, padding: "6px 12px", fontSize: 11, letterSpacing: ".08em" }}>
        {footer}
      </div>
    </div>
  </>
);
