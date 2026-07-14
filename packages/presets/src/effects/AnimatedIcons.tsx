"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "../lib/utils";

/**
 * Micro-interaction icon tiles: arrow grows a tail on hover, hamburger
 * morphs to an X, volume rocks and strikes through when muted.
 * Ported from Skiper UI (skiper99) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

const tile =
  "size-22 rounded-3xl border border-border bg-background";

/** Chevron that grows an arrow tail on hover. */
export const ArrowHoverIcon = ({ className }: { className?: string }) => {
  return (
    <div
      data-hover-demo="hover"
      className={cn(
        tile,
        "group flex cursor-pointer items-center justify-center",
        className,
      )}
    >
      <div className="relative grid cursor-pointer items-center justify-center">
        <ChevronRight className="transition-all duration-500 ease-out group-hover:translate-x-0.5" />
        <div className="absolute right-[9px] h-[2px] w-3 origin-right scale-x-0 rounded-[1px] bg-current transition-all duration-300 ease-out group-hover:right-[7px] group-hover:scale-x-100"></div>
      </div>
    </div>
  );
};

/** Hamburger that morphs into an X on click. */
export const MenuToggleIcon = ({ className }: { className?: string }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div
      onClick={() => setToggle((x) => !x)}
      data-hover-demo="click"
      className={cn(
        tile,
        "group flex cursor-pointer items-center justify-center",
        className,
      )}
    >
      <div className="relative grid size-4 cursor-pointer items-center justify-center">
        <motion.div
          animate={{ y: toggle ? 0 : "-5px", rotate: toggle ? 45 : 0 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        ></motion.div>
        <motion.div
          animate={{ opacity: toggle ? 0 : 1 }}
          transition={{ duration: 0.1 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        ></motion.div>
        <motion.div
          animate={{ y: toggle ? 0 : "5px", rotate: toggle ? -45 : 0 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        ></motion.div>
      </div>
    </div>
  );
};

/** Speaker that rocks and gets a strike-through when muted. */
export const VolumeToggleIcon = ({ className }: { className?: string }) => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div
      onClick={() => setIsMuted((x) => !x)}
      data-hover-demo="click"
      className={cn(
        tile,
        "group flex cursor-pointer items-center justify-center",
        className,
      )}
    >
      <motion.div
        initial={false}
        className="relative flex size-5 items-center justify-center"
        animate={{
          rotate: isMuted ? [0, -15, 5, -2, 0] : "none",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            stroke="none"
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
          />

          <motion.g>
            <path
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              d="M16 9a5 5 0 0 1 0 6"
            />
            <path
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              d="M19.364 18.364a9 9 0 0 0 0-12.728"
            />
          </motion.g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rotate-[-40deg] overflow-hidden">
            <motion.div
              animate={{ scaleY: isMuted ? 1 : 0 }}
              transition={{
                ease: "easeInOut",
                duration: isMuted ? 0.125 : 0.05,
                delay: isMuted ? 0.15 : 0,
              }}
              style={{
                transformOrigin: "top",
              }}
              className="h-[18px] w-fit rounded-full"
            >
              <div className="bg-background flex h-full w-[3.5px] items-center justify-center rounded-full">
                <div className="bg-foreground h-full w-[1.5px] rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
