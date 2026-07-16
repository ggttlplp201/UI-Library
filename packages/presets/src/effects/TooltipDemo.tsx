/**
 * TooltipDemo — composed example of Tooltip (Skiper UI border-arrow tooltip).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://skiper-ui.com — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */
"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./BorderArrowTooltip"

export interface TooltipDemoProps {
  /** Label of the button that triggers the tooltip */
  label?: string
  /** Text shown inside the tooltip */
  tip?: string
}

/** Button that reveals a border-arrow tooltip on hover. */
export function TooltipDemo({
  label = "Hover me",
  tip = "Add to library",
}: TooltipDemoProps) {
  return (
    <div className="flex items-center justify-center p-10" data-hover-demo="pointer">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            {label}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
