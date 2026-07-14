import { useState } from "react";
import { KUI, KUI_KEYFRAMES, kuiSoft } from "../lib/kinetic";

/**
 * Kinetic UI input — floating label, soft focus ring, optional inline email
 * validation (error ring + message on an invalid address).
 * (kinetic-ui.md · [COMPONENT] Input)
 */
export const KineticInput = ({
  label = "Full name",
  validateEmail = false,
  accent = "#4B3BFF",
}: {
  /** Floating label text */
  label?: string;
  /** Validate the value as an email while typing */
  validateEmail?: boolean;
  /** Accent color (theme prop) */
  accent?: string;
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const invalid = validateEmail && value.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  const soft = kuiSoft(accent);

  return (
    <label style={{ position: "relative", display: "block", minWidth: 260, fontFamily: KUI.body }}>
      <style>{KUI_KEYFRAMES}</style>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        style={{
          width: "100%",
          padding: "16px 14px 8px",
          borderRadius: KUI.radius,
          fontSize: 14,
          outline: "none",
          background: "#fff",
          transition: "all .22s",
          color: KUI.ink,
          fontFamily: KUI.body,
          boxSizing: "border-box",
          border: invalid ? "1.5px solid #E5484D" : focused ? `1.5px solid ${accent}` : "1.5px solid #d9d6cd",
          boxShadow: invalid ? "0 0 0 4px #E5484D18" : focused ? `0 0 0 4px ${soft}` : "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 14,
          pointerEvents: "none",
          transition: "all .2s cubic-bezier(.4,0,.2,1)",
          ...(active
            ? {
                top: 7,
                fontSize: 11,
                fontWeight: 500,
                color: invalid ? "#E5484D" : focused ? accent : "#8a8a90",
              }
            : { top: 16, fontSize: 14, color: "#8a8a90" }),
        }}
      >
        {label}
      </span>
      {invalid && (
        <span
          style={{
            display: "block",
            color: "#E5484D",
            fontSize: 11.5,
            marginTop: 6,
            paddingLeft: 2,
            animation: "uk-fadein .2s",
          }}
        >
          Please enter a valid email
        </span>
      )}
    </label>
  );
};
