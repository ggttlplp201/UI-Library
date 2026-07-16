/**
 * DynamicIslandDemo — composed example of DynamicIsland (Cult UI).
 * Original composition for Component Style Studio. License: MIT.
 * Source: https://www.cult-ui.com/docs/components/dynamic-island — Author: nolly-studio (@cult-ui). License: MIT.
 */
"use client"

import {
  DynamicContainer,
  DynamicDescription,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
  SIZE_PRESETS,
  useDynamicIslandSize,
} from "./DynamicIsland"

export interface DynamicIslandDemoProps {
  /** Title shown in every island state */
  title?: string
  /** Description revealed in the expanded states */
  description?: string
}

/** Click cycles the island through compact → large → tall (the engine blocks
 * toggling straight back to the previous size, so we rotate three presets). */
const islandCycle = [SIZE_PRESETS.COMPACT, SIZE_PRESETS.LARGE, SIZE_PRESETS.TALL] as const

const IslandStage = ({ title, description }: Required<DynamicIslandDemoProps>) => {
  const { state, setSize } = useDynamicIslandSize()

  const cycleSize = () => {
    const index = islandCycle.indexOf(state.size as (typeof islandCycle)[number])
    setSize(islandCycle[(index + 1) % islandCycle.length])
  }

  return (
    <button
      type="button"
      onClick={cycleSize}
      aria-label="Cycle dynamic island size"
      className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
    >
      <DynamicIsland id="dynamic-island-demo">
        {state.size === "compact" && (
          <DynamicContainer className="flex h-full w-full items-center justify-center">
            <DynamicTitle className="text-sm font-medium tracking-tight text-white">
              {title}
            </DynamicTitle>
          </DynamicContainer>
        )}
        {state.size === "large" && (
          <DynamicContainer className="flex h-full w-full items-center justify-between px-6">
            <DynamicTitle className="text-lg font-semibold tracking-tight text-white">
              {title}
            </DynamicTitle>
            <DynamicDescription className="text-sm text-neutral-400">
              Tap to expand
            </DynamicDescription>
          </DynamicContainer>
        )}
        {state.size === "tall" && (
          <DynamicContainer className="flex h-full w-full flex-col items-start justify-center gap-2 px-8 text-left">
            <DynamicTitle className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </DynamicTitle>
            <DynamicDescription className="text-sm leading-relaxed text-neutral-400">
              {description}
            </DynamicDescription>
          </DynamicContainer>
        )}
      </DynamicIsland>
    </button>
  )
}

/** Cult UI dynamic island wrapped in its provider — click it to cycle sizes. */
export function DynamicIslandDemo({
  title = "Now Playing",
  description = "Midnight City — M83. Click again to shrink the island back down.",
}: DynamicIslandDemoProps) {
  return (
    <DynamicIslandProvider initialSize={SIZE_PRESETS.COMPACT}>
      <div className="flex h-64 w-full min-w-[420px] items-center justify-center p-8">
        <IslandStage title={title} description={description} />
      </div>
    </DynamicIslandProvider>
  )
}
