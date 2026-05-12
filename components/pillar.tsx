"use client";
import React, { useEffect, useRef } from "react";
import style from "@/css/PillarShowcase.module.css";
import { StaticImageData } from "next/image";

interface PillarShowcaseProps {
  /** Single skyline image shown across the section */
  image: string | StaticImageData;
  imageAlt?: string;
  /** Pixels per frame on mobile auto-scroll. 0 disables. */
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

    const loop = () => {
      if (!pausedRef.current && canScroll()) {
        // Width of ONE image copy (half of the duplicated row)
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
