"use client";

import NumberFlow from "@number-flow/react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

import { cn } from "../lib/utils";

/**
 * Draggable scroll-progress ring with a live percentage readout.
 * Ported from Skiper UI (skiper89); rebound from window scroll to an internal
 * scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */
export const ScrollProgressCircle = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [progressPercent, setProgressPercent] = useState(0);

  const clampedProgress = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const progressAsPercent = useTransform(clampedProgress, (value) =>
    Math.round(value * 100),
  );

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value);
  });

  const svgRadius = 18;
  const circumference = 2 * Math.PI * svgRadius;

  return (
    <div
      className="relative h-[420px] w-[480px] max-w-full overflow-hidden rounded-xl border border-border bg-background"
      data-hover-demo="scroll"
    >
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto"
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center gap-[8vh] px-4 py-24",
          )}
        >
          <div className="grid content-start justify-items-center gap-6 text-center">
            <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
              see the progress while scroll
            </span>
          </div>

          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "text-foreground/70 flex items-center justify-center px-4 text-justify text-sm leading-relaxed",
              )}
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Repellendus, fugiat sint eos itaque soluta provident voluptatibus
              mollitia? Quas sit excepturi minima at id nihil consectetur
              libero, eligendi dicta molestias itaque delectus ullam facilis
              omnis voluptatibus hic mollitia deleniti sed earum voluptates
              reprehenderit commodi porro assumenda eum! Doloremque est quasi
              temporibus!
            </div>
          ))}
        </div>
      </div>

      <motion.div
        drag
        dragMomentum={false}
        className={cn(
          "group absolute bottom-4 right-4 cursor-grab items-center gap-1 active:cursor-grabbing",
        )}
      >
        <NumberFlow
          value={progressPercent}
          className={cn(
            "text-foreground/40 absolute top-1 flex h-8 -translate-y-full items-center justify-center px-4 text-xs font-medium tabular-nums opacity-0 group-hover:opacity-100",
          )}
          suffix="%"
        />
        <div className="bg-background/30 flex size-12 items-center justify-center rounded-2xl border backdrop-blur">
          <svg
            className={cn("size-10")}
            viewBox="0 0 48 48"
            role="presentation"
          >
            <circle
              cx="24"
              cy="24"
              r={svgRadius}
              stroke="currentColor"
              strokeWidth="3"
              className={cn("opacity-30")}
              fill="none"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={svgRadius}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              style={{
                pathLength: clampedProgress,
                rotate: -90,
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
