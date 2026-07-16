import { useState } from "react";
import { C95, bevelIn } from "./lib95";

/**
 * Chicago 95 checkbox — sunken white well with a hard black check.
 * Original set for Component Style Studio, inspired by mid-90s desktop
 * chrome. MIT.
 */
export const Win95Checkbox = ({
  label = "Show icons on desktop",
  defaultChecked = true,
}: {
  /** Row label */
  label?: string;
  /** Initial state */
  defaultChecked?: boolean;
}) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: C95.font,
        fontSize: 12,
        color: C95.ink,
      }}
    >
      <span
        style={{
          ...bevelIn,
          width: 15,
          height: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 900,
          lineHeight: 1,
          boxSizing: "border-box",
        }}
      >
        {on ? "✓" : ""}
      </span>
      {label}
    </button>
  );
};
