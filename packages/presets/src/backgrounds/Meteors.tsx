/**
 * Meteors — a meteor shower streaks diagonally across a dark field.
 * Rebuilt from scratch, inspired by Aceternity UI (meteors).
 * Inspiration: https://ui.aceternity.com/components/meteors
 * Original implementation for Component Style Studio. License: MIT.
 */

export const Meteors = ({
  count = 12,
  accent = "#94a3b8",
  background = "#0a0a12",
}: {
  /** Number of meteors (1–30) */
  count?: number;
  /** Streak color */
  accent?: string;
  /** Field background color */
  background?: string;
}) => {
  const n = Math.min(30, Math.max(1, count));
  // Deterministic pseudo-random per index so renders (and exports) are stable.
  const rand = (i: number, salt: number) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height: 220,
        borderRadius: 16,
        overflow: "hidden",
        background,
      }}
    >
      <style>{`
@keyframes ssmeteor {
  0% { transform: translate(0, 0) rotate(215deg); opacity: 0; }
  8% { opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translate(-560px, 340px) rotate(215deg); opacity: 0; }
}
`}</style>
      {Array.from({ length: n }, (_, i) => {
        const left = 10 + rand(i, 1) * 95; // start spread, mostly right half
        const top = -10 + rand(i, 2) * 60;
        const duration = 2.6 + rand(i, 3) * 3.4;
        const delay = -rand(i, 4) * 6;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 4px 1px ${accent}66`,
              transform: "rotate(215deg)",
              animation: `ssmeteor ${duration}s linear ${delay}s infinite`,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: 1,
                width: 70,
                height: 1,
                transform: "translateY(-50%)",
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                pointerEvents: "none",
              }}
            />
          </span>
        );
      })}
    </div>
  );
};
