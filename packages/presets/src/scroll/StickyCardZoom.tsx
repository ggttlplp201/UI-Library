"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Sticky cards that shrink and twist away once pinned.
 * Ported from Skiper UI (skiper34); rebound from window scroll to an internal
 * scroll container so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

// Self-contained defaults: the original lummi paths only exist in Skiper's
// own site, which rendered the whole demo as a blank panel here.
const DEFAULT_IMAGES = [
  "https://picsum.photos/seed/sticky-a/1040/680",
  "https://picsum.photos/seed/sticky-b/1040/680",
  "https://picsum.photos/seed/sticky-c/1040/680",
  "https://picsum.photos/seed/sticky-d/1040/680",
  "https://picsum.photos/seed/sticky-e/1040/680",
];

const StickyZoomCard = ({
  imgUrl,
  scroller,
}: {
  imgUrl: string;
  scroller: React.RefObject<HTMLDivElement | null>;
}) => {
  const container = useRef(null);
  // 0, not Infinity: with Infinity the [max, max+10000] input range is
  // degenerate and every card renders at scale(0) — a blank panel until the
  // first inner scroll. At 0 cards are visible immediately; isInView still
  // re-anchors the pin point once a card actually reaches the top.
  const [maxScrollY, setMaxScrollY] = useState(0);

  const filter = useMotionValue(0);
  const negateFilter = useTransform(filter, (value) => -value);

  const { scrollY } = useScroll({
    target: container,
    container: scroller,
  });
  const scale = useTransform(scrollY, [maxScrollY, maxScrollY + 10000], [1, 0]);
  const isInView = useInView(container, {
    root: scroller,
    margin: "0px 0px -90% 0px",
    once: true,
  });

  scrollY.on("change", (y) => {
    let animationValue = 1;
    if (y > maxScrollY) {
      animationValue = Math.max(0, 1 - (y - maxScrollY) / 10000);
    }

    scale.set(animationValue);
    filter.set((1 - animationValue) * 100);
  });

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={container}
      className="rounded-4xl sticky w-full max-w-4xl overflow-hidden bg-neutral-200"
      style={{
        scale: scale,
        rotate: filter,
        height: "336px",
        top: "42px",
      }}
    >
      <motion.img
        src={imgUrl}
        alt={imgUrl}
        style={{
          rotate: negateFilter,
        }}
        className="h-full w-full scale-125 object-cover"
        sizes="90vw"
      />
    </motion.div>
  );
};

/** Composed demo: scroll the panel to pin and zoom each card away. */
export const StickyCardZoom = ({
  images = DEFAULT_IMAGES,
}: {
  images?: string[];
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={scroller}
      data-hover-demo="scroll"
      className="relative h-[420px] w-[520px] max-w-full overflow-y-auto rounded-xl border border-border bg-background"
    >
      <section className="relative flex w-full flex-col items-center gap-[64px] px-4 pb-[200px] pt-[200px]">
        <div className="absolute left-1/2 top-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[24ch] text-xs uppercase leading-tight opacity-40">
            scroll down to see effect
          </span>
        </div>
        {images.map((img, idx) => (
          <StickyZoomCard key={idx} imgUrl={img} scroller={scroller} />
        ))}
      </section>
    </div>
  );
};
