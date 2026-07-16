/**
 * PopoverDemo — composed example of Popover (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/popover — Author: shadcn. License: MIT.
 */
"use client"

import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

export interface PopoverDemoProps {
  /** Label of the button that opens the popover */
  triggerLabel?: string
  /** Popover heading */
  heading?: string
  /** Short body text under the heading */
  text?: string
}

/** Trigger button that opens a popover with a heading and short supporting text. */
export function PopoverDemo({
  triggerLabel = "Open popover",
  heading = "Dimensions",
  text = "Set the dimensions for the layer. Values are kept in sync with the canvas.",
}: PopoverDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Popover>
        <PopoverTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          {triggerLabel}
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{heading}</h4>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
