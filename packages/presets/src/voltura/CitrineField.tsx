/**
 * Voltura citrine field — the sun-baked page surface the olive panels float
 * on: grainy citrine with a soft vignette. Stretch it over the whole page.
 * Original set for Component Style Studio, inspired by dark-luxe trading
 * workspaces. MIT.
 */
export const CitrineField = ({
  citrine = "#d8c26a",
  vignette = 0.28,
}: {
  /** Field color */
  citrine?: string;
  /** 0–1 edge vignette strength */
  vignette?: number;
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      minWidth: 420,
      minHeight: 260,
      background: [
        `radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(29,32,22,${Math.min(1, Math.max(0, vignette))}) 100%)`,
        `radial-gradient(60% 45% at 22% 12%, rgba(255,244,200,.5), transparent 70%)`,
        citrine,
      ].join(", "),
    }}
  />
);
