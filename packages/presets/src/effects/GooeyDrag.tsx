"use client";

import { motion } from "framer-motion";

/**
 * Gooey blob that melts into a draggable dot (SVG goo filter).
 * Ported from Skiper UI (skiper64) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

/** Mount once; defines the #SkiperGooeyFilter SVG filter. */
const SkiperGooeyFilterProvider = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0"
      version="1.1"
    >
      <defs>
        <filter id="SkiperGooeyFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="SkiperGooeyFilter"
          />
          <feBlend in="SourceGraphic" in2="SkiperGooeyFilter" />
        </filter>
      </defs>
    </svg>
  );
};

const LOGO_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const INITIAL_STATE = {
  y: 0,
  width: 50,
  height: 50,
  borderRadius: 40,
};

const ANIMATED_STATE = {
  y: -60,
  width: 200,
  height: 100,
  borderRadius: 10,
  transition: {
    ...LOGO_SPRING,
    delay: 0.15,
    y: {
      ...LOGO_SPRING,
      delay: 0,
    },
  },
};

/** Drag the elements to see the goo stretch and merge. */
export const GooeyDrag = () => {
  return (
    <div
      className="flex min-h-[260px] w-full flex-col items-center justify-center p-10"
      data-hover-demo="pointer"
    >
      <SkiperGooeyFilterProvider />
      <ul
        className="flex flex-col justify-end rounded-2xl"
        style={{
          filter: "url(#SkiperGooeyFilter)",
        }}
      >
        <motion.li
          drag
          initial={INITIAL_STATE}
          animate={ANIMATED_STATE}
          className="bg-foreground absolute"
        ></motion.li>
        <motion.li
          drag
          className="bg-foreground size-12 rounded-full"
        ></motion.li>
      </ul>
    </div>
  );
};
