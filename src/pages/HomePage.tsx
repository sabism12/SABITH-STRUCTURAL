/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import ProjectsPage from "./ProjectsPage";
import Footer from "../components/Footer";

const ABOUT_ME_COPY =
  "Specializing in high-rise and industrial steel structures, with strong expertise in analysis-driven design. Experienced in forensic engineering, structural retrofitting, and verification through FEA and manual hand calculations. Proven ability to deliver safe, code-compliant designs across design, BIM, and construction stages, with a clear focus on technical excellence and chartership development through IStructE.";

const MosaicReveal = ({ src }: { src: string }) => {
  const grid = 4;
  const total = grid * grid;
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile: IntersectionObserver triggers CSS class-based spring animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Only attach observer for mobile viewports
    if (window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop: keep original random-stagger framer-motion animation
  const [indices, setIndices] = useState<number[]>([]);
  useEffect(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setIndices(arr);
  }, [total]);

  return (
    <div ref={containerRef} className="mosaic-container grid grid-cols-4 grid-rows-4 w-full h-full gap-0">
      {Array.from({ length: total }).map((_, i) => {
        const x = i % grid;
        const y = Math.floor(i / grid);
        const bgStyle = {
          backgroundImage: `url(${src})`,
          backgroundSize: `${grid * 100}% ${grid * 100}%`,
          backgroundPosition: `${(x / (grid - 1)) * 100}% ${(y / (grid - 1)) * 100}%`,
          backgroundRepeat: 'no-repeat' as const,
        };

        return (
          // Mobile: pure CSS block with --index for stagger delay
          // Desktop: framer-motion random-order reveal (hidden on mobile via md: class)
          <>
            {/* Mobile block */}
            <div
              key={`m-${i}`}
              className="mosaic-block md:hidden w-full h-full"
              style={{ ...bgStyle, ['--index' as string]: i }}
            />
            {/* Desktop block */}
            <motion.div
              key={`d-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: indices.indexOf(i) * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={bgStyle}
              className="hidden md:block w-full h-full"
            />
          </>
        );
      })}
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const nextProgress = Math.min(100, (elapsed / 2700) * 100);
      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm text-muted uppercase tracking-[0.3em]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Portfolio
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)",
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [bgColor, setBgColor] = useState("#3d2b1f");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  // GSAP refs — mobile only
  const mobileNameRef = useRef<HTMLDivElement>(null);
  const mobileCanvasWrapperRef = useRef<HTMLDivElement>(null);
  const mobilePinnedNavRightRef = useRef<HTMLDivElement>(null);
  const mobilePinnedNavLeftRef = useRef<HTMLDivElement>(null);
  const aboutMeTextRef = useRef<HTMLParagraphElement>(null);

  // Mobile-only About -> Projects transition refs
  const aboutStickyFxRef = useRef<HTMLElement>(null);
  const projectsOverlayRef = useRef<HTMLElement>(null);
  const projectsCardsRef = useRef<HTMLDivElement>(null);
  const [projectsFrozen, setProjectsFrozen] = useState(false);
  const projectsFrozenRef = useRef(false);

  const frameCount = 150;
  const baseUrl = "https://raw.githubusercontent.com/sabism12/PORTFOLIO/main";

  const topWord = "MOHAMMED";
  const bottomWord = "SABITH";

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const frameIndex = i.toString().padStart(3, '0');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${baseUrl}/ezgif-frame-${frameIndex}.png`;

        img.onload = () => {
          loadedImages[i - 1] = img;
          loadedCount++;
          checkComplete();
        };

        img.onerror = () => {
          console.warn(`Frame ${frameIndex} missing at ${img.src}`);
          setFailedImages(prev => [...prev, frameIndex]);
          loadedCount++;
          checkComplete();
        };

        const checkComplete = () => {
          if (loadedCount === frameCount) {
            setImages(loadedImages.filter(img => img !== undefined));
          }
        };
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const pixel = context.getImageData(10, 10, 1, 1).data;
        const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        setBgColor(rgbColor);
        document.body.style.backgroundColor = rgbColor;
      } catch (e) {
        console.warn("Could not sample pixel color:", e);
      }
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const sectionHeight = window.innerHeight * (isMobile ? 2.0 : 2.5);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / sectionHeight));
      const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
      requestAnimationFrame(() => {
        renderFrame(frameIndex);
        setCurrentFrame(frameIndex);
      });
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        if (size > 0) {
          canvas.width = size;
          canvas.height = size;
        }
      }
      renderFrame(currentFrame);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading, images, currentFrame]);

  // ─── GSAP Mobile Hero Sequence ───────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;
    const isMobile = window.innerWidth < 768;

    const nameEl = mobileNameRef.current;
    const canvasWrapper = mobileCanvasWrapperRef.current;
    const navRight = mobilePinnedNavRightRef.current;
    const navLeft = mobilePinnedNavLeftRef.current;

    // Keep the scroll indicator hidden until the hero reveal is complete.
    setHeroReady(false);

    if (!isMobile) {
      if (canvasWrapper) gsap.set(canvasWrapper, { opacity: 1, y: 0, scale: 1 });
      setHeroReady(true);
      return;
    }

    if (!nameEl) {
      setHeroReady(true);
      return;
    }

    // ── Initial Setup ──
    // Hide secondary elements completely
    gsap.set([canvasWrapper, navRight, navLeft].filter(Boolean), { opacity: 0, y: 20 });

    // Center the name on the full viewport by calculating the difference between its natural top and the center
    const nameRect = nameEl.getBoundingClientRect();
    const currentTop = nameRect.top;
    const targetTop = (window.innerHeight / 2) - (nameRect.height / 2);
    const centerOffset = targetTop - currentTop;

    gsap.set(nameEl, {
      y: centerOffset,
      opacity: 0,
      filter: "blur(40px)",
      zIndex: 100,
    });

    // ── Animation Start ──
    const tl = gsap.timeline({
      delay: 0.1,
    });

    // Phase 1: Sudden pop-in (heavy blur fade) in the center
    tl.to(nameEl, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power2.out",
    });

    // Shift its resting position slightly and pause
    tl.to({}, { duration: 0.4 });

    // Phase 2: Migrate to the top (final position)
    tl.to(nameEl, {
      x: 0,
      y: 0,
      scaleX: 1.15, // Moderate horizontal stretch to fill the right gap
      scaleY: 1.85, // Increased vertical stretch
      transformOrigin: "top left",
      duration: 1.1,
      ease: "power3.inOut",
    }, "+=0.5");

    // Step 3: Simultaneously reveal rest of hero — canvas model + nav metadata
    tl.to([canvasWrapper, navRight, navLeft].filter(Boolean), {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.inOut",
      stagger: 0.1,
    }, "<");

    tl.eventCallback("onComplete", () => {
      setHeroReady(true);
    });

    return () => { tl.kill(); };
  }, [isLoading]);

  // Mobile-only: scale/blur About as Projects enters viewport
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 767px)");
    let rafId = 0;

    const syncMobile = () => setIsMobile(mql.matches);

    const setFx = (progress01: number) => {
      const aboutEl = aboutStickyFxRef.current;
      if (!aboutEl) return;

      const eased = progress01 * progress01 * (3 - 2 * progress01);
      const scale = 1 - eased * 0.035;
      const blurPx = eased * 4;
      const zPx = -eased * 48;
      const liftPx = -eased * 16;
      const opacity = 1 - eased * 0.08;

      aboutEl.style.setProperty("--about-scale", scale.toFixed(4));
      aboutEl.style.setProperty("--about-blur", `${blurPx.toFixed(2)}px`);
      aboutEl.style.setProperty("--about-z", `${zPx.toFixed(1)}px`);
      aboutEl.style.setProperty("--about-y", `${liftPx.toFixed(1)}px`);
      aboutEl.style.setProperty("--about-opacity", opacity.toFixed(3));
    };

    const setProjectsFx = (progress01: number) => {
      const cardsEl = projectsCardsRef.current;
      if (!cardsEl) return;

      const eased = progress01 * progress01 * (3 - 2 * progress01);
      const translateYPx = (1 - eased) * 36;
      const scale = 0.985 + eased * 0.015;
      const opacity = 0.68 + eased * 0.32;
      const blurPx = (1 - eased) * 8;

      cardsEl.style.setProperty("--projects-y", `${translateYPx.toFixed(1)}px`);
      cardsEl.style.setProperty("--projects-scale", scale.toFixed(4));
      cardsEl.style.setProperty("--projects-opacity", opacity.toFixed(3));
      cardsEl.style.setProperty("--projects-blur", `${blurPx.toFixed(2)}px`);
    };

    const update = () => {
      rafId = 0;

      if (!mql.matches) {
        setFx(0);
        setProjectsFx(1);
        if (projectsFrozenRef.current) {
          projectsFrozenRef.current = false;
          setProjectsFrozen(false);
        }
        return;
      }

      // Keep the cards frozen once Projects reaches the top, so the footer can slide over them.
      const projectsEl = projectsOverlayRef.current;
      if (projectsEl) {
        const shouldFreeze = projectsEl.getBoundingClientRect().top <= 0;
        if (shouldFreeze !== projectsFrozenRef.current) {
          projectsFrozenRef.current = shouldFreeze;
          setProjectsFrozen(shouldFreeze);
        }
      }

      const cardsEl = projectsCardsRef.current;
      if (!cardsEl) return;

      const top = cardsEl.getBoundingClientRect().top;
      const vh = Math.max(1, window.innerHeight || 1);

      // Start only when the cards overlap the viewport "center-ish" area.
      const startY = vh * 0.82;
      const endY = vh * 0.18;
      const raw = (startY - top) / Math.max(1, startY - endY);
      const progress01 = Math.min(1, Math.max(0, raw));
      setFx(progress01);
      setProjectsFx(progress01);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    const onResize = () => update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const onMediaChange = () => {
      syncMobile();
      update();
    };
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onMediaChange);
    } else {
      // eslint-disable-next-line deprecation/deprecation
      mql.addListener(onMediaChange);
    }

    syncMobile();
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onMediaChange);
      } else {
        // eslint-disable-next-line deprecation/deprecation
        mql.removeListener(onMediaChange);
      }
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const textEl = aboutMeTextRef.current;
    const anime = window.anime;
    if (!textEl) return;

    const words = Array.from(textEl.querySelectorAll(".about-word")) as HTMLElement[];
    if (words.length === 0) return;
    if (!anime || typeof IntersectionObserver === "undefined") {
      words.forEach((word) => {
        word.style.opacity = "1";
        word.style.transform = "translateY(0)";
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        anime({
          targets: words,
          translateY: [30, 0],
          opacity: [0, 1],
          delay: anime.stagger(80),
          duration: 950,
          easing: "easeOutExpo",
        });

        observer.disconnect();
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(textEl);
    return () => observer.disconnect();
  }, []);


  return (
    <div className="relative w-full" style={{ backgroundColor: bgColor }}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div
        className="relative"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-out"
        }}
      >
        <div className="relative h-[300vh] md:h-[350vh]">
          <div className="sticky top-0 h-screen w-full flex flex-col-reverse justify-between md:justify-start md:flex-row-reverse overflow-hidden" style={{ backgroundColor: bgColor }}>

            {/* Pinned Nav — RIGHT */}
            <div
              ref={mobilePinnedNavRightRef}
              className="absolute top-4 right-6 md:top-12 md:right-12 font-mono text-[8px] md:text-[10px] tracking-widest uppercase text-white/40 flex flex-col items-end md:flex-row md:items-center gap-1 md:gap-4 z-20"
            >
              <span>01 / 04</span>
              <div className="w-8 md:w-16 h-[1px] bg-white/40" />
              <span>PORTFOLIO OVERVIEW</span>
            </div>

            {/* Pinned Nav — LEFT */}
            <div
              ref={mobilePinnedNavLeftRef}
              className="absolute top-4 left-6 md:top-12 md:left-20 font-mono text-[8px] md:text-[10px] tracking-widest uppercase text-white/40 flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-4 z-20"
            >
              <span>2026</span>
              <div className="w-8 md:w-16 h-[1px] bg-white/40" />
              <span>DOHA-QATAR</span>
            </div>

            {/* Bottom Half on Mobile: Video/Canvas */}
            <div
              ref={mobileCanvasWrapperRef}
              className="relative w-full flex-1 min-h-0 flex items-center justify-center md:mt-0 pb-4 md:pb-0 px-4 md:p-12"
            >
              <div className="relative w-full h-full max-w-4xl z-10 md:mt-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="max-w-full max-h-full aspect-square" />
              </div>
            </div>

            {/* Top Half on Mobile: Branding */}
            <div className="relative flex-none md:flex-1 flex flex-col justify-start md:justify-center items-start pt-[116px] md:pt-0 mt-0 md:mt-0 pb-4 md:pb-0 md:pl-20 px-4 z-10 w-full">
              <div className="flex flex-col items-start md:items-start text-left md:text-left w-full max-w-2xl md:mt-0">
                <div className="flex flex-col w-full items-start md:items-start select-none">

                  {/* ── Mobile Name Block (GSAP-animated) ── */}
                  <div
                    ref={mobileNameRef}
                    className="md:hidden flex flex-col w-full items-start font-black uppercase px-0"
                    style={{
                      fontFamily: '"Anton", sans-serif',
                      lineHeight: 0.8,
                      letterSpacing: '-0.02em',
                      fontSize: 'clamp(3rem, 16vw, 12rem)',
                    }}
                  >
                    {/* Top Row — MOHAMMED */}
                    <div className="w-full text-left whitespace-nowrap -mt-6">
                      <span className="text-white" style={{ textShadow: "0 0 25px rgba(255,255,255,0.4)" }}>
                        {topWord}
                      </span>
                    </div>

                    {/* Bottom Row — SABITH */}
                    <div className="w-full text-left whitespace-nowrap mt-4">
                      <span className="text-[#f97316]" style={{ textShadow: "0 0 40px rgba(249,115,22,0.4)", letterSpacing: "0.02em" }}>
                        {bottomWord}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Name Block (Impact) — untouched */}
                  <AnimatePresence>
                    {currentFrame >= 40 && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                        }}
                        className="hidden md:flex flex-col w-full items-start"
                      >
                        <div className="flex flex-col w-full items-start font-black leading-[0.85] uppercase mb-12" style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 6.5rem)' }}>
                          <motion.div
                            variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                            className="text-white" style={{ textShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                          >
                            SABITH //
                          </motion.div>
                          <motion.div
                            variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                            className="text-[#f97316]" style={{ textShadow: "0 0 40px rgba(249,115,22,0.4)" }}
                          >
                            STRUCTURAL
                          </motion.div>
                          <motion.div
                            variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                            className="text-white" style={{ textShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                          >
                            ENGINEER
                          </motion.div>
                        </div>

                        <motion.div
                          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                          className="w-full flex flex-col items-start"
                        >
                          <div className="text-white/70 max-w-xl font-sans text-base leading-relaxed text-left">
                            Strength in design, precision in execution. I transform complex engineering challenges into safe, efficient, and buildable realities.
                          </div>
                          <div className="flex gap-4 mt-12">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors">
                              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors">
                              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors">
                              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </a>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <section
          ref={aboutStickyFxRef}
          className="about-sticky about-sticky-fx text-black flex flex-col md:flex-row items-stretch overflow-hidden min-h-screen"
          style={{ backgroundColor: '#f5f0e8' }}
        >

          {/* IMAGE — top on mobile, left on desktop */}
          <div className="about-image w-full md:w-1/2 order-first md:order-none relative overflow-hidden flex items-center justify-center bg-[#f5f0e8]">
            <div className="about-image-media w-full aspect-square md:w-auto md:h-screen md:max-h-screen md:aspect-square flex items-center justify-center">
              <MosaicReveal src="https://raw.githubusercontent.com/sabism12/PORTFOLIO/main/portrait/Whisk_6686b85e16b3fb0a6754b85d88a96a5ceg.png" />
            </div>
            {/* Desktop sidebar badge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex bg-black text-white px-4 py-8 flex-col items-center gap-4 rounded-sm shadow-2xl z-10">
              <span className="font-bold text-2xl">S.</span>
              <div className="h-24 w-[1px] bg-white/20" />
              <span className="[writing-mode:vertical-rl] font-bold tracking-widest uppercase text-[12px] py-4">Engineer</span>
            </div>
          </div>

          {/* TEXT — below image on mobile, right on desktop */}
          <div className="about-text w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:p-24 overflow-hidden" style={{ backgroundColor: '#f5f0e8' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-start w-full h-full"
            >
              {/* Label */}
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-6 md:w-10 h-[2px]" style={{ backgroundColor: '#e85d1a' }} />
                <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold" style={{ color: '#e85d1a', opacity: 0.7 }}>
                  Portfolio / 2026
                </span>
              </div>

              {/* Main heading — orange, bold, impact-style like screenshot */}
              <h2
                className="font-black uppercase leading-[0.9] mb-4 md:mb-10"
                style={{
                  fontFamily: 'Impact, "Arial Black", sans-serif',
                  fontSize: 'clamp(2.4rem, 8vw, 5rem)',
                  color: '#e85d1a',
                  letterSpacing: '-0.01em',
                }}
              >
                STRUCTURAL<br />ENGINEER
              </h2>

              {/* Body copy */}
              <div className="about-body w-full">
                <p
                  ref={aboutMeTextRef}
                  className="about-me-text mb-4 md:mb-10 font-sans tracking-wide"
                  style={{ 
                    color: '#e85d1a', 
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', 
                    lineHeight: '1.4',
                    maxWidth: '45ch',
                    fontWeight: 400
                  }}
                >
                  {ABOUT_ME_COPY.split(" ").map((word, index, arr) => (
                    <span key={`${word}-${index}`}>
                      <span className="about-word">{word}</span>
                      {index < arr.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
              </div>

              {/* CTA */}
              <div className="about-cta flex gap-4 mt-2">
                <a
                  href="https://drive.google.com/file/d/1nXl56qr49xzO45P3B3MRWhPoZAlYczge/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 md:px-7 md:py-3 text-[9px] md:text-[11px] font-bold tracking-widest uppercase cursor-pointer transition-all duration-300"
                  style={{
                    border: '2px solid #e85d1a',
                    color: '#e85d1a',
                    borderRadius: '999px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#e85d1a';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#e85d1a';
                  }}
                >
                  Download CV
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Page (after About) */}
        <section
          ref={projectsOverlayRef}
          id="projects"
          className={`projects-overlay relative z-10 ${projectsFrozen ? "is-frozen" : ""}`}
        >
          <div className="projects-scroll-buffer" aria-hidden="true" />
          <div ref={projectsCardsRef} className="projects-overlay-inner">
            <ProjectsPage enableGlobalWheel={false} embedded={isMobile} />
          </div>
        </section>

        {/* Footer */}
        <Footer />
        {/*
        <footer className="border-t border-white/5 py-10 px-10 flex justify-between items-center bg-black">
          <div className="text-sm font-display uppercase tracking-tighter text-white">Sabith © 2026</div>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase opacity-40 text-white">
            <a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Email</a>
          </div>
        </footer>
        */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: (!isLoading && heroReady && currentFrame < 10) ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 pointer-events-none w-full px-4"
      >
        <div className="font-mono text-[10px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase overflow-visible whitespace-nowrap opacity-100 md:opacity-40 font-bold md:font-normal text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] md:drop-shadow-none text-center">
          <span className="md:hidden">SWIPE TO INSPECT</span>
          <span className="hidden md:inline">SCROLL_TO_BUILD.EXE</span>
        </div>
        <div className="relative h-16 w-[1px] bg-white/40 md:bg-white/20">
          <motion.div
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-4 bg-white"
          />
        </div>
      </motion.div>
    </div>
  );
}
