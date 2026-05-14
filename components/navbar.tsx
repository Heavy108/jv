"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "@/css/navbar.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";

interface MenuLink {
  path: string;
  label: string;
  children?: { path: string; label: string }[];
}

// Up-right arrow icon used on every row
const ArrowIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
);

// Chevron for parents with submenu — rotates when open
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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
        // { path: "#", label: "Empower" },
      ],
    },
    { path: "#", label: "About" },
  ];

  const pathname = usePathname();
  const menuContainer = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [shouldDelayClose, setShouldDelayClose] = useState<boolean>(false);
  // Track which submenus are open. Initialised with every parent label that
  // has children, so all submenus are expanded by default when the menu opens.
  const initialOpenSubmenus = (): Set<string> =>
    new Set(menuLinks.filter((l) => l.children?.length).map((l) => l.label));
  const [openSubmenus, setOpenSubmenus] =
    useState<Set<string>>(initialOpenSubmenus);

  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  const menuLinksAnimation = useRef<gsap.core.Timeline | null>(null);
  const menuBarAnimation = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);
  const previousPathRef = useRef<string>(pathname);

  const lockModeRef = useRef<"fixed" | "overflow" | null>(null);

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
    // When the menu re-opens we want all submenus expanded again,
    // even if the user collapsed some last time.
    if (!newMenuState) setOpenSubmenus(initialOpenSubmenus());
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setOpenSubmenus(initialOpenSubmenus());
      toggleBodyScroll(false);
    }
  };

  const handleLinkClick = (path: string) => {
    if (path !== pathname) {
      setShouldDelayClose(true);
    }
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((cur) => {
      const next = new Set(cur);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

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

  useGSAP(
    () => {
      if (windowWidth === 0) return;

      gsap.set(`.${styles.menuLinkItemHolder}`, { y: 80 });

      menuAnimation.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.menu}`, {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        });

      const heightValue =
        windowWidth < 1000 ? "calc(65% - 2.5em)" : "calc(85% - 4em)";

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

  useEffect(() => {
    const MIN_DELTA = 8;

    const handleScroll = () => {
      if (isMenuOpen) return;

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
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < MIN_DELTA) {
        return;
      }

      if (delta > 0) {
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncToLockState = () => {
      if (isMenuOpen) return;
      if (document.body.classList.contains("lock-navbar")) {
        gsap.to(`.${styles.menuBar}`, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        lastScrollY.current = window.scrollY;
      }
    };

    syncToLockState();

    const mo = new MutationObserver(syncToLockState);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => mo.disconnect();
  }, [isMenuOpen]);

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
        <div className={styles.menuLinks}>
          {menuLinks.map((link, index) => {
            const hasChildren = !!link.children?.length;
            const isOpen = openSubmenus.has(link.label);

            return (
              <div key={index} className={styles.menuLinkItem}>
                <div className={styles.menuLinkItemHolder}>
                  {hasChildren ? (
                    // Parent row with children — clicking toggles the
                    // accordion, doesn't navigate
                    <button
                      type="button"
                      className={styles.menuLinkRow}
                      onClick={() => toggleSubmenu(link.label)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.menuLinkLabel}>{link.label}</span>
                      <span className={styles.menuLinkIcon}>
                        <ChevronIcon open={isOpen} />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={link.path}
                      className={styles.menuLinkRow}
                      onClick={() => handleLinkClick(link.path)}
                    >
                      <span className={styles.menuLinkLabel}>{link.label}</span>
                      <span className={styles.menuLinkIcon}>
                        <ArrowIcon />
                      </span>
                    </Link>
                  )}

                  {/* Accordion submenu */}
                  {hasChildren && (
                    <div
                      className={`${styles.subMenu} ${
                        isOpen ? styles.subMenuOpen : ""
                      }`}
                    >
                      <div className={styles.subMenuInner}>
                        {link.children!.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.path}
                            className={styles.subLinkRow}
                            onClick={() => handleLinkClick(child.path)}
                          >
                            <span className={styles.subLinkLabel}>
                              {child.label}
                            </span>
                            <span className={styles.menuLinkIcon}>
                              <ArrowIcon />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
