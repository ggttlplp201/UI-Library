"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { cn } from "../lib/utils";

/**
 * GSAP ScrollTrigger card deck — the next image slides up over the pinned one.
 * Ported from Skiper UI (skiper17); pinned to an internal scroll container
 * (ScrollTrigger `scroller`) instead of the window so it works anywhere.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

const DEFAULT_CARDS = [
  { id: 1, image: "/images/lummi/img14.jpg" },
  { id: 2, image: "/images/lummi/img15.jpg" },
  { id: 3, image: "/images/lummi/img29.jpg" },
  { id: 4, image: "/images/lummi/img21.jpg" },
  { id: 5, image: "/images/lummi/img27.jpg" },
];

interface StickyCard002Props {
  cards?: { id: number; image: string; alt?: string }[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export const StickyCardsGsap = ({
  cards = DEFAULT_CARDS,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const scroller = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      if (!imageElements[0] || !scroller.current) return;

      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const panelHeight = scroller.current.clientHeight;

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          scroller: scroller.current,
          start: "top top",
          end: `+=${panelHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.7,
            rotation: 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div
      ref={scroller}
      data-hover-demo="scroll"
      className="h-[420px] w-[520px] max-w-full overflow-y-auto rounded-xl border border-border bg-background"
    >
      <div
        className={cn("relative h-full w-full", className)}
        ref={container}
      >
        <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
          <div
            className={cn(
              "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg",
              containerClassName,
            )}
          >
            {cards.map((card, i) => (
              <img
                key={card.id}
                src={card.image}
                alt={card.alt || ""}
                className={cn(
                  "rounded-4xl absolute h-full w-full object-cover",
                  imageClassName,
                )}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
