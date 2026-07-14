import { useState } from "react";
import { KUI } from "../lib/kinetic";

/**
 * Kinetic UI accordion — single-open expand/collapse via max-height with a
 * rotating chevron. (kinetic-ui.md · [COMPONENT] Accordion)
 */
export const KineticAccordion = ({
  q1 = "What is Kinetic UI?",
  a1 = "A single-file, animation-first component set. Every element ships with tuned easing curves and interaction states out of the box.",
  q2 = "How are the animations built?",
  a2 = "Pure CSS transitions and keyframes with spring-style cubic-bezier curves — no animation libraries, no runtime overhead.",
  q3 = "Can I change the accent color?",
  a3 = "Yes — open the Tweaks panel to swap the accent, toggle state labels, or show code by default across the whole kit.",
}: {
  q1?: string;
  a1?: string;
  q2?: string;
  a2?: string;
  q3?: string;
  a3?: string;
}) => {
  const [open, setOpen] = useState(0);
  const rows = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
  ];
  return (
    <div style={{ minWidth: 460, fontFamily: KUI.body, color: KUI.ink }}>
      {rows.map((row, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${KUI.hairline}` }}>
          <button
            type="button"
            onClick={() => setOpen((cur) => (cur === i ? -1 : i))}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "16px 2px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14.5,
              fontWeight: 600,
              color: KUI.ink,
              textAlign: "left",
              fontFamily: KUI.body,
            }}
          >
            {row.q}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: `transform .3s ${KUI.spring}`,
                flexShrink: 0,
                color: "#8a8a90",
                transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div
            style={{
              overflow: "hidden",
              transition: "max-height .4s cubic-bezier(.4,0,.2,1), opacity .3s",
              maxHeight: open === i ? 160 : 0,
              opacity: open === i ? 1 : 0,
            }}
          >
            <p style={{ margin: 0, padding: "0 2px 18px", fontSize: 13.5, lineHeight: 1.65, color: KUI.muted }}>
              {row.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
