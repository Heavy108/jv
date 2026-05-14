"use client";
import React, { useEffect, useRef } from "react";
import style from "@/css/PillarShowcase.module.css";
import { StaticImageData } from "next/image";

interface PillarShowcaseProps {
  /** Single skyline image shown across the section */
  image: string | StaticImageData;
  imageAlt?: string;
  /**
   * Auto-scroll speed in pixels per frame at 60fps.
   * (Internally converted to px/sec so the speed is the same on 120Hz displays.)
   * 0 disables auto-scroll.
   */
  autoScrollSpeed?: number;
}

const PillarShowcase: React.FC<PillarShowcaseProps> = ({
  image,
  imageAlt = "",
  autoScrollSpeed = 0.6,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const imgSrc = typeof image === "string" ? image : image.src;

  useEffect(() => {
    const el = scrollerRef.current;
    const row = rowRef.current;
    if (!el || !row || autoScrollSpeed <= 0) return;

    const canScroll = () => el.scrollWidth > el.clientWidth + 1;

    // Convert "px per frame at 60fps" → "px per second" so it's framerate-agnostic
    const pxPerSecond = autoScrollSpeed * 60;

    // The browser rounds scrollLeft to an integer (or device pixel).
    // Writing `el.scrollLeft += 0.6` repeatedly reads back the same int and
    // never advances — the fraction gets lost on every read. So we keep a
    // float accumulator here and only commit whole-pixel changes.
    let accumulator = el.scrollLeft;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaMs = time - lastTime;
      lastTime = time;

      if (!pausedRef.current && canScroll()) {
        const oneSetWidth = row.scrollWidth / 2;

        // Advance the float accumulator
        accumulator += pxPerSecond * (deltaMs / 1000);

        // Seamless wrap
        if (accumulator >= oneSetWidth) {
          accumulator -= oneSetWidth;
        }

        // Commit to the DOM (browser will round, that's fine)
        el.scrollLeft = accumulator;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      setTimeout(() => {
        pausedRef.current = false;
        // Resync accumulator with whatever the user scrolled to
        accumulator = el.scrollLeft;
        lastTime = performance.now(); // avoid a big delta-time jump after resume
      }, 1500);
    };

    const onUserScroll = () => {
      const oneSetWidth = row.scrollWidth / 2;
      if (el.scrollLeft >= oneSetWidth) {
        el.scrollLeft -= oneSetWidth;
        accumulator = el.scrollLeft;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += oneSetWidth;
        accumulator = el.scrollLeft;
      }
    };

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);
    el.addEventListener("touchcancel", resume);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("scroll", onUserScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("touchcancel", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("scroll", onUserScroll);
    };
  }, [autoScrollSpeed]);

  return (
    <section className={style.outer}>
      <div className={style.scroller} ref={scrollerRef}>
        <div className={style.row} ref={rowRef}>
          {/* Two copies of the image for seamless infinite scroll */}
          <img
            src={imgSrc}
            alt={imageAlt}
            className={style.image}
            draggable={false}
          />
          <img
            src={imgSrc}
            alt=""
            className={style.image}
            draggable={false}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default PillarShowcase;
