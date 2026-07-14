"use client";

import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Animated number displays built on Number Flow + Framer Motion.
 * Ported from Skiper UI (skiper37), design inspired by https://number-flow.barvian.me/.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

/** Countdown timer with animated digits and pause/reset controls. */
export const AnimatedNumberCountdown = ({
  /** Seconds to count down from */
  from = 60,
}: {
  from?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      setCount((c) => (c === 0 ? from : c - 1));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [isPaused, from]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-6 text-foreground"
      data-hover-demo="click"
    >
      <div className="text-7xl font-semibold tracking-tight">
        <NumberFlow value={count} prefix="0:" />
      </div>
      <div className="flex w-fit items-center gap-2">
        <motion.button
          aria-label="Pause timer"
          onClick={() => setIsPaused((p) => !p)}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff3828] transition-colors"
        >
          <AnimatePresence initial={false} mode="wait">
            {isPaused ? (
              <motion.svg
                key="play"
                initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                transition={{ duration: 0.1 }}
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current text-white"
              >
                <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="pause"
                initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                transition={{ duration: 0.1 }}
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current text-white"
              >
                <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
        <button
          aria-label="Reset timer"
          onClick={() => setCount(from)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#ff3828] transition-colors hover:bg-black/10"
        >
          <Plus className="rotate-45" />
        </button>
      </div>
    </div>
  );
};

/** Spring-eased count-up that replays when it re-enters the viewport. */
export const AnimatedNumberSpring = ({
  /** Value to count up to */
  to = 500,
}: {
  to?: number;
}) => {
  const [displaySubs, setDisplaySubs] = useState(0);

  const springSubCount = useSpring(0, {
    bounce: 0,
    duration: 1000,
  });

  springSubCount.on("change", (value) => {
    setDisplaySubs(Math.round(value));
  });

  return (
    <motion.div
      onViewportEnter={() => springSubCount.set(to)}
      onViewportLeave={() => springSubCount.set(0)}
      className="p-4 text-7xl font-semibold tracking-tight text-foreground"
      data-hover-demo="replay"
    >
      {displaySubs}
    </motion.div>
  );
};

/** Slot-machine style random ticker that settles on the target value. */
export const AnimatedNumberTicker = ({
  /** Value to settle on */
  value = 2146000,
}: {
  value?: number;
}) => {
  const [displayNumber, setDisplayNumber] = useState(Math.round(value / 2));
  const [isAnimating, setIsAnimating] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const animate = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const start = Math.round(value / 2);
    const steps = 12;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        const min = start + currentStep * (start / steps);
        const max = value + start / 10;
        const randomNum = Math.floor(min + Math.random() * (max - min));
        setDisplayNumber(randomNum);
      } else {
        setDisplayNumber(value);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 80);
  };

  return (
    <motion.div
      onViewportEnter={animate}
      className="p-4 text-6xl font-semibold tracking-tight text-foreground"
      data-hover-demo="replay"
    >
      ${formatNumber(displayNumber)}
    </motion.div>
  );
};
