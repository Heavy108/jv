"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
} from "react";
import { StaticImageData } from "next/image";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface GalleryItem {
  common: string;
  stats: string;
  binomial: string;
  photo: {
    url: string | StaticImageData;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  cardSize?: number;
  dragSensitivity?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius,
      cardSize,
      dragSensitivity = 0.5,
      autoRotateSpeed = 0.15,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [size, setSize] = useState({ w: 0, h: 0 });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const ringRef = useRef<HTMLDivElement | null>(null); // the rotating inner div
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

    // Rotation is now a plain ref, not React state — no re-render on each frame
    const rotationRef = useRef(0);

    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const lastRotation = useRef(0);
    const gestureDecided = useRef<null | "horizontal" | "vertical">(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
      isDraggingRef.current = isDragging;
    }, [isDragging]);

    // Measure container
    useLayoutEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const anglePerItem = 360 / items.length;

    // Imperative render loop: writes transform directly to the DOM each frame.
    // No React state updates → no re-renders → no stutter.
    useEffect(() => {
      let raf: number;
      let lastTime = performance.now();

      const loop = (time: number) => {
        // Use delta time so speed is consistent regardless of frame rate
        const deltaMs = time - lastTime;
        lastTime = time;

        if (!isDraggingRef.current && autoRotateSpeed > 0) {
          // autoRotateSpeed was previously degrees/frame at 60fps.
          // Convert to deg/sec, then apply via delta to make it framerate-agnostic.
          const degPerSec = autoRotateSpeed * 60;
          rotationRef.current += degPerSec * (deltaMs / 1000);
        }

        const rot = rotationRef.current;

        // Apply ring rotation directly
        if (ringRef.current) {
          ringRef.current.style.transform = `rotateY(${rot}deg)`;
        }

        // Update each card's opacity based on its facing angle
        const totalRotation = rot % 360;
        for (let i = 0; i < cardRefs.current.length; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;
          const itemAngle = i * anglePerItem;
          const relativeAngle = (itemAngle + totalRotation + 360) % 360;
          const normalizedAngle = Math.abs(
            relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
          );
          const opacity = 1;
          card.style.opacity = String(opacity);
        }

        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, [autoRotateSpeed, anglePerItem]);

    // Native non-passive touch listeners (so we can preventDefault)
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onTouchStart = (e: TouchEvent) => {
        const t = e.touches[0];
        dragStartX.current = t.clientX;
        dragStartY.current = t.clientY;
        lastRotation.current = rotationRef.current;
        gestureDecided.current = null;
        setIsDragging(true);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        const t = e.touches[0];
        const dx = t.clientX - dragStartX.current;
        const dy = t.clientY - dragStartY.current;

        if (gestureDecided.current === null) {
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);
          if (absX < 8 && absY < 8) return;
          gestureDecided.current = absX > absY ? "horizontal" : "vertical";
        }

        if (gestureDecided.current === "horizontal") {
          e.preventDefault();
          rotationRef.current = lastRotation.current + dx * dragSensitivity;
        }
      };

      const onTouchEnd = () => {
        setIsDragging(false);
        gestureDecided.current = null;
      };

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);
      el.addEventListener("touchcancel", onTouchEnd);

      return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
        el.removeEventListener("touchcancel", onTouchEnd);
      };
    }, [dragSensitivity]);

    // Responsive sizing
    const minDim = Math.min(size.w, size.h) || 0;
    const computedCardSize =
      cardSize ?? Math.max(200, Math.min(340, minDim * 0.7));
    const minRadius = (computedCardSize * items.length) / (2 * Math.PI) + 45;
    const computedRadius =
      radius ?? Math.max(minRadius, Math.min(minDim * 0.28, 400));
    const halfSize = computedCardSize / 2;

    // Mouse handlers (desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
      dragStartX.current = e.clientX;
      lastRotation.current = rotationRef.current;
      setIsDragging(true);
    };
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      rotationRef.current =
        lastRotation.current +
        (e.clientX - dragStartX.current) * dragSensitivity;
    };
    const handleMouseEnd = () => setIsDragging(false);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          className,
        )}
        style={{ perspective: "2000px", touchAction: "pan-y" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        {...props}
      >
        <div
          ref={ringRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            // NO CSS transition here — would fight with the per-frame
            // imperative transform update and cause the cog-wheel stutter.
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;

            const imgSrc =
              typeof item.photo.url === "string"
                ? item.photo.url
                : item.photo.url.src;

            return (
              <div
                key={item.common}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: `${computedCardSize}px`,
                  height: `${computedCardSize}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${computedRadius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${halfSize}px`,
                  marginTop: `-${halfSize}px`,
                  willChange: "opacity",
                  // No opacity transition — it would be re-triggered every
                  // frame by the imperative opacity updates and cause stutter
                }}
              >
                <div className="relative w-full h-full aspect-square rounded-lg shadow-2xl overflow-hidden border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  <img
                    src={imgSrc}
                    alt={item.photo.text}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition: item.photo.pos || "center" }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
                    <h2 className="text-3xl font-bold leading-tight">
                      {item.stats}
                    </h2>
                    
                    <p
                      className="text-sm leading-snug mt-1"
                      style={{
                        minHeight: "2.6em", // ≈ 2 lines at leading-snug
                      }}
                    >
                      {item.binomial}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";
export { CircularGallery };
