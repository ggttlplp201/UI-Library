"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Four-column parallax image wall — columns drift at different speeds.
 * Ported from Skiper UI (skiper30), inspired by siena.film; rebound from
 * window scroll (lenis) to an internal scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

const DEFAULT_IMAGES = [
  "/images/lummi/img15.jpg",
  "/images/lummi/img21.jpg",
  "/images/lummi/img3.jpg",
  "/images/lummi/img4.jpg",
  "/images/lummi/img5.jpg",
  "/images/lummi/img6.jpg",
  "/images/lummi/img7.jpg",
  "/images/lummi/img8.jpg",
  "/images/lummi/img24.jpg",
];

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[110px] flex-col gap-[2%] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full shrink-0 overflow-hidden rounded-lg">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none w-full object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
};

/** Composed demo: scroll the panel and watch the columns drift apart. */
export const ParallaxColumns = ({
  images = DEFAULT_IMAGES,
}: {
  images?: string[];
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const panelHeight = 420;

  const { scrollYProgress } = useScroll({
    target: gallery,
    container: scroller,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, panelHeight * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, panelHeight * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, panelHeight * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, panelHeight * 3]);

  // Wrap around however many photos were supplied, so uploading fewer than
  // the nine defaults still fills all four columns.
  const pool = images.length > 0 ? images : DEFAULT_IMAGES;
  const pick = (i: number) => pool[i % pool.length];

  return (
    <div
      ref={scroller}
      data-hover-demo="scroll"
      className="h-[420px] w-[560px] max-w-full overflow-y-auto rounded-xl border border-border bg-[#eee] text-black"
    >
      <main className="w-full">
        <div className="relative flex h-[420px] items-center justify-center gap-2">
          <span className="max-w-[12ch] text-center text-xs uppercase leading-tight opacity-40">
            scroll down to see
          </span>
        </div>

        <div
          ref={gallery}
          className="relative box-border flex h-[740px] gap-[2%] overflow-hidden bg-white p-[2%]"
        >
          <Column images={[pick(0), pick(1), pick(2)]} y={y} />
          <Column images={[pick(3), pick(4), pick(5)]} y={y2} />
          <Column images={[pick(6), pick(7), pick(8)]} y={y3} />
          <Column images={[pick(6), pick(7), pick(8)]} y={y4} />
        </div>
        <div className="relative flex h-[420px] items-center justify-center gap-2">
          <span className="max-w-[12ch] text-center text-xs uppercase leading-tight opacity-40">
            scroll up to see
          </span>
        </div>
      </main>
    </div>
  );
};
