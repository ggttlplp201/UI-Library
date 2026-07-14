import { useState } from "react";
import { KUI, KUI_KEYFRAMES } from "../lib/kinetic";

const AV_COLORS = ["#4B3BFF", "#12A150", "#E08600", "#E5484D"];

/**
 * Kinetic UI avatar stack — overlapping avatars spread apart on hover, plus
 * an online-status avatar (pulsing dot) and a shimmer skeleton.
 * (kinetic-ui.md · [COMPONENT] AvatarStack)
 */
export const KineticAvatarStack = ({
  initials = "AL, MK, JD, +5",
  showStatus = true,
  showSkeleton = true,
}: {
  /** Comma-separated avatar initials */
  initials?: string;
  /** Show the online-status avatar with pulsing dot */
  showStatus?: boolean;
  /** Show the shimmer loading skeleton */
  showSkeleton?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const items = initials.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34, flexWrap: "wrap", fontFamily: KUI.body }}>
      <style>{KUI_KEYFRAMES}</style>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: "flex", cursor: "pointer" }}
      >
        {items.map((txt, i) => (
          <div
            key={`${txt}-${i}`}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "3px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
              color: "#fff",
              background: AV_COLORS[i % AV_COLORS.length],
              marginLeft: i === 0 ? 0 : hover ? 6 : -14,
              transition: `margin-left .3s ${KUI.spring}`,
              boxShadow: "0 2px 6px rgba(0,0,0,.14)",
              boxSizing: "border-box",
            }}
          >
            {txt}
          </div>
        ))}
      </div>
      {showStatus && (
        <div style={{ position: "relative", width: 52, height: 52 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#4B3BFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            RS
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#12A150",
              border: "2.5px solid #fff",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#12A150",
              animation: "uk-ring 2s ease-out infinite",
            }}
          />
        </div>
      )}
      {showSkeleton && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(100deg,#EDEBE4 25%,#f6f5f0 37%,#EDEBE4 63%)",
            backgroundSize: "400% 100%",
            animation: "uk-shimmer 1.4s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};
