/**
 * TabsDemo — composed example of Tabs (shadcn/ui).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://ui.shadcn.com/docs/components/tabs — Author: shadcn. License: MIT.
 */
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"

export interface TabsDemoProps {
  /** Tab labels — one panel is generated per label */
  tabs?: string[]
}

/** Three-tab strip with a short content panel per tab. */
export function TabsDemo({
  tabs = ["Overview", "Features", "Pricing"],
}: TabsDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Tabs defaultValue={tabs[0]} className="w-[360px]">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border bg-background p-4">
              <h4 className="text-sm font-semibold leading-none">{tab}</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Short {tab.toLowerCase()} panel — swap this text for your own content.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
