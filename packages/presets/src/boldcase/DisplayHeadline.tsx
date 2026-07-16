import { BOLD, BOLD_FONT_IMPORT } from "./libBold";

/**
 * Boldcase display headline — poster-scale grotesk with one word popped in
 * an accent plate. Original set for Component Style Studio, inspired by
 * studio-editorial bento systems. MIT.
 */
export const DisplayHeadline = ({
  text = "MAKE IT LOUD",
  size = 72,
  popWord = 2,
  popColor = "#f91814",
  ink = "#181511",
}: {
  /** Headline text */
  text?: string;
  /** Font size in px */
  size?: number;
  /** Which word gets the accent plate (0-based, -1 none) */
  popWord?: number;
  /** Accent plate color */
  popColor?: string;
  /** Ink color */
  ink?: string;
}) => {
  const words = text.split(" ");
  return (
    <>
      <style>{BOLD_FONT_IMPORT}</style>
      <h2
        style={{
          margin: 0,
          fontFamily: BOLD.display,
          fontSize: size,
          lineHeight: 0.98,
          letterSpacing: "-.015em",
          color: ink,
          textTransform: "uppercase",
        }}
      >
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              marginRight: ".22em",
              ...(i === popWord
                ? {
                    background: popColor,
                    color: "#fff",
                    padding: "0 .1em",
                    border: `3px solid ${ink}`,
                    boxShadow: `6px 6px 0 0 ${ink}`,
                    transform: "rotate(-1.5deg)",
                  }
                : {}),
            }}
          >
            {w}
          </span>
        ))}
      </h2>
    </>
  );
};
