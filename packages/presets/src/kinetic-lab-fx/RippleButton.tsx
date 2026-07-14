import { KLAB, KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab ripple — an ink ripple spawns at the exact click point and
 * expands (scale(0)→scale(4)) while fading.
 * (kinetic-lab.md · [ANIMATION] Ripple)
 */
export const RippleButton = ({
  label = "Tap anywhere",
}: {
  /** Button text */
  label?: string;
}) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2;
    const s = document.createElement("span");
    s.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${d}px;height:${d}px;margin-left:${-d / 2}px;margin-top:${-d / 2}px;border-radius:50%;background:rgba(255,255,255,.4);pointer-events:none;transform:scale(0);animation:kl-ripple .6s ease-out forwards`;
    t.appendChild(s);
    setTimeout(() => s.remove(), 640);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "16px 32px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,.14)",
        background: "rgba(255,255,255,.05)",
        color: KLAB.text,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: KLAB.ui,
      }}
    >
      <style>{KLAB_KEYFRAMES}</style>
      {label}
    </button>
  );
};
