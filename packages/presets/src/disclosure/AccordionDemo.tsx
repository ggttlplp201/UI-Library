/**
 * AccordionDemo — composed example of Accordion (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/accordion — Author: shadcn. License: MIT.
 */
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

export interface AccordionDemoProps {
  /** Accordion rows — each renders a trigger with its collapsible content */
  items?: { title: string; content: string }[]
}

/** Three-item single-open accordion with short answers. */
export function AccordionDemo({
  items = [
    {
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      title: "Is it styled?",
      content: "Yes. It comes with default styles that match the other components.",
    },
    {
      title: "Is it animated?",
      content: "Yes. It's animated by default, but you can disable it if you prefer.",
    },
  ],
}: AccordionDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Accordion type="single" collapsible className="w-[360px]">
        {items.map((item, i) => (
          <AccordionItem key={item.title} value={`item-${i}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
