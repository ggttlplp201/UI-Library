"use client";

import AutoplayPlugin from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "../lib/utils";

/**
 * Embla carousel with clip-path zoom on the active slide and floating titles.
 * Ported from Skiper UI (skiper54); the shadcn/ui Carousel wrapper is inlined
 * as a plain embla-carousel-react setup so the preset is self-contained.
 * Illustrations by AarzooAly (https://x.com/AarzooAly).
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

type CarouselImage = { src: string; alt: string; title: string };

const DEFAULT_IMAGES: CarouselImage[] = [
  { src: "/images/x.com/13.jpg", alt: "Illustration by ©AarzooAly", title: "Block Reader" },
  { src: "/images/x.com/9.jpg", alt: "Illustration by ©AarzooAly", title: "Forest Fungi" },
  { src: "/images/x.com/20.jpg", alt: "Illustration by ©AarzooAly", title: "Golden Dusk" },
  { src: "/images/x.com/21.jpg", alt: "Illustration by ©AarzooAly", title: "Silent Peaks" },
  { src: "/images/x.com/25.jpg", alt: "Illustration by ©AarzooAly", title: "Emerald Woods" },
  { src: "/images/x.com/32.jpg", alt: "Illustration by ©AarzooAly", title: "Falling Mist" },
  { src: "/images/x.com/19.jpg", alt: "Illustration by ©AarzooAly", title: "Midnight Veil" },
  { src: "/images/x.com/3.jpg", alt: "Illustration by ©AarzooAly", title: "Azure Ridge" },
  { src: "/images/x.com/2.jpg", alt: "Illustration by ©AarzooAly", title: "Cloud Summit" },
];

interface Carousel006Props {
  /** Slides; inline type so the Studio can shape uploaded photos to match */
  images?: { src: string; alt: string; title: string }[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export const Carousel_006 = ({
  images = DEFAULT_IMAGES,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Carousel006Props) => {
  const [emblaRef, api] = useEmblaCarousel(
    { loop, slidesToScroll: 1 },
    autoplay
      ? [
          AutoplayPlugin({
            delay: 2000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]
      : [],
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={cn("relative w-full", className)} data-hover-demo="click">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex h-[500px] w-full">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative flex h-[81.5%] w-full min-w-0 shrink-0 grow-0 basis-[73%] items-center justify-center sm:basis-[50%] md:basis-[30%] lg:basis-[25%] xl:basis-[21%]"
            >
              <motion.div
                initial={false}
                animate={{
                  clipPath:
                    current !== index
                      ? "inset(15% 0 15% 0 round 2rem)"
                      : "inset(0 0 0 0 round 2rem)",
                }}
                className="h-full w-full overflow-hidden rounded-3xl"
              >
                <div className="relative h-full w-full border">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full scale-105 object-cover"
                  />
                </div>
              </motion.div>
              <AnimatePresence mode="wait">
                {current === index && (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-2 flex h-[14%] w-full translate-y-full items-center justify-center p-2 text-center font-medium tracking-tight text-black/20"
                  >
                    {img.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {showNavigation && (
        <div className="absolute -bottom-4 right-0 flex w-full items-center justify-between gap-2 px-4">
          <button
            aria-label="Previous slide"
            onClick={() => api?.scrollPrev()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            aria-label="Next slide"
            data-demo-click
            onClick={() => api?.scrollNext()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}

      {showPagination && (
        <div className="flex w-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: images.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-all",
                  current === index ? "bg-black" : "bg-[#D9D9D9]",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
