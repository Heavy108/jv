"use client";
import style from "@/css/Home.module.css";
import React, { useRef, useEffect } from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";
import PillarShowcase from "@/components/pillar";
import StatCardShowcase, { StatCard } from "@/components/StatCardShowcase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

// GSAP Imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Asset Imports - Stats
import powered from "@/assets/powered.png";
import powerrx from "@/assets/powerRx.png";
import powerrx1 from "@/assets/powerrx1.png";
import powerpod from "@/assets/powerpod.png";

import poweredlogo from "@/assets/poweredlogo.png";
import powerrxlogo from "@/assets/powerRxlogo.png";
import powerrx1logo from "@/assets/powerrx1logo.png";
import powerpodlogo from "@/assets/powerpodlogo.png";

// Asset Imports - Gallery (c1 to c5)
import c1 from "@/assets/c1.png";
import c2 from "@/assets/c2.png";
import c3 from "@/assets/c3.png";
import c4 from "@/assets/c4.png";
import c5 from "@/assets/c5.png";

import skylineImg from "@/assets/Eco.png";
import { StaticImageData } from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats: StatCard[] = [
  {
    image: powered,
    logo: poweredlogo,
    imageAlt: "Students at PowerEd",
    statValue: "19,000+",
    statLabel: "Students Empowered",
  },
  {
    image: powerrx,
    logo: powerrxlogo,
    imageAlt: "PowerRx Lifesciences lab",
    statValue: "6.5",
    statUnit: "Mn+ SFT",
    statLabel: "of Labspace",
  },
  {
    image: powerrx1,
    logo: powerrx1logo,
    imageAlt: "PowerRx Healthcare building",
    statValue: "2.4",
    statUnit: "Lakh+ SFT",
    statLabel: "Medical Office Building",
  },
  {
    image: powerpod,
    logo: powerpodlogo,
    imageAlt: "PowerPod managed living interior",
    statValue: "10.9",
    statUnit: "Lakh+ SFT",
    statLabel: "Planned Development",
  },
];

export interface Pillar {
  logo?: string;
  logoAlt?: string;
  label: string;
  image: string | StaticImageData;
  imageAlt: string;
  heightRatio?: number;
  widthRatio?: number;
}

