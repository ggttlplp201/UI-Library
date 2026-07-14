"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Ticker that cycles through phrases on a timer (useLoop hook).
 * Ported from Skiper UI (skiper62) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

export const useLoop = (delay = 1000) => {
  const [key, setKey] = useState(0);

  const incrementKey = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(incrementKey, delay);
    return () => clearInterval(interval);
  }, [delay, incrementKey]);

  return { key };
};

/** Rolling text ticker driven by useLoop. */
export const LoopText = ({
  /** Phrases to cycle through */
  items,
  /** Milliseconds between ticks */
  delay = 1000,
}: {
  items?: string[];
  delay?: number;
}) => {
  const { key } = useLoop(delay);

  const array = useMemo(
    () =>
      items ?? [
        "Tik-Tik uno",
        "Tik-Tik dos",
        "Tik-Tik tres",
        "Tik-Tik cuatro",
        "Tik-Tik cinco",
        "Tik-Tik seis",
        "Tik-Tik siete",
        "Tik-Tik ocho",
        "Tik-Tik nueve",
        "Tik-Tik diez",
      ],
    [items],
  );

  const currentItem = useMemo(() => {
    return array[key % array.length];
  }, [array, key]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden p-4 text-2xl font-medium">
      <AnimatePresence mode="popLayout">
        <motion.h1
          key={key}
          initial={{ opacity: 0, y: " 100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.3 }}
          className="whitespace-nowrap text-center"
        >
          {currentItem}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
