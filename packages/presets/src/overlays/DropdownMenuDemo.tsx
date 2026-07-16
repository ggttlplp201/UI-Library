/**
 * DropdownMenuDemo — composed example of DropdownMenu (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/dropdown-menu — Author: shadcn. License: MIT.
 */
"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./DropdownMenu"

export interface DropdownMenuDemoProps {
  /** Label of the button that opens the menu */
  triggerLabel?: string
  /** Heading shown at the top of the menu */
  menuLabel?: string
}

/** Trigger button that opens a dropdown menu with items, a checkbox item and a separator. */
export function DropdownMenuDemo({
  triggerLabel = "Open menu",
  menuLabel = "My Account",
}: DropdownMenuDemoProps) {
  const [showStatusBar, setShowStatusBar] = React.useState(true)

  return (
    <div className="flex items-center justify-center p-8">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          {triggerLabel}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Show status bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