const galleryData: GalleryItem[] = [
  {
    common: "Gallery Item 1",
    stats: "XX",
    binomial: "Students Empowered",
    photo: {
      url: c1,
      text: "abstract view of c1",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 2",
    stats: "XX",
    binomial: "Scientists & Researchers Supported",
    photo: {
      url: c2,
      text: "abstract view of c2",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 3",
    stats: "XX",
    binomial: "Institutions Created",
    photo: {
      url: c3,
      text: "abstract view of c3",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 4",
    stats: "14",
    binomial: "Intrapreneurs Nurtured",
    photo: {
      url: c4,
      text: "abstract view of c4",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 5",
    stats: "XX",
    binomial: "Jobs Created ",
    photo: {
      url: c5,
      text: "abstract view of c5",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 6",
    stats: "XX",
    binomial: "Students Empowered",
    photo: {
      url: c1,
      text: "abstract view of c1",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 7",
    stats: "XX",
    binomial: "Scientists & Researchers Supported",
    photo: {
      url: c2,
      text: "abstract view of c2",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 8",
    stats: "XX",
    binomial: "Institutions Created",
    photo: {
      url: c3,
      text: "abstract view of c3",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 9",
    stats: "XX",
    binomial: "Intrapreneurs Nurtured",
    photo: {
      url: c4,
      text: "abstract view of c4",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
  {
    common: "Gallery Item 10",
    stats: "XX",
    binomial: "Jobs Created",
    photo: {
      url: c5,
      text: "abstract view of c5",
      pos: "50% 50%",
      by: "PowerRx",
    },
  },
];

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const horizontalWrapRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // Permanently keep the navbar visible on this page.
  // Adds `lock-navbar` on mount, removes on unmount. The navbar already
  // respects this class by forcing y: 0 and ignoring scroll-direction logic.
  useEffect(() => {
    document.body.classList.add("lock-navbar");
    document.body.classList.remove("hide-navbar");
    return () => {
      document.body.classList.remove("lock-navbar");
    };
  }, []);

  // Horizontal scroll setup — DESKTOP ONLY
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = horizontalTrackRef.current;
        const wrap = horizontalWrapRef.current;
        if (!track || !wrap) return;

        const sections = gsap.utils.toArray<HTMLElement>(
          `.${style.outerContainer}`,
        );
        if (sections.length === 0) return;

        // Distance to scroll = total track width minus one viewport
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
        });

        // Explicit snap points: one for each section.
        // For 3 sections: [0, 0.5, 1]
        const snapPoints = sections.map((_, i) => i / (sections.length - 1));

        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          // Tighter scrub feels more direct and reduces the time the
          // scrub and snap can fight each other.
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: tween,
          snap: {
            // Pass explicit array of snap points so behavior is predictable.
            snapTo: snapPoints,
            // `directional: true` means: only snap to the next point in the
            // direction the user was scrolling. Prevents flicking past slide
            // 2 and landing on slide 3 — at worst you land on slide 2.
            directional: true,
            // Short, consistent settle. min/max kept close together so the
            // animation feels uniform regardless of distance.
            duration: { min: 0.3, max: 0.5 },
            // Small delay so the snap waits until the user has actually
            // stopped scrolling, but short enough that it doesn't feel laggy.
            delay: 0.1,
            ease: "power2.out",
            // Tells GSAP to use inertia from the scroll velocity, so a fast
            // flick still snaps cleanly to the next slide instead of overshooting.
            inertia: false,
          },
        });

        // Recalculate on resize
        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
        };
      });

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={style.wrapper}>
      <Navbar />

      {/* Horizontal-scroll block (desktop) / vertical stack (mobile) */}
      <div ref={horizontalWrapRef} className={style.horizontalWrap}>
        <div ref={horizontalTrackRef} className={style.horizontalTrack}>


          <section className={style.outerContainer}>
            
            <div className={style.extrapad}>
              <div className={style.container}>
                <div className={style.title}>
                  <h1>
                    <span>Reimagining</span> <span>Investing</span>
                  </h1>
                </div>
                <p className={style.desc}>
                  Traditional investing measures profit; we measures impact
                  through
                  <span> Sphere of Influence (SOI)</span>, where capital shapes
                  societal outcomes.
                </p>
                <button className={style.button}>ABOUT US</button>
              </div>
            </div>
            <div className={style.galleryWrap}>
              <CircularGallery items={galleryData} />
            </div>
          </section>

          <section className={style.outerContainer}>
            <div className={style.extrapad}>
              <div className={style.container}>
                <div className={style.title}>
                  <h1>
                    <span>Reimagining</span> <span>Ecosystems</span>
                  </h1>
                </div>
                <p className={style.desc}>
                  Economic corridors hold untapped potential often constrained
                  by gaps in social infrastructure. These white spaces are
                  identified and transformed into{" "}
                  <span> GRID (Growth-Ready Innovation Destinations) </span>
                  integrating platforms that combine high-quality real assets
                  with enabling services to create cohesive, high-performance
                  ecosystems.
                </p>
                <button className={style.button}>EXPLORE GRID</button>
              </div>
            </div>
            <div className={style.galleryWrap}>
              <PillarShowcase image={skylineImg} imageAlt="Ecosystem" />
            </div>
          </section>

          <section className={style.outerContainer}>
            <div className={style.extrapad}>
              <div className={style.container}>
                <div className={style.title}>
                  <h1>
                    <span>Reimagining</span> <span>Platforms</span>
                  </h1>
                </div>
                <p className={style.desc}>
                  A 10 year legacy, $550 Mn AUM across Lifesciences, Education,
                  Healthcare, and Hospitality built on the belief that assets
                  are catalysts for societal transformation, not standalone
                  plays. Unified into three platforms{" "}
                  <span> PowerX, PowerEd, and PowerPod </span>
                  these systems are designed to interconnect, unlock synergies,
                  and amplify impact beyond sectors.
                </p>
                <button className={style.button}>ABOUT US</button>
              </div>
            </div>
            <div className={style.galleryWrap}>
              <StatCardShowcase cards={stats} autoScrollSpeed={0.6} />
            </div>
          </section>
        </div>
      </div>

      <div className={style.footerWrap}>
        <Footer />
      </div>
    </div>
  );
}
