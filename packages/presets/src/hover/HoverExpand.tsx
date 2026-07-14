"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "../lib/utils";

/**
 * Hover-to-expand image strips.
 * Ported from Skiper UI (skiper52/skiper53). Illustrations by AarzooAly (https://x.com/AarzooAly).
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

type HoverImage = { src: string; alt: string; code: string };

const DEFAULT_IMAGES: HoverImage[] = [
  { src: "/images/x.com/13.jpg", alt: "Illustration by AarzooAly", code: "# 01" },
  { src: "/images/x.com/32.jpg", alt: "Illustration by AarzooAly", code: "# 02" },
  { src: "/images/x.com/20.jpg", alt: "Illustration by AarzooAly", code: "# 03" },
  { src: "/images/x.com/21.jpg", alt: "Illustration by AarzooAly", code: "# 04" },
  { src: "/images/x.com/19.jpg", alt: "Illustration by AarzooAly", code: "# 05" },
  { src: "/images/x.com/1.jpg", alt: "Illustration by AarzooAly", code: "# 06" },
  { src: "/images/x.com/2.jpg", alt: "Illustration by AarzooAly", code: "# 07" },
];

/** Horizontal strip — the hovered image expands to a square. */
export const HoverExpand_001 = ({
  images = DEFAULT_IMAGES,
  className,
}: {
  images?: HoverImage[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      data-hover-demo="pointer"
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ width: "2.5rem", height: "20rem" }}
              animate={{
                width: activeImage === index ? "24rem" : "5rem",
                height: activeImage === index ? "24rem" : "24rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end p-4"
                  >
                    <p className="text-left text-xs text-white/50">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/** Vertical accordion — the hovered row expands open. */
export const HoverExpand_002 = ({
  images = DEFAULT_IMAGES.slice(0, 6),
  className,
}: {
  images?: HoverImage[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      data-hover-demo="pointer"
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full flex-col items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ height: "2.5rem", width: "24rem" }}
              animate={{
                height: activeImage === index ? "24rem" : "2.5rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/50 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end px-4 pb-5"
                  >
                    <p className="text-left text-xs text-white/50">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
