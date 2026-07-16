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
      {/* Rows really do fade in on their own beat: native scroll-driven
          animation against the inner scrollport (animation-timeline: view()),
          so scrolling the list plays each row's entrance. */}
      <style>{`
        @keyframes sfl-in {
          from { opacity: .12; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sfl-row { animation: sfl-in both; animation-timeline: view(); animation-range: entry 0% entry 90%; }
      `}</style>
      <ScrollArea className="w-62 h-72 rounded-xl">
        <div className="space-y-1 p-1">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="sfl-row text-foreground/70 hover:bg-foreground/10 bg-foreground/5 flex h-10 w-full items-center gap-2 rounded-lg px-4"
            >
              00{index} <div className="bg-foreground/10 h-px flex-1"></div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
