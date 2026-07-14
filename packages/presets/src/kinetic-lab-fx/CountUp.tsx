import { useEffect, useRef } from "react";
import { KLAB, KLAB_SMALL_BTN } from "../lib/klab";

/**
 * Kinetic Lab count-up stats — numbers ease (cubic-out) from 0 on mount,
 * replayable. (kinetic-lab.md · [ANIMATION] CountUp)
 */
export const CountUp = ({
  accent = "#E3B23C",
}: {
  /** Accent color (numbers) */
  accent?: string;
}) => {
  const refs = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];
  const raf = useRef<number[]>([]);

  const animate = (el: HTMLSpanElement | null, target: number, decimals: boolean) => {
    if (!el) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      el.textContent = decimals ? v.toFixed(1) : Math.round(v).toLocaleString();
      if (p < 1) raf.current.push(requestAnimationFrame(tick));
    };
    raf.current.push(requestAnimationFrame(tick));
  };
  const run = () => {
    raf.current.forEach(cancelAnimationFrame);
    raf.current = [];
    animate(refs[0].current, 1284, false);
    animate(refs[1].current, 99.9, true);
    animate(refs[2].current, 37, false);
  };
  useEffect(() => {
    const t = setTimeout(run, 400);
    return () => {
      clearTimeout(t);
      raf.current.forEach(cancelAnimationFrame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numStyle: React.CSSProperties = {
    fontFamily: KLAB.display,
    fontWeight: 800,
    fontSize: 34,
    letterSpacing: "-.02em",
    color: accent,
  };
  const rows: [React.RefObject<HTMLSpanElement | null>, string][] = [
    [refs[0], "deploys"],
    [refs[1], "% uptime"],
    [refs[2], "regions"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 230, fontFamily: KLAB.ui }}>
      {rows.map(([ref, unit]) => (
        <div key={unit} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span ref={ref} style={numStyle}>
            0
          </span>
          <span style={{ fontSize: 12, color: KLAB.faint }}>{unit}</span>
        </div>
      ))}
      <button type="button" onClick={run} style={{ ...KLAB_SMALL_BTN, alignSelf: "flex-start", marginTop: 4 }}>
        Replay
      </button>
    </div>
  );
};
