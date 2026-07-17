import { useEffect, useState } from "react";
import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 taskbar — Start button (with a real pressed state), running-app
 * slabs you can switch between, and a sunken clock well that ticks with the
 * actual time. Original set for Component Style Studio. MIT.
 */
export const Win95Taskbar = ({
  tasks = "File Manager, Paint",
  clock = "",
  width = 460,
}: {
  /** Comma-separated running-app labels */
  tasks?: string;
  /** Fixed clock text — empty ticks with the real time */
  clock?: string;
  /** Bar width in px */
  width?: number;
}) => {
  const items = tasks.split(",").map((s) => s.trim()).filter(Boolean);
  const [active, setActive] = useState(0);
  const [startDown, setStartDown] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const shownClock = clock || now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <div
      style={{
        ...bevelOut,
        width,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 3,
        fontFamily: C95.font,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        data-link-slot="start"
        onMouseDown={() => setStartDown(true)}
        onMouseUp={() => setStartDown(false)}
        onMouseLeave={() => setStartDown(false)}
        style={{
          ...(startDown ? bevelIn : bevelOut),
          background: startDown ? C95.chrome : undefined,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          fontSize: 12,
          fontWeight: 700,
          color: C95.ink,
          cursor: "pointer",
          fontFamily: C95.font,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            background: `conic-gradient(#f25022 0 25%, #7fba00 0 50%, #00a4ef 0 75%, #ffb900 0 100%)`,
            display: "inline-block",
          }}
        />
        Start
      </button>
      {items.map((t, i) => (
        <button
          key={`${t}-${i}`}
          type="button"
          data-link-slot={t}
          onClick={() => setActive(i)}
          style={{
            ...(i === active ? bevelIn : bevelOut),
            background: i === active ? C95.chrome : undefined,
            fontWeight: i === active ? 700 : 400,
            padding: "3px 10px",
            fontSize: 11,
            color: C95.ink,
            cursor: "pointer",
            fontFamily: C95.font,
            maxWidth: 120,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {t}
        </button>
      ))}
      <span style={{ flex: 1 }} />
      <span style={{ ...bevelIn, background: C95.chrome, padding: "3px 9px", fontSize: 11, color: C95.ink }}>
        {shownClock}
      </span>
    </div>
  );
};
