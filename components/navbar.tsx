"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "@/css/navbar.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";

// Interface for type safety
interface MenuLink {
  path: string;
  label: string;
  children?: { path: string; label: string }[];
}

const Navbar: React.FC = () => {
  const menuLinks: MenuLink[] = [
    { path: "/", label: "Home" },
    {
      path: "#",
      label: "Platforms",
      children: [
        { path: "#", label: "PowerEd" },
        { path: "#", label: "PowerRx" },
        { path: "#", label: "PowerPod" },
        { path: "#", label: "Empower" },
      ],
    },
    { path: "/about", label: "About" },
  ];

  const pathname = usePathname();
  const menuContainer = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [shouldDelayClose, setShouldDelayClose] = useState<boolean>(false);

  // GSAP Timelines stored in refs
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  const menuLinksAnimation = useRef<gsap.core.Timeline | null>(null);
  const menuBarAnimation = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);
  const previousPathRef = useRef<string>(pathname);

  // Tracks which lock mode we used to open — so close uses the matching unlock
  const lockModeRef = useRef<"fixed" | "overflow" | null>(null);

  // Safely grab initial window width after hydration to prevent mismatches
  useEffect(() => {
    const timer = setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 0);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleBodyScroll = (disableScroll: boolean) => {
    if (typeof window === "undefined") return;

    if (disableScroll) {
      // If we're inside the horizontal pin (desktop), DO NOT use position:fixed.
      // That would change window.scrollY and break the GSAP horizontal trigger,
      // making the slide jump. A simple overflow:hidden is enough — the pin
      // already prevents scrolling away while we're in it.
      const insideHorizontalPin =
        document.body.classList.contains("lock-navbar");

      if (insideHorizontalPin) {
        lockModeRef.current = "overflow";
        document.body.style.overflow = "hidden";
      } else {
        lockModeRef.current = "fixed";
        scrollPositionRef.current = window.pageYOffset;
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.width = "100%";
      }
    } else {
      // Undo whichever lock we set up
      if (lockModeRef.current === "fixed") {
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        window.scrollTo(0, scrollPositionRef.current);
      } else if (lockModeRef.current === "overflow") {
        document.body.style.removeProperty("overflow");
      }
      lockModeRef.current = null;
    }
  };

  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    toggleBodyScroll(newMenuState);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      toggleBodyScroll(false);
    }
  };

  const handleLinkClick = (path: string) => {
    if (path !== pathname) {
      setShouldDelayClose(true);
    }
  };

  // Handle route change closing logic
  useEffect(() => {
    if (pathname !== previousPathRef.current && shouldDelayClose) {
      const timer = setTimeout(() => {
        closeMenu();
        setShouldDelayClose(false);
      }, 700);

      previousPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
    previousPathRef.current = pathname;
  }, [pathname, shouldDelayClose]);

  // Handle GSAP Animation Initializations
  useGSAP(
    () => {
      if (windowWidth === 0) return;

      gsap.set(`.${styles.menuLinkItemHolder}`, { y: 125 });

      menuAnimation.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.menu}`, {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        });

      const heightValue =
        windowWidth < 1000 ? "calc(100% - 2.5em)" : "calc(100% - 4em)";

      menuBarAnimation.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.menuBar}`, {
          duration: 1,
          height: heightValue,
          ease: "power4.inOut",
        });

      menuLinksAnimation.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.menuLinkItemHolder}`, {
          y: 0,
          duration: 1.25,
          stagger: 0.075,
          ease: "power3.inOut",
          delay: 0.125,
        });
    },
    { dependencies: [windowWidth], scope: menuContainer },
  );

  // Play/Reverse animations based on isMenuOpen state
  useEffect(() => {
    if (
      menuAnimation.current &&
      menuBarAnimation.current &&
      menuLinksAnimation.current
    ) {
      if (isMenuOpen) {
        menuAnimation.current.play();
        menuBarAnimation.current.play();
        menuLinksAnimation.current.play();
      } else {
        menuAnimation.current.reverse();
        menuBarAnimation.current.reverse();
        menuLinksAnimation.current.reverse();
      }
    }
  }, [isMenuOpen]);

  // Handle scroll to hide/show menu bar
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return;

      // When inside the pinned horizontal block (desktop), keep navbar visible
      // and ignore vertical scroll deltas — they're driving the X animation.
      if (document.body.classList.contains("lock-navbar")) {
        gsap.to(`.${styles.menuBar}`, {
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        gsap.to(`.${styles.menuBar}`, {
          y: -200,
          duration: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(`.${styles.menuBar}`, {
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Cleanup body scroll lock on unmount
  useEffect(() => {
    return () => {
      if (lockModeRef.current) {
        toggleBodyScroll(false);
      }
    };
  }, []);

  return (
    <div className={styles.menuContainer} ref={menuContainer}>
      <div
        className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen : ""}`}
        ref={menuBarRef}
      >
        <div className={styles.menuBarContainer}>
          <div className={styles.menuLogo} onClick={closeMenu}>
            <Link href="/">
              <Image src={logo} width={200} height={16} alt="jv venture logo" />
            </Link>
          </div>
          <div className={styles.menuActions}>
            <div className={styles.menuToggle}>
              <button
                className={`${styles.hamburgerIcon} ${
                  isMenuOpen ? styles.active : ""
                }`}
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              ></button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.menu}>
        <div className={styles.menuCol}>
          <div className={styles.menuSubCol}>
            <div className={styles.menuLinks}>
              {menuLinks.map((link, index) => (
                <div key={index} className={styles.menuLinkItem}>
                  <div className={styles.menuLinkItemHolder}>
                    <Link
                      href={link.path}
                      className={styles.menuLink}
                      onClick={() => handleLinkClick(link.path)}
                    >
                      {link.label}
                    </Link>

                    {link.children && (
                      <div className={styles.subMenu}>
                        {link.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.path}
                            className={styles.subLink}
                            onClick={() => handleLinkClick(child.path)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
