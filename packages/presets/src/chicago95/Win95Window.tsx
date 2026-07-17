import { useState } from "react";
import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 window — silver chrome frame, navy title bar whose controls
 * actually work: minimize collapses the well, maximize widens the frame,
 * close rolls the window up into a taskbar chip you can click to restore.
 * Original set for Component Style Studio. MIT.
 */
export const Win95Window = ({
  title = "My Computer",
  body = "It is now safe to compose your page. The controls up there really work — minimize, maximize, close.",
  width = 340,
}: {
  /** Title bar text */
  title?: string;
  /** Window body copy */
  body?: string;
  /** Window width in px */
  width?: number;
}) => {
  const [min, setMin] = useState(false);
  const [max, setMax] = useState(false);
  const [closed, setClosed] = useState(false);
  if (closed)
    return (
      <button
        type="button"
        onClick={() => setClosed(false)}
        style={{ ...bevelOut, padding: "4px 12px", fontFamily: C95.font, fontSize: 11, fontWeight: 700, color: C95.ink, cursor: "pointer" }}
      >
        ▸ {title}
      </button>
    );
  const controls: Array<[string, () => void, boolean]> = [
    ["_", () => setMin((v) => !v), min],
    ["□", () => setMax((v) => !v), max],
    ["✕", () => setClosed(true), false],
  ];
  return (
  <div style={{ ...bevelOut, width: max ? width + 90 : width, padding: 3, fontFamily: C95.font, boxSizing: "border-box", transition: "width .15s steps(3)" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: `linear-gradient(90deg, ${C95.navy}, ${C95.navy2})`,
        color: "#fff",
        padding: "3px 4px 3px 7px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".01em",
      }}
    >
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      {controls.map(([g, fn, held]) => (
        <button
          key={g}
          type="button"
          onClick={fn}
          style={{
            ...(held ? bevelIn : bevelOut),
            background: held ? C95.chrome : undefined,
            width: 18,
            height: 16,
            fontSize: 9,
            lineHeight: "10px",
            fontWeight: 700,
            color: C95.ink,
            cursor: "pointer",
            padding: 0,
            fontFamily: C95.font,
          }}
        >
          {g}
        </button>
      ))}
    </div>
    {!min && (
      <div style={{ ...bevelIn, margin: "3px 0 0", padding: "12px 12px 14px", fontSize: 12, lineHeight: 1.5, color: C95.ink }}>
        {body}
      </div>
    )}
  </div>
  );
};
