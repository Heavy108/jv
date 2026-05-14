"use client";
import React, { useEffect, useRef } from "react";
import style from "@/css/StatCardShowcase.module.css";
import { StaticImageData } from "next/image";

export interface StatCard {
  image: string | StaticImageData;
  imageAlt: string;
  // NEW: Added optional logo properties for the top-left badge
  logo?: string | StaticImageData;
  logoAlt?: string;
  statValue: string;
  statUnit?: string;
  statLabel: string;
  widthRatio?: number;
}

interface StatCardShowcaseProps {
  cards: StatCard[];
  /**
   * Auto-scroll speed in pixels per frame at 60fps.
   * Internally converted to px/sec so speed is consistent on 120Hz displays.
   * 0 disables auto-scroll.
   */
  autoScrollSpeed?: number;
}

const StatCardShowcase: React.FC<StatCardShowcaseProps> = ({
  cards,
  autoScrollSpeed = 0.6,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const loopedCards = [...cards, ...cards];

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

        // Seamless loop reset
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
  }, [autoScrollSpeed, cards.length]);

  return (
    <section className={style.outer}>
      <div className={style.scroller} ref={scrollerRef}>
        <div className={style.row} ref={rowRef}>
          {loopedCards.map((c, i) => {
            const imgSrc = typeof c.image === "string" ? c.image : c.image.src;

            // NEW: Safely extract the logo string URL
            const logoSrc = c.logo
              ? typeof c.logo === "string"
                ? c.logo
                : c.logo.src
              : null;

            return (
              <article
                key={i}
                className={style.card}
                style={
                  { "--width-ratio": c.widthRatio ?? 1 } as React.CSSProperties
                }
                aria-hidden={i >= cards.length}
              >
                {/* Background Image */}
                <img
                  src={imgSrc}
                  alt={c.imageAlt}
                  className={style.bgImage}
                  draggable={false}
                />

                {/* NEW: Logo Overlay */}
                {logoSrc && (
                  <div className={style.logoWrapper}>
                    <img
                      src={logoSrc}
                      alt={c.logoAlt || "Stat card logo"}
                      className={style.logo}
                      draggable={false}
                    />
                  </div>
                )}

                <div className={style.statBlock}>
                  <div className={style.statValue}>
                    {c.statValue}
                    {c.statUnit && (
                      <span className={style.statUnit}>{c.statUnit}</span>
                    )}
                  </div>
                  <div className={style.statLabel}>{c.statLabel}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatCardShowcase;
