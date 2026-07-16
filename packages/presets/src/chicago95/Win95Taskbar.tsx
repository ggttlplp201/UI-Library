import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 taskbar — Start button, running-app slabs, sunken clock well.
 * Each task is a link slot. Original set for Component Style Studio,
 * inspired by mid-90s desktop chrome. MIT.
 */
export const Win95Taskbar = ({
  tasks = "File Manager, Paint",
  clock = "4:20 PM",
  width = 460,
}: {
  /** Comma-separated running-app labels */
  tasks?: string;
  /** Clock text */
  clock?: string;
  /** Bar width in px */
  width?: number;
}) => {
  const items = tasks.split(",").map((s) => s.trim()).filter(Boolean);
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
        style={{
          ...bevelOut,
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
          style={{
            ...(i === 0 ? bevelIn : bevelOut),
            background: i === 0 ? C95.chrome : undefined,
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
        {clock}
      </span>
    </div>
  );
};
