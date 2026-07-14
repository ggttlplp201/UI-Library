import { useEffect, useRef } from "react";
import { KLAB, KLAB_KEYFRAMES, KLAB_SMALL_BTN } from "../lib/klab";

/**
 * Kinetic Lab typewriter — types the string with randomized per-keystroke
 * delays (a human pace) and a blinking caret; replayable.
 * (kinetic-lab.md · [ANIMATION] Typewriter)
 */
export const Typewriter = ({
  text = "KINETIC MOTION",
  accent = "#E3B23C",
}: {
  /** The line to type */
  text?: string;
  /** Accent color (text + caret) */
  accent?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const el = ref.current;
    if (!el) return;
    el.textContent = "";
    let t = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      t += ch === " " ? 90 + Math.random() * 120 : 45 + Math.random() * 165;
      timers.current.push(setTimeout(() => {
        el.textContent += ch;
      }, t));
    }
  };
  useEffect(() => {
    const t = setTimeout(play, 500);
    return () => {
      clearTimeout(t);
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontFamily: KLAB.ui }}>
      <style>{KLAB_KEYFRAMES}</style>
      <div
        style={{
          fontFamily: KLAB.mono,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: ".02em",
          color: accent,
          minHeight: 34,
          display: "flex",
          alignItems: "center",
          minWidth: `${text.length + 1}ch`,
          justifyContent: "center",
        }}
      >
        <span ref={ref} />
        <span
          style={{
            display: "inline-block",
            width: 11,
            height: 26,
            background: accent,
            marginLeft: 3,
            animation: "kl-blink 1s steps(1) infinite",
          }}
        />
      </div>
      <button type="button" onClick={play} style={KLAB_SMALL_BTN}>
        Replay
      </button>
    </div>
  );
};
