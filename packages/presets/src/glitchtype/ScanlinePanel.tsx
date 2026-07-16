/**
 * Glitchtype scanline panel — a CRT surface: phosphor-tinted paper under
 * rolling scanlines with a slow vertical sweep. Stretch it behind a section.
 * Original set for Component Style Studio, inspired by the Glitchtype design
 * language. MIT.
 */
export const ScanlinePanel = ({
  paper = "#f3efe4",
  ink = "#141310",
  sweep = true,
}: {
  /** Panel base color */
  paper?: string;
  /** Scanline ink */
  ink?: string;
  /** Animate the vertical sweep bar */
  sweep?: boolean;
}) => (
  <>
    <style>{`
      @keyframes gt-sweep { from { top: -12%; } to { top: 112%; } }
    `}</style>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 420,
        minHeight: 260,
        overflow: "hidden",
        background: `repeating-linear-gradient(0deg, transparent 0 3px, ${ink}0d 3px 4px), ${paper}`,
        border: `1px solid ${ink}`,
      }}
    >
      {sweep && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "9%",
            background: `linear-gradient(180deg, transparent, ${ink}14, transparent)`,
            animation: "gt-sweep 5s linear infinite",
          }}
        />
      )}
    </div>
  </>
);
