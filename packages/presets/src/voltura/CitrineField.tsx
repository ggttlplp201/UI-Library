import { useId } from "react";

/**
 * Voltura citrine field — the sun-baked page surface the olive panels float
 * on: grainy citrine with a soft vignette and a slow drifting light bloom.
 * Stretch it over the whole page as the backdrop layer.
 * Original set for Component Style Studio. MIT.
 */
export const CitrineField = ({
  citrine = "#d8c26a",
  vignette = 0.28,
  animate = true,
}: {
  /** Field color */
  citrine?: string;
  /** 0–1 edge vignette strength */
  vignette?: number;
  /** Drift the light bloom across the field */
  animate?: boolean;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `vtcf${uid}`;
  return (
    <>
      <style>{`
        @keyframes ${cls}-drift {
          0% { background-position: 0% 0%, 0 0, 0 0; }
          50% { background-position: 60% 20%, 0 0, 0 0; }
          100% { background-position: 0% 0%, 0 0, 0 0; }
        }
      `}</style>
      <div
        className={cls}
        style={{
          width: "100%",
          height: "100%",
          minWidth: 420,
          minHeight: 260,
          background: [
            `radial-gradient(60% 45% at 22% 12%, rgba(255,244,200,.5), transparent 70%)`,
            `radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(29,32,22,${Math.min(1, Math.max(0, vignette))}) 100%)`,
            citrine,
          ].join(", "),
          backgroundSize: "220% 220%, 100% 100%, auto",
          animation: animate ? `${cls}-drift 14s ease-in-out infinite` : undefined,
        }}
      />
    </>
  );
};
