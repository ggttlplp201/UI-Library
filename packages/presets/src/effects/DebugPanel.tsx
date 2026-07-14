"use client";

import { useMotionValue } from "framer-motion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "../lib/utils";

/**
 * Live debug readout that renders motion values without re-rendering.
 * Ported from Skiper UI (skiper102) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

/** Composed demo: move the mouse / click / press keys and watch the panel. */
export const CursorDebugPanel = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [count, setCount] = useState(0);

  const [keyPressed, setKeyPressed] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPressed(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      onClick={() => setCount((prev) => prev + 1)}
      data-hover-demo="pointer"
      className="flex min-h-[160px] min-w-[240px] flex-col items-center justify-center rounded-xl border border-border bg-background p-6"
    >
      <DebugPanel
        className=""
        count={count}
        mouseX={mouseX}
        mouseY={mouseY}
        keyPressed={keyPressed}
      />
    </div>
  );
};

/** Renders every prop as a live `key: value;` line (motion values update live). */
export const DebugPanel = ({
  className,
  ...props
}: Record<string, unknown> & { className?: string }) => {
  return (
    <div
      className={cn(
        "z-99 left-4 top-4 font-mono text-sm text-red-500",
        className,
      )}
    >
      {"{"}

      {Object.entries(props).map(([key, value]) => (
        <div key={key} className="ml-4">
          {key}:{" "}
          {value && typeof value === "object" && "get" in value ? (
            <motion.span>{value as never}</motion.span>
          ) : typeof value === "boolean" ? (
            value ? (
              "true"
            ) : (
              "false"
            )
          ) : (
            String(value)
          )}
          ;
        </div>
      ))}
      {"}"}
    </div>
  );
};
