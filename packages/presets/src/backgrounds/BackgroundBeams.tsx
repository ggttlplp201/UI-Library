/**
 * BackgroundBeams — light beams travel along curved paths over a dark field.
 * Rebuilt from scratch, inspired by Aceternity UI (background-beams).
 * Inspiration: https://ui.aceternity.com/components/background-beams
 * Original implementation for Component Style Studio. License: MIT.
 */

const PATHS = [
  "M-40 220 C 160 40, 340 400, 560 200 S 920 80, 1040 260",
  "M-40 120 C 200 260, 420 60, 640 220 S 900 320, 1040 140",
  "M-40 320 C 180 180, 380 300, 620 120 S 880 220, 1040 340",
  "M-40 40 C 220 160, 460 340, 700 160 S 940 40, 1040 200",
  "M-40 260 C 240 340, 480 140, 720 280 S 960 160, 1040 60",
];

export const BackgroundBeams = ({
  accent = "#6366f1",
  background = "#0a0a12",
  speed = 7,
}: {
  /** Beam color */
  accent?: string;
  /** Field background color */
  background?: string;
  /** Seconds per beam sweep */
  speed?: number;
}) => (
  <div
    style={{
      position: "relative",
      width: 520,
      height: 240,
      borderRadius: 16,
      overflow: "hidden",
      background,
    }}
  >
    <style>{`
@keyframes ssbeam-dash { from { stroke-dashoffset: 900; } to { stroke-dashoffset: -900; } }
`}</style>
    <svg
      viewBox="0 0 1000 380"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {PATHS.map((d, i) => (
        <path
          key={`base-${i}`}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {PATHS.map((d, i) => (
        <path
          key={`beam-${i}`}
          d={d}
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            strokeDasharray: "90 810",
            animation: `ssbeam-dash ${speed + i * 1.3}s linear infinite`,
            animationDelay: `${i * -1.7}s`,
            opacity: 0.85,
            filter: `drop-shadow(0 0 6px ${accent})`,
          }}
        />
      ))}
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(60% 80% at 50% 110%, ${accent}22, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  </div>
);
