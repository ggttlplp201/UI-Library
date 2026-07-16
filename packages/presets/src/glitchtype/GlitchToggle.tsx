import { useState } from "react";

/**
 * Glitchtype toggle — a hard block that flips between OFF and //ON with a
 * two-step snap and an aberration flash. Original set for Component Style
 * Studio, inspired by the Glitchtype design language. MIT.
 */
export const GlitchToggle = ({
  defaultOn = false,
  onLabel = "//ON",
  offLabel = "OFF",
  ink = "#141310",
  paper = "#f3efe4",
  highlight = "#f5e04b",
}: {
  /** Initial state */
  defaultOn?: boolean;
  /** Label when on */
  onLabel?: string;
  /** Label when off */
  offLabel?: string;
  /** Ink color */
  ink?: string;
  /** Paper color */
  paper?: string;
  /** On-state block color */
  highlight?: string;
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .gt-toggle { font-family: 'VT323', monospace; transition: none; }
        .gt-toggle:active .gt-t-knob { text-shadow: 2px 0 #f0323c, -2px 0 #32c8f0; }
      `}</style>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn((v) => !v)}
        className="gt-toggle"
        style={{
          display: "flex",
          width: 128,
          border: `1px solid ${ink}`,
          background: paper,
          padding: 3,
          cursor: "pointer",
          justifyContent: on ? "flex-end" : "flex-start",
          boxShadow: `3px 3px 0 0 ${ink}`,
        }}
      >
        <span
          className="gt-t-knob"
          style={{
            display: "inline-block",
            padding: "2px 12px 1px",
            fontSize: 20,
            letterSpacing: ".05em",
            background: on ? highlight : ink,
            color: on ? ink : paper,
            outline: `1px solid ${ink}`,
          }}
        >
          {on ? onLabel : offLabel}
        </span>
      </button>
    </>
  );
};
