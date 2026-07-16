/**
 * Glitchtype input — a terminal prompt field: mono type, hairline underline
 * frame, block caret blinking at the prompt. Original set for Component
 * Style Studio, inspired by the Glitchtype design language. MIT.
 */
export const GlitchInput = ({
  label = "QUERY",
  placeholder = "type here_",
  ink = "#141310",
  paper = "#f3efe4",
}: {
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Ink color */
  ink?: string;
  /** Paper color */
  paper?: string;
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap');
      .gt-input-wrap { font-family: 'IBM Plex Mono', monospace; width: 280px; }
      .gt-input-row:focus-within { box-shadow: 3px 3px 0 0 var(--gt-ink); }
      .gt-input-row:focus-within .gt-caret { opacity: 0; }
      .gt-input { font-family: inherit; }
      .gt-input::placeholder { color: color-mix(in srgb, var(--gt-ink) 45%, transparent); }
      .gt-caret { width: 9px; height: 18px; background: var(--gt-ink); animation: gt-blink 1s steps(1) infinite; flex-shrink: 0; }
      @keyframes gt-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    `}</style>
    <div className="gt-input-wrap" style={{ "--gt-ink": ink } as React.CSSProperties}>
      <div style={{ fontSize: 11, letterSpacing: ".14em", color: ink, marginBottom: 4 }}>▸ {label}</div>
      <div
        className="gt-input-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${ink}`,
          background: paper,
          padding: "9px 10px",
          transition: "box-shadow .1s steps(2)",
        }}
      >
        <span style={{ color: ink, fontSize: 14 }}>&gt;</span>
        <input
          className="gt-input"
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "none", fontSize: 14, color: ink }}
        />
        <span className="gt-caret" />
      </div>
    </div>
  </>
);
