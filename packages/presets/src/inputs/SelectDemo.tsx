/**
 * SelectDemo — composed example of Select (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/select — Author: shadcn. License: MIT.
 */
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select"

export interface SelectDemoProps {
  /** Placeholder shown before a value is picked */
  placeholder?: string
  /** Options listed in the dropdown */
  items?: string[]
}

/** Select with a placeholder trigger and a short list of options. */
export function SelectDemo({
  placeholder = "Select a fruit",
  items = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"],
}: SelectDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
