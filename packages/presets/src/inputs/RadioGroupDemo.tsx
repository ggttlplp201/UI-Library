/**
 * RadioGroupDemo — composed example of RadioGroup (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/radio-group — Author: shadcn. License: MIT.
 */
"use client"

import * as React from "react"

import { RadioGroup, RadioGroupItem } from "./RadioGroup"

export interface RadioGroupDemoProps {
  /** Radio option labels */
  options?: string[]
  /** Label of the option selected by default (falls back to the first option) */
  defaultOption?: string
}

/** Vertical radio group with three labelled options, one pre-selected. */
export function RadioGroupDemo({
  options = ["Default", "Comfortable", "Compact"],
  defaultOption = "Comfortable",
}: RadioGroupDemoProps) {
  const id = React.useId()
  const defaultValue = options.includes(defaultOption) ? defaultOption : options[0]

  return (
    <div className="flex items-center justify-center p-8">
      <RadioGroup defaultValue={defaultValue} className="gap-3">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <RadioGroupItem value={option} id={`${id}-${option}`} />
            <label
              htmlFor={`${id}-${option}`}
              className="text-sm font-medium leading-none text-foreground"
            >
              {option}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
