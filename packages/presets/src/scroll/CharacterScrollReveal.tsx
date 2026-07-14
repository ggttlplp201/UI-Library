"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { cn } from "../lib/utils";

/**
 * Characters fly in from the sides and settle as you scroll.
 * Ported from Skiper UI (skiper31); rebound from window scroll to an internal
 * scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

export const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";

  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{
        x,
        rotateX,
      }}
    >
      {char}
    </motion.span>
  );
};

/** Composed demo: scroll the panel to pull the headline together. */
export const CharacterScrollReveal = ({
  text = "see more from gxuri",
}: {
  text?: string;
}) => {
  const scroller = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scroller,
  });

  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <div
      ref={scroller}
      data-hover-demo="scroll"
      className="h-[420px] w-[560px] max-w-full overflow-y-auto rounded-xl border border-border bg-[#f5f4f3] text-black"
    >
      <main className="w-full">
        <div className="absolute left-1/2 top-10 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40">
            Scroll to see more
          </span>
        </div>
        <div
          ref={targetRef}
          className="relative box-border flex h-[840px] items-center justify-center gap-[2%] overflow-hidden p-[2%]"
        >
          <div
            className="w-full max-w-4xl text-center text-5xl font-bold uppercase tracking-tighter text-black"
            style={{
              perspective: "500px",
            }}
          >
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
