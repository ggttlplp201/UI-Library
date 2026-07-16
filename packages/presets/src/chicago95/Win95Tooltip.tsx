import { C95 } from "./lib95";

/**
 * Chicago 95 tooltip — the classic yellow info strip with a hard 1px ink
 * frame, paired with its hover target. Original set for Component Style
 * Studio, inspired by mid-90s desktop chrome. MIT.
 */
export const Win95Tooltip = ({
  target = "hover me",
  tip = "Displays helpful information.",
}: {
  /** Underlined hover target text */
  target?: string;
  /** Tooltip text */
  tip?: string;
}) => (
  <>
    <style>{`
      .c95-tip-wrap .c95-tip { display: none; }
      .c95-tip-wrap:hover .c95-tip { display: inline-block; }
    `}</style>
    <span className="c95-tip-wrap" style={{ position: "relative", fontFamily: C95.font, fontSize: 12, display: "inline-block", padding: "2px 2px 26px 2px" }}>
      <span style={{ color: C95.ink, borderBottom: `1px dotted ${C95.ink}`, cursor: "help" }}>{target}</span>
      <span
        className="c95-tip"
        style={{
          position: "absolute",
          top: "1.7em",
          left: 0,
          whiteSpace: "nowrap",
          background: "#ffffe1",
          border: `1px solid ${C95.ink}`,
          padding: "2px 6px",
          fontSize: 11,
          color: C95.ink,
        }}
      >
        {tip}
      </span>
    </span>
  </>
);
