import { useId } from "react";

/**
 * HoverRowTable — an index list that behaves like the award-site tables it's
 * modeled on: every row inverts on hover and staggers in on mount. Two
 * voices: `pill` (outlined capsule rows — Kino-Archive energy) and `line`
 * (bare console rows that flood white — Depot energy).
 * Original component for Component Style Studio. License: MIT.
 */
export const HoverRowTable = ({
  header = "Style | Work | Year",
  rows = "German Expressionism | Shadow City | 1920\nSoviet Montage | Rhythm of the Revolution | 1925\nItalian Neorealism | Children of the Ruins | 1946\nFrench New Wave | Jump Cut Hearts | 1960",
  variant = "pill",
  ink = "#140d0b",
  outline = "#140d0b",
  hoverBg = "#140d0b",
  hoverInk = "#E3241B",
  font = "'Archivo', system-ui, sans-serif",
  fontSize = 20,
  width = 1100,
}: {
  /** Column titles, separated by | */
  header?: string;
  /** One row per line; columns separated by | */
  rows?: string;
  /** pill — outlined capsules · line — bare console rows */
  variant?: "pill" | "line";
  /** Text color */
  ink?: string;
  /** Pill outline color */
  outline?: string;
  /** Row fill on hover */
  hoverBg?: string;
  /** Text color on hover */
  hoverInk?: string;
  /** Font stack */
  font?: string;
  /** Row text size in px */
  fontSize?: number;
  /** Table width in px */
  width?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `hrt${uid}`;
  const cols = header.split("|").map((s) => s.trim());
  const data = rows
    .split("\n")
    .map((r) => r.split("|").map((s) => s.trim()))
    .filter((r) => r.some(Boolean));
  const pill = variant === "pill";
  const cell = (value: string, i: number): React.CSSProperties => ({
    flex: i === cols.length - 1 ? "0 0 auto" : "1 1 0",
    textAlign: i === cols.length - 1 ? "right" : "left",
    minWidth: i === cols.length - 1 ? 64 : 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });
  const rowBase: React.CSSProperties = pill
    ? {
        border: `2px solid ${outline}`,
        borderRadius: 999,
        padding: `${Math.round(fontSize * 0.7)}px ${Math.round(fontSize * 1.3)}px`,
        marginBottom: Math.round(fontSize * 0.6),
      }
    : {
        padding: `${Math.round(fontSize * 0.5)}px ${Math.round(fontSize * 0.8)}px`,
      };
  return (
    <div style={{ width, fontFamily: font, color: ink }}>
      <style>{`
        @keyframes ${cls}-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .${cls}-row { display: flex; gap: 24px; align-items: baseline; background: transparent;
          transition: background .14s ease, color .14s ease; animation: ${cls}-in .5s ease both; cursor: default; }
        .${cls}-row:hover { background: ${hoverBg}; color: ${hoverInk}; }
      `}</style>
      <div
        style={{
          display: "flex",
          gap: 24,
          padding: rowBase.padding,
          fontWeight: 800,
          fontSize: fontSize * (pill ? 1.15 : 0.9),
          letterSpacing: pill ? "-0.01em" : ".08em",
          textTransform: pill ? undefined : "uppercase",
          marginBottom: Math.round(fontSize * 0.5),
        }}
      >
        {cols.map((c, i) => (
          <span key={i} style={cell(c, i)}>
            {c}
          </span>
        ))}
      </div>
      {data.map((r, ri) => (
        <div
          key={ri}
          className={`${cls}-row`}
          style={{ ...rowBase, fontSize, animationDelay: `${ri * 70}ms` }}
        >
          {r.map((value, i) => (
            <span key={i} style={cell(value, i)}>
              {value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
