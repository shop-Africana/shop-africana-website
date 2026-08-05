"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

type CallNowControlProps = {
  displayNumber: string;
  telHref: string;
};

export function CallNowControl({ displayNumber, telHref }: CallNowControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className="inline-flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1 rounded-[var(--radius-pill)] border border-[rgba(245,158,11,0.55)] bg-[rgba(255,247,237,0.78)] p-1 shadow-[0_18px_40px_rgba(83,13,42,0.22)] backdrop-blur-md"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? "Hide Pride of Scotland phone number"
            : "Reveal Pride of Scotland phone number"
        }
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-pill)] px-3 text-sm font-extrabold text-[var(--color-pride-800)] transition hover:bg-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-4"
      >
        <Phone aria-hidden="true" size={17} />
        <span>Call Us Now</span>
        <ChevronDown
          aria-hidden="true"
          size={15}
          className={cn("transition", isOpen ? "rotate-180" : undefined)}
        />
      </button>
      {isOpen ? (
        <>
          <span className="px-2 text-sm font-bold text-[var(--color-pride-800)] max-[390px]:w-full max-[390px]:pl-4">
            {displayNumber}
          </span>
          <a
            href={telHref}
            className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-pride-700)] px-4 text-sm font-extrabold text-white transition hover:bg-[var(--color-pride-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label={`Call Pride of Scotland on ${displayNumber}`}
          >
            Call
          </a>
        </>
      ) : null}
    </div>
  );
}
