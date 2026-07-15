/**
 * Animated Gradient Text — An animated gradient background which transitions between colors for text.
 * Ported from Magic UI (animated-gradient-text) via its shadcn-compatible registry.
 * Source: https://magicui.design/docs/components/animated-gradient-text
 * Author: @magicuidesign. License: MIT.
 */
import { type ComponentPropsWithoutRef } from "react"

import { cn } from "../lib/utils"

export interface AnimatedGradientTextProps extends ComponentPropsWithoutRef<"div"> {
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          "--bg-size": `${speed * 300}%`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        `animate-gradient inline bg-linear-to-r from-(--color-from) via-(--color-to) to-(--color-from) bg-size-[var(--bg-size)_100%] bg-clip-text text-transparent`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
