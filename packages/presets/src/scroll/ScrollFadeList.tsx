import { ScrollArea } from "../lib/scroll-area";

/**
 * List inside a styled scroll area with hoverable rows.
 * Ported from Skiper UI (skiper87) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */
export const ScrollFadeList = ({
  /** Number of rows to render */
  rows = 11,
}: {
  rows?: number;
}) => {
  return (
    <div className="rounded-xl border border-border" data-hover-demo="scroll">
      <ScrollArea className="w-62 h-72 rounded-xl">
        <div className="space-y-1 p-1">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="text-foreground/30 hover:bg-foreground/10 bg-foreground/5 flex h-10 w-full items-center gap-2 rounded-lg px-4"
            >
              00{index} <div className="bg-foreground/10 h-px flex-1"></div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
