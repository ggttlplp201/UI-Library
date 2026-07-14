import { KLAB_KEYFRAMES } from "../lib/klab";

/**
 * Kinetic Lab blob loader — a square spins while its border-radius morphs,
 * reading as a living blob. (kinetic-lab.md · [ANIMATION] BlobLoader,
 * split from "08 · Kinetic loaders")
 */
export const BlobLoader = ({
  size = 40,
  accent = "#E3B23C",
}: {
  /** Blob size in px */
  size?: number;
  /** Accent color */
  accent?: string;
}) => (
  <div
    style={{
      width: size,
      height: size,
      background: accent,
      animation: "kl-spin 3s linear infinite, kl-blob 3.5s ease-in-out infinite",
    }}
  >
    <style>{KLAB_KEYFRAMES}</style>
  </div>
);
