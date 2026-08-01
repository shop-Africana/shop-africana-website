"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { HeroArtwork } from "@/lib/artwork";

type HeroCarouselProps = {
  slides: HeroArtwork[];
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  imageClassName?: string;
  intervalMs?: number;
};

export function HeroCarousel({
  slides,
  children,
  ariaLabel,
  className,
  imageClassName,
  intervalMs = 6000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  const activeSlideLabel = useMemo(
    () => `Hero artwork ${activeIndex + 1} of ${slideCount}`,
    [activeIndex, slideCount],
  );

  useEffect(() => {
    if (slideCount < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, slideCount]);

  if (slideCount === 0) return null;

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + slideCount) % slideCount);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % slideCount);
  }

  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "relative isolate overflow-hidden border-b border-[var(--color-border)]",
        className,
      )}
    >
      <div aria-live="polite" className="sr-only">
        {activeSlideLabel}
      </div>
      <div className="absolute inset-0 -z-10 bg-[var(--color-surface-warm)]">
        {slides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
              imageClassName,
            )}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.66)_42%,rgba(255,255,255,0.12)_72%)]" />
      </div>
      {children}
      {slideCount > 1 ? (
        <>
          <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={showPrevious}
              className="pointer-events-auto flex size-11 items-center justify-center rounded-[var(--radius-pill)] border border-white/70 bg-white/80 text-[var(--color-shop-900)] shadow-[var(--shadow-card)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              aria-label="Show previous hero image"
            >
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="pointer-events-auto flex size-11 items-center justify-center rounded-[var(--radius-pill)] border border-white/70 bg-white/80 text-[var(--color-shop-900)] shadow-[var(--shadow-card)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              aria-label="Show next hero image"
            >
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </div>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-[var(--radius-pill)] bg-white/80 px-3 py-2 shadow-[var(--shadow-input)]">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "size-2.5 rounded-[var(--radius-pill)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                  index === activeIndex
                    ? "w-6 bg-[var(--color-shop-700)]"
                    : "bg-[var(--color-border-strong)] hover:bg-[var(--color-shop-400)]",
                )}
                aria-label={`Show hero image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
