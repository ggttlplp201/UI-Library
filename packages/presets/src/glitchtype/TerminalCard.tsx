import { useEffect, useRef, useState } from "react";

/**
 * Glitchtype terminal card — a live terminal readout on paper: hairline ink
 * frame, corner ticks, and body lines that TYPE themselves with a blinking
 * block cursor, looping through the feed. The footer status follows the
 * typing state. Original set for Component Style Studio. MIT.
 */
export const TerminalCard = ({
  index = "01",
  title = "SYSTEM MODULE",
  lines = "> boot sequence.......OK\n> ink buffers.........OK\n> scanline sweep......ACTIVE\n> glitch channel......ARMED",
  ink = "#141310",
  paper = "#f3efe4",
  highlight = "#f5e04b",
  charMs = 34,
}: {
  /** Corner index */
  index?: string;
  /** Terminal lines, one per line — typed in order, then looped */
  lines?: string;
  /** Card title */
  title?: string;
  /** Ink color */
  ink?: string;
  /** Paper color */
  paper?: string;
  /** Highlight color */
  highlight?: string;
  /** Typing speed per character (ms) */
  charMs?: number;
}) => {
  const feed = lines.split("\n").filter(Boolean);
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const pos = useRef({ line: 0, ch: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      const { line, ch } = pos.current;
      const target = feed[line] ?? "";
      if (ch < target.length) {
        pos.current = { line, ch: ch + 1 };
        setCurrent(target.slice(0, ch + 1));
      } else if (line < feed.length - 1) {
        pos.current = { line: line + 1, ch: 0 };
        setDone((d) => [...d, target]);
        setCurrent("");
      } else {
        // Hold the finished feed for a beat, then loop.
        pos.current = { line: 0, ch: 0 };
        setDone([]);
        setCurrent("");
      }
    }, Math.max(12, charMs));
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, charMs]);
  const typing = pos.current.line < feed.length - 1 || current.length < (feed[feed.length - 1] ?? "").length;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .gt-card { position: relative; font-family: 'IBM Plex Mono', monospace; }
        .gt-card .gt-tick { position: absolute; width: 9px; height: 9px; }
        .gt-card .gt-tick.tl { top: -1px; left: -1px; border-top: 3px solid var(--gt-ink); border-left: 3px solid var(--gt-ink); }
        .gt-card .gt-tick.tr { top: -1px; right: -1px; border-top: 3px solid var(--gt-ink); border-right: 3px solid var(--gt-ink); }
        .gt-card .gt-tick.bl { bottom: -1px; left: -1px; border-bottom: 3px solid var(--gt-ink); border-left: 3px solid var(--gt-ink); }
        .gt-card .gt-tick.br { bottom: -1px; right: -1px; border-bottom: 3px solid var(--gt-ink); border-right: 3px solid var(--gt-ink); }
        @keyframes gt-cursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
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
        <div style={{ padding: "12px 12px 14px", fontSize: 12.5, lineHeight: 1.6, minHeight: feed.length * 20 }}>
          {done.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
          <div>
            {current}
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 13,
                background: ink,
                verticalAlign: "-2px",
                marginLeft: 2,
                animation: "gt-cursor 1s steps(1) infinite",
              }}
            />
          </div>
        </div>
        <div style={{ borderTop: `1px dashed ${ink}`, padding: "6px 12px", fontSize: 11, letterSpacing: ".08em" }}>
          STATUS: {typing ? "STREAMING" : "NOMINAL"}
        </div>
      </div>
    </>
  );
};
