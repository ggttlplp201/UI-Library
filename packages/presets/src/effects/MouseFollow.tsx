"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React from "react";

/**
 * Mouse-follow dots — instant and spring-smoothed variants.
 * Ported from Skiper UI (skiper61) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

const SPRING = {
  mass: 0.1, // lower mass = snappier motion; higher mass = lethargic motion
  damping: 10, // how quickly the bounce settles
  stiffness: 131, // how hard the "rubber band" pulls back
};

/** Dot that tracks the pointer 1:1 inside the panel. */
export const SimpleMouseFollow = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left);
    y.set(e.clientY - bounds.top);
  };

  return (
    <div
      onPointerMove={(e) => {
        handlePointerMove(e);
      }}
      onPointerEnter={() => {
        opacity.set(1);
      }}
      onPointerLeave={() => {
        opacity.set(0);
      }}
      data-hover-demo="pointer"
      className="rounded-4xl bg-muted size-[300px] cursor-none overflow-hidden"
    >
      <motion.div
        style={{
          x,
          y,
          opacity,
        }}
        className="rounded-4xl size-5 bg-[#999]"
      ></motion.div>
    </div>
  );
};

/** Dot that chases the pointer on a spring. */
export const SpringMouseFollow = () => {
  const xSpring = useSpring(0, SPRING);
  const ySpring = useSpring(0, SPRING);
  const opacitySpring = useSpring(0, SPRING);
  const scaleSpring = useSpring(0, SPRING);

  return (
    <div
      onPointerMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        xSpring.set(e.clientX - bounds.left);
        ySpring.set(e.clientY - bounds.top);
      }}
      onPointerEnter={() => {
        opacitySpring.set(1);
        scaleSpring.set(1);
      }}
      onPointerLeave={() => {
        opacitySpring.set(0);
        scaleSpring.set(0);
      }}
      data-hover-demo="pointer"
      className="rounded-4xl bg-muted size-[300px] overflow-hidden"
    >
      <motion.div
        style={{
          x: xSpring,
          y: ySpring,
          opacity: opacitySpring,
          scale: scaleSpring,
        }}
        className="rounded-4xl size-10 bg-orange-500"
      ></motion.div>
    </div>
  );
};
