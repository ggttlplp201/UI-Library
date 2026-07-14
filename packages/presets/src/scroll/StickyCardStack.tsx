"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-driven sticky card stack — cards pile up and shrink as you scroll.
 * Ported from Skiper UI (skiper16); rebound from window scroll to an internal
 * scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

const DEFAULT_PROJECTS = [
  { title: "Project 1", src: "/images/lummi/img8.jpg" },
  { title: "Project 2", src: "/images/lummi/img14.jpg" },
  { title: "Project 3", src: "/images/lummi/img10.jpg" },
  { title: "Project 4", src: "/images/lummi/img15.jpg" },
  { title: "Project 5", src: "/images/lummi/img12.jpg" },
];

export const StickyCard_001 = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `${i * 14 + 40}px`,
        }}
        className="rounded-4xl relative flex h-[240px] w-[400px] origin-top flex-col overflow-hidden"
      >
        <img src={src} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

/** Composed demo: scroll the panel to stack the cards. */
export const StickyCardStack = ({
  projects = DEFAULT_PROJECTS,
}: {
  projects?: { title: string; src: string }[];
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    container: scroller,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={scroller}
      data-hover-demo="scroll"
      className="h-[420px] w-[520px] max-w-full overflow-y-auto rounded-xl border border-border bg-background"
    >
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[600px] pt-[180px]"
      >
        <div className="absolute left-1/2 top-[40px] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[24ch] text-xs uppercase leading-tight opacity-40">
            scroll down to see card stack
          </span>
        </div>
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </div>
  );
};
