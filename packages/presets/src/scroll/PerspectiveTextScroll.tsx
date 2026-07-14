"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * Star-Wars-style perspective text crawl driven by scroll.
 * Ported from Skiper UI (skiper28); rebound from window scroll to an internal
 * scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */
export const PerspectiveTextScroll = ({
  text = `Jatt seeweyan cho langheya chudail takkri jaani badi sohni bhoot
female takkri .. kehndi jatta .. oye jatta.... kehndi jatta .. metho
darke ho ja katha .. nai tan aah kar du ... nai tan waah kardu...
tenu ethe khade khade nu swah kardu ... jatt kehnda hor menu ki
chahida ... jatt kehnda hor menu ki chahida .. avein gallan-baatan
vich bohta sama na gva aaja chimbad ja ... mein keha chimbad ja .. .
aaja chimbad ja ... mein keha chimbad ja .. .`,
}: {
  text?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
  });

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [487, 0]);
  const transform = useMotionTemplate`rotateX(30deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <div
      ref={containerRef}
      data-hover-demo="scroll"
      className="h-[420px] w-[560px] max-w-full overflow-y-auto rounded-xl border border-border bg-[#f5f4f3] text-black"
    >
      <div ref={targetRef} className="relative z-0 h-[300%] w-full">
        <div className="absolute left-1/2 top-[4%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40">
            scroll down to see
          </span>
        </div>
        <div
          className="sticky top-0 mx-auto flex items-center justify-center bg-transparent py-20"
          style={{
            transformStyle: "preserve-3d",
            perspective: "200px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-4xl text-center text-4xl font-bold tracking-tighter text-[#ff5800]"
          >
            {text}
            <div className="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-b from-transparent to-white" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
