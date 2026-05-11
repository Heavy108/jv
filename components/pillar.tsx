"use client";
import React, { useEffect, useRef } from "react";
import style from "@/css/PillarShowcase.module.css";

export interface Pillar {
  logo?: string;
  logoAlt?: string;
  label: string;
  image: string;
  imageAlt: string;
  heightRatio?: number;
  widthRatio?: number;
}

interface PillarShowcaseProps {
  pillars: Pillar[];
  /** Pixels per frame on mobile auto-scroll. 0 disables. */
  autoScrollSpeed?: number;
}

const PillarShowcase: React.FC<PillarShowcaseProps> = ({
  pillars,
  autoScrollSpeed = 0.6,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Duplicate the pillars for seamless infinite scrolling.
  // The first half is the "real" set; the second half is the visual duplicate
  // we silently loop back to when crossing the boundary.
  const loopedPillars = [...pillars, ...pillars];

  useEffect(() => {
    const el = scrollerRef.current;
    const row = rowRef.current;
    if (!el || !row || autoScrollSpeed <= 0) return;

    const canScroll = () => el.scrollWidth > el.clientWidth + 1;

    const loop = () => {
      if (!pausedRef.current && canScroll()) {
        // Width of ONE set of pillars (half of the duplicated row)
        const oneSetWidth = row.scrollWidth / 2;

        el.scrollLeft += autoScrollSpeed;

        // When we've scrolled past one full set, jump back by that amount.
        // The user sees no jump because the second set is visually identical.
        if (el.scrollLeft >= oneSetWidth) {
          el.scrollLeft -= oneSetWidth;
        }
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
      }, 1500);
    };

    // Also handle the loop boundary when the USER scrolls manually
    const onUserScroll = () => {
      const oneSetWidth = row.scrollWidth / 2;
      if (el.scrollLeft >= oneSetWidth) {
        el.scrollLeft -= oneSetWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += oneSetWidth;
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
  }, [autoScrollSpeed, pillars.length]);

  return (
    <section className={style.outer}>
      <div className={style.scroller} ref={scrollerRef}>
        <div className={style.row} ref={rowRef}>
          {loopedPillars.map((p, i) => {
            const widthRatio = p.widthRatio ?? 1;
            return (
              <article
                key={i}
                className={style.pillar}
                style={{
                  height: `${(p.heightRatio ?? 1) * 100}%`,
                  ["--width-ratio" as any]: widthRatio,
                }}
                aria-hidden={
                  i >= pillars.length
                } /* hide duplicates from a11y tree */
              >
                <div className={style.header}>
                  {p.logo && (
                    <img
                      src={p.logo}
                      alt={p.logoAlt ?? ""}
                      className={style.logo}
                    />
                  )}
                  <span className={style.label}>{p.label}</span>
                </div>
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  className={style.bgImage}
                  draggable={false}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PillarShowcase;
