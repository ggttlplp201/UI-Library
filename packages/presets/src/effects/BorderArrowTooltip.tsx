"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Tooltip whose arrow is drawn into the border outline.
 * Ported from Skiper UI (skiper101) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 */

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/** Composed demo: hover the label to see the border-arrow tooltip. */
export const BorderArrowTooltip = ({
  /** Trigger label */
  label = "Tooltip",
  /** Tooltip body text */
  content = "Tooltip Content",
}: {
  label?: string;
  content?: string;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-10"
      data-hover-demo="pointer"
    >
      <Tooltip>
        <TooltipTrigger>
          <div className="rounded-md border border-border px-3 py-1.5 text-sm">
            <p>{label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

export function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "origin-(--radix-tooltip-content-transform-origin) animate-in bg-background text-foreground outline-border fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 group z-50 w-fit text-balance rounded-md px-3 py-1.5 text-xs outline-1",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          <ArrowSvg />
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

const ArrowSvg = (props: React.ComponentProps<"svg">) => (
  <svg
    width="20"
    height="10"
    viewBox="0 0 20 10"
    fill="none"
    className="ml-[1px] mt-[-1px]"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V0H0V2H1.4651C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"
      fill="var(--color-background)"
    />
    <path d="M11.1363 8.14124C10.3757 8.82575 9.22111 8.82578 8.46041 8.14122L3.60361 3.77011C3.05281 3.27432 2.33791 2.99999 1.59681 2.99999L4.24171 3L9.12941 7.39793C9.50971 7.7402 10.087 7.7402 10.4674 7.39793L15.3544 3L18 2.99999C17.2589 2.99999 16.544 3.27432 15.9931 3.77011L11.1363 8.14124Z" />
    <path
      d="M9.6667 6.65461L14.5235 2.28352C15.4416 1.45721 16.6331 1 17.8683 1H20V2H17.8683C16.8801 2 15.9269 2.36577 15.1924 3.02682L10.3356 7.39793C9.9553 7.74021 9.378 7.7402 8.9977 7.39793L4.1409 3.02682C3.4064 2.36577 2.4532 2 1.4651 2H0V1H1.4651C2.7002 1 3.8917 1.45722 4.8099 2.28352L9.6667 6.65461Z"
      fill="var(--color-border)"
    />
  </svg>
);
