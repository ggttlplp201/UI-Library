/**
 * ToasterDemo — composed example of Toaster (shadcn/ui sonner).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/sonner — Author: shadcn. License: MIT.
 */
"use client"

import { toast } from "sonner"

import { Toaster } from "./Toaster"

export interface ToasterDemoProps {
  /** Message shown in the fired toast */
  message?: string
}

/** Button that fires a sonner toast, with the Toaster mounted alongside it. */
export function ToasterDemo({
  message = "Event has been created",
}: ToasterDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <button
        type="button"
        onClick={() =>
          toast(message, {
            description: new Date().toLocaleString(),
          })
        }
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Show toast
      </button>
      <Toaster />
    </div>
  )
}
