"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "../lib/utils";

const STAGGER = 0.035;

/**
 * Per-letter rolling text reveal on hover.
 * Ported from Skiper UI (skiper58) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */
export const TextRoll: React.FC<{
  /** Text to roll, one letter at a time */
  children?: string;
  className?: string;
  /** Stagger outward from the middle letter instead of left-to-right */
  center?: boolean;
}> = ({ children = "Components", className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      data-hover-demo="pointer"
      className={cn(
        "relative block cursor-pointer overflow-hidden text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em]",
        className,
      )}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};
