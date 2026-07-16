import { useState } from "react";
import { C95, bevelIn, bevelOut } from "./lib95";

/**
 * Chicago 95 button — the classic raised chrome slab that sinks flush while
 * pressed. Original set for Component Style Studio, inspired by mid-90s
 * desktop chrome. MIT.
 */
export const Win95Button = ({
  label = "OK",
  defaultButton = false,
}: {
  /** Button label */
  label?: string;
  /** Draw the default-action focus ring */
  defaultButton?: boolean;
}) => {
  const [down, setDown] = useState(false);
  return (
    <button
      type="button"
      data-link-slot="button"
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      style={{
        ...(down ? { ...bevelIn, background: C95.chrome } : bevelOut),
        minWidth: 88,
        padding: down ? "7px 14px 5px 16px" : "6px 15px",
        fontFamily: C95.font,
        fontSize: 12,
        color: C95.ink,
        cursor: "pointer",
        outline: defaultButton ? `1px dotted ${C95.ink}` : "none",
        outlineOffset: -5,
      }}
    >
      {label}
    </button>
  );
};
