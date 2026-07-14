import { useEffect, useRef } from "react";
import { KLAB, KLAB_SMALL_BTN } from "../lib/klab";

/**
 * Kinetic Lab stagger reveal — list rows cascade in (Web Animations API),
 * replayable; rows nudge right on hover.
 * (kinetic-lab.md · [ANIMATION] StaggerReveal)
 */
export const StaggerReveal = ({
  rows = "Provisioning cluster, Deploying containers, Routing traffic, Warming cache",
  accent = "#E3B23C",
}: {
  /** Comma-separated row labels */
  rows?: string;
  /** Accent color (dots + hover border) */
  accent?: string;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const items = rows.split(",").map((r) => r.trim()).filter(Boolean);

  const play = () => {
    const c = container.current;
    if (!c) return;
    Array.from(c.children).forEach((ch, i) => {
      (ch as HTMLElement).animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 500, delay: i * 90, easing: "cubic-bezier(.2,.8,.3,1)", fill: "backwards" },
      );
    });
  };
  useEffect(() => {
    const t = setTimeout(play, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, minWidth: 250, fontFamily: KLAB.ui }}>
      <style>{`
.kl-reveal-row{transition:transform .2s,border-color .2s}
.kl-reveal-row:hover{transform:translateX(6px);border-color:color-mix(in srgb, var(--kacc) 50%, transparent) !important}
`}</style>
      <div ref={container} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map((label) => (
          <div
            key={label}
            className="kl-reveal-row"
            style={{
              ["--kacc" as string]: accent,
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "11px 13px",
              borderRadius: 11,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.07)",
              cursor: "pointer",
              color: KLAB.text,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={play} style={{ ...KLAB_SMALL_BTN, alignSelf: "flex-start", marginTop: 4 }}>
        Replay
      </button>
    </div>
  );
};
