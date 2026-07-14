import { useEffect, useRef } from "react";
import { KLAB } from "../lib/klab";

const CHARS = "!<>-_\\/[]{}=+*^?#________";

/**
 * Kinetic Lab text scramble — characters cycle through glyph noise and
 * resolve left-to-right on hover.
 * (kinetic-lab.md · [ANIMATION] TextScramble)
 */
export const TextScramble = ({
  text = "DECODE ME",
  accent = "#E3B23C",
}: {
  /** The string that decodes */
  text?: string;
  /** Accent color */
  accent?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => {
    if (iv.current) clearInterval(iv.current);
  }, []);
  const play = () => {
    const el = ref.current;
    if (!el) return;
    if (iv.current) clearInterval(iv.current);
    let frame = 0;
    iv.current = setInterval(() => {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
          continue;
        }
        out += i < frame / 2.2 ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame / 2.2 >= text.length && iv.current) {
        clearInterval(iv.current);
        el.textContent = text;
      }
    }, 40);
  };
  return (
    <div onMouseEnter={play} style={{ cursor: "crosshair", textAlign: "center", padding: 12 }}>
      <div
        ref={ref}
        style={{
          fontFamily: KLAB.mono,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: ".06em",
          color: accent,
          minWidth: `${text.length}ch`,
        }}
      >
        {text}
      </div>
      <div style={{ fontSize: 12, color: KLAB.faint, marginTop: 8, fontFamily: KLAB.ui }}>hover to decrypt</div>
    </div>
  );
};
