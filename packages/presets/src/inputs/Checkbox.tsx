/**
 * Checkbox — 
 * Ported from shadcn/ui (checkbox) via its shadcn-compatible registry.
 * Source: https://ui.shadcn.com/docs/components/checkbox
 * Author: shadcn. License: MIT.
 * (forwardRef unwrapped for the Studio’s AST edit engine — no other change.)
 */
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../lib/utils"

const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
