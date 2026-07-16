/**
 * ScrollAreaDemo — composed example of ScrollArea (shadcn/ui, adapted to @base-ui/react).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/scroll-area — Author: shadcn. License: MIT.
 */
"use client"

import { ScrollArea } from "../lib/scroll-area"

export interface ScrollAreaDemoProps {
  /** Heading shown above the list */
  heading?: string
  /** Number of list rows to generate (enough to overflow the fixed height) */
  count?: number
}

/** Fixed-height scroll area filled with a list of version rows. */
export function ScrollAreaDemo({
  heading = "Tags",
  count = 25,
}: ScrollAreaDemoProps) {
  const tags = Array.from({ length: count }, (_, i) => `v1.2.0-beta.${count - i}`)

  return (
    <div className="flex items-center justify-center p-8">
      <ScrollArea className="h-72 w-56 rounded-md border bg-background">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none text-foreground">
            {heading}
          </h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className="py-2 text-sm text-foreground">{tag}</div>
              <div className="h-px bg-border" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
