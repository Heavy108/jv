"use client";
import React, { useEffect, useRef } from "react";
import style from "@/css/StatCardShowcase.module.css";

export interface StatCard {
  /** Image with logo + label burned in, OR pass logo/label separately below. */
  image: string;
  imageAlt: string;
  /** Big stat number, e.g. "19,000+" or "6.5 Mn+ SFT" */
  statValue: string;
  /** Optional unit shown smaller next to statValue, e.g. "Mn+ SFT" */
  statUnit?: string;
  /** Descriptive line below the stat, e.g. "Students Empowered" */
  statLabel: string;
  /** Relative width on desktop (flex-grow). */
  widthRatio?: number;
}

interface StatCardShowcaseProps {
  cards: StatCard[];
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

    const loop = () => {
      if (!pausedRef.current && canScroll()) {
        const oneSetWidth = row.scrollWidth / 2;
        el.scrollLeft += autoScrollSpeed;
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

    const onUserScroll = () => {
      const oneSetWidth = row.scrollWidth / 2;
      if (el.scrollLeft >= oneSetWidth) el.scrollLeft -= oneSetWidth;
      else if (el.scrollLeft <= 0) el.scrollLeft += oneSetWidth;
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
          {loopedCards.map((c, i) => (
            <article
              key={i}
              className={style.card}
              style={{ ["--width-ratio" as any]: c.widthRatio ?? 1 }}
              aria-hidden={i >= cards.length}
            >
              <img
                src={c.image}
                alt={c.imageAlt}
                className={style.bgImage}
                draggable={false}
              />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatCardShowcase;
