/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";

const MosaicReveal = ({ src }: { src: string }) => {
  const grid = 4; // 4x4
  const total = grid * grid;
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
    <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-0">
      {Array.from({ length: total }).map((_, i) => {
        const x = i % grid;
        const y = Math.floor(i / grid);
        const delay = indices.indexOf(i) * 0.05;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${grid * 100}% ${grid * 100}%`,
              backgroundPosition: `${(x / (grid - 1)) * 100}% ${(y / (grid - 1)) * 100}%`,
              backgroundRepeat: 'no-repeat'
            }}
            className="w-full h-full"
          />
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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bgColor, setBgColor] = useState("#3d2b1f");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  // GSAP refs — mobile only
  const mobileNameRef = useRef<HTMLDivElement>(null);
  const mobileCanvasWrapperRef = useRef<HTMLDivElement>(null);
  const mobilePinnedNavRightRef = useRef<HTMLDivElement>(null);
  const mobilePinnedNavLeftRef = useRef<HTMLDivElement>(null);

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
      const sectionHeight = window.innerHeight * (isMobile ? 0.5 : 2.5);
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
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? parent.clientWidth : Math.min(parent.clientWidth, parent.clientHeight);
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
    if (!isMobile) return;

    const nameEl = mobileNameRef.current;
    const canvasWrapper = mobileCanvasWrapperRef.current;
    const navRight = mobilePinnedNavRightRef.current;
    const navLeft = mobilePinnedNavLeftRef.current;

    if (!nameEl) return;

    // ── Initial Setup ──
    // Hide secondary elements completely
    gsap.set([canvasWrapper, navRight, navLeft].filter(Boolean), { opacity: 0, y: 20 });

    // Center the name on the full viewport by shifting it down from its natural position
    const centerOffset = window.innerHeight * 0.25;
    gsap.set(nameEl, {
      y: centerOffset,
      opacity: 0,
      filter: "blur(40px)",
      zIndex: 100,
    });

    // ── Build Timeline ──
    const tl = gsap.timeline();

    // Step 1: Blur-fade the name from invisible+blurry to sharp and solid
    tl.to(nameEl, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.4,
      ease: "power3.out",
    });

    // Step 2: Hold 0.5s, then migrate name upward to its final natural position
    // We add both the horizontal stretch (scaleX) and the previous vertical stretch (scaleY)
    tl.to(nameEl, {
      y: 0,
      scaleX: 1.1, // Requested horizontal stretch
      scaleY: 1.6, // Restoring your preferred vertical stretch
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

    return () => { tl.kill(); };
  }, [isLoading]);


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
        <div className="relative h-[150vh] md:h-[350vh]">
          <div className="sticky top-0 h-screen w-full flex flex-col-reverse md:flex-row-reverse overflow-hidden" style={{ backgroundColor: bgColor }}>

            {/* Pinned Nav — RIGHT */}
            <div
              ref={mobilePinnedNavRightRef}
              className="absolute top-4 right-6 md:top-12 md:right-12 font-mono text-[8px] md:text-[10px] tracking-widest uppercase text-white/40 flex items-center gap-4 z-20"
            >
              <span>01 / 04</span>
              <div className="w-8 md:w-16 h-[1px] bg-white/40" />
              <span>PORTFOLIO OVERVIEW</span>
            </div>

            {/* Pinned Nav — LEFT */}
            <div
              ref={mobilePinnedNavLeftRef}
              className="absolute top-4 left-6 md:top-12 md:left-20 font-mono text-[8px] md:text-[10px] tracking-widest uppercase text-white/40 flex items-center gap-4 z-20"
            >
              <span>2026</span>
              <div className="w-8 md:w-16 h-[1px] bg-white/40" />
              <span>DOHA-QATAR</span>
            </div>

            {/* Bottom Half on Mobile: Video/Canvas */}
            <div
              ref={mobileCanvasWrapperRef}
              className="relative w-full md:flex-1 flex items-end justify-center md:items-center pb-0 px-4 md:p-12"
            >
              <div className="relative w-full aspect-square max-w-4xl z-10 md:mt-0">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            </div>

            {/* Top Half on Mobile: Branding */}
            <div className="relative flex-1 flex flex-col justify-start items-start pt-20 md:pt-0 pb-4 md:pb-0 md:pl-20 px-4 z-10 w-full">
              <div className="flex flex-col items-start md:items-start text-left md:text-left w-full max-w-2xl mt-4 md:mt-8">
                <div className="flex flex-col w-full items-start md:items-start select-none">

                  {/* ── Mobile Name Block (GSAP-animated) ── */}
                  <div
                    ref={mobileNameRef}
                    className="md:hidden flex flex-col w-full items-start font-black uppercase px-0"
                    style={{
                      fontFamily: '"Anton", sans-serif',
                      lineHeight: 0.8,
                      letterSpacing: '-0.02em',
                      fontSize: 'clamp(4.5rem, 18vw, 12rem)',
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
                      <span className="text-[#f97316]" style={{ textShadow: "0 0 40px rgba(249,115,22,0.4)" }}>
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
        <section className="bg-[#f5f5dc] text-black h-screen flex flex-col md:flex-row items-stretch overflow-hidden">
          <div className="w-full h-[50vh] md:h-screen md:w-1/2 relative bg-[#f5f5dc] overflow-hidden flex items-center justify-center">
            <div className="w-full aspect-square md:h-full md:w-auto flex items-center justify-center">
              <MosaicReveal src="https://raw.githubusercontent.com/sabism12/PORTFOLIO/main/portrait/Whisk_6686b85e16b3fb0a6754b85d88a96a5ceg.png" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex bg-black text-white px-4 py-8 flex-col items-center gap-4 rounded-sm shadow-2xl z-10">
              <span className="font-bold text-2xl">S.</span>
              <div className="h-24 w-[1px] bg-white/20" />
              <span className="[writing-mode:vertical-rl] font-bold tracking-widest uppercase text-[12px] py-4">Engineer</span>
            </div>
          </div>

          <div className="w-full h-[50vh] md:h-screen md:w-1/2 flex flex-col justify-center p-4 md:p-24 bg-[#f5f5dc] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-[9px] md:text-xs tracking-[0.5em] uppercase opacity-40 mb-2 md:mb-8 flex items-center gap-4">
                <div className="w-4 md:w-8 h-[1px] bg-black" />
                About Me
              </h2>
              <div className="text-xl md:text-4xl font-bold leading-[1.2] tracking-tight mb-4 md:mb-8 text-black">
                Iam Structural Design Engineer specializing in high-rise and industrial steel structures, with strong expertise in analysis-driven design.
              </div>
              <div className="text-[12px] md:text-base opacity-70 leading-relaxed max-w-xl text-black">
                Experienced in forensic engineering, structural retrofitting, and verification through FEA and manual hand calculations. Delivering safe, code-compliant designs across all stages.
              </div>
              <div className="mt-4 md:mt-12 flex gap-4">
                <div className="px-4 py-2 md:px-6 md:py-3 border border-black/10 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors cursor-pointer text-black">
                  Download CV
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="relative z-10 min-h-screen px-6 py-24 md:px-20 bg-black">
          <div className="max-w-7xl mx-auto">
            <header className="mb-20">
              <h2 className="font-display text-6xl md:text-8xl uppercase tracking-tighter mb-4 text-white">Selected Projects</h2>
              <div className="h-1 w-20 bg-white/20" />
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {[
                { title: "Industrial Complex", location: "Dubai, UAE", type: "Steel Structure" },
                { title: "Residential Tower", location: "Abu Dhabi", type: "Reinforced Concrete" },
                { title: "Bridge Infrastructure", location: "Muscat, Oman", type: "Post-Tensioned" },
                { title: "Commercial Hub", location: "Doha, Qatar", type: "Composite Design" }
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-zinc-900/50 rounded-3xl overflow-hidden mb-6 relative">
                    <img
                      src={`https://picsum.photos/seed/struct${i}/800/600`}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-white">
                      {project.type}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-tight mb-1 text-white">{project.title}</h3>
                  <p className="text-xs font-bold tracking-widest uppercase opacity-40 text-white">{project.location}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-10 flex justify-between items-center bg-black">
          <div className="text-sm font-display uppercase tracking-tighter text-white">Sabith © 2026</div>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase opacity-40 text-white">
            <a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Email</a>
          </div>
        </footer>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: (!isLoading && currentFrame < 10) ? 1 : 0 }}
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
