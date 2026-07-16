/**
 * DialogDemo — composed example of Dialog (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/dialog — Author: shadcn. License: MIT.
 */
"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

export interface DialogDemoProps {
  /** Label of the button that opens the dialog */
  triggerLabel?: string
  /** Dialog heading */
  title?: string
  /** Supporting text under the heading */
  description?: string
}

/** Trigger button that opens a modal dialog with a header, description and footer actions. */
export function DialogDemo({
  triggerLabel = "Open dialog",
  title = "Edit profile",
  description = "Make changes to your profile here. Click save when you're done.",
}: DialogDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Dialog>
        <DialogTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          {triggerLabel}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Cancel
            </DialogClose>
            <DialogClose className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
