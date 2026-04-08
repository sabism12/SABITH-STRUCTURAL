/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Lenis from "lenis";

type ProjectsPageProps = {
  enableGlobalWheel?: boolean;
  embedded?: boolean;
};

export default function ProjectsPage({ enableGlobalWheel = true, embedded = false }: ProjectsPageProps) {
  const [view, setView] = useState<"list" | "analysis">("list");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(0);
  const [activeAnalysisImage, setActiveAnalysisImage] = useState(0);
  const [activeSlabImage, setActiveSlabImage] = useState(0);
  const [activeFoundationImage, setActiveFoundationImage] = useState(0);
  const [activeMobileCardId, setActiveMobileCardId] = useState<number>(0);
  const activeMobileCardIdRef = useRef<number>(0);
  const restoreMobileCarouselOnMountRef = useRef(false);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    // Safari < 14 fallback
    // eslint-disable-next-line deprecation/deprecation
    mediaQuery.addListener(update);
    // eslint-disable-next-line deprecation/deprecation
    return () => mediaQuery.removeListener(update);
  }, []);

  // Reset scroll position and image indices when view or project changes
  useEffect(() => {
    if (view === "analysis") {
      // When embedded on the Home page (mobile), don't scroll the whole window back to Hero.
      if (!embedded && !isMobile) window.scrollTo(0, 0);
      setActiveAnalysisImage(0);
      setActiveSlabImage(0);
      setActiveFoundationImage(0);
    }
  }, [view, selectedProjectId, embedded, isMobile]);

  const openCase = (
    e: MouseEvent<HTMLButtonElement> | undefined,
    projectId?: number,
  ) => {
    if (e) e.preventDefault();
    if (embedded) document.body.style.overflow = "hidden";
    if (typeof projectId === "number") setSelectedProjectId(projectId);
    if (!embedded && isMobile) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setView("analysis");
  };

  const closeCase = (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (embedded) document.body.style.overflow = "";
    if (isMobile && typeof selectedProjectId === "number") {
      activeMobileCardIdRef.current = selectedProjectId;
      setActiveMobileCardId(selectedProjectId);
      restoreMobileCarouselOnMountRef.current = true;
    }
    setView("list");
  };

  useEffect(() => {
    // Safety: restore body scroll if this component unmounts while the overlay is open.
    return () => {
      if (embedded) document.body.style.overflow = "";
    };
  }, [embedded]);

  const projects = [
    {
      id: 0,
      title: "Buildings",
      overview: "The structural design of the 2B+G+7 commercial building covers the complete analysis of the superstructure and foundation systems.",
      tags: ["ETABS | SAFE", "EXCEL | SAP 2000", "AutoCad | Revit"],
      industry: "Commercial Real Estate",
      client: "Private Developer",
      heroImage: "https://lh3.googleusercontent.com/d/1q4rJ__ySenApJj0zcbEiw66fzemxIRmw",
      imageName: "1775285005030.png",
      analysisImages: [
        "https://lh3.googleusercontent.com/d/1Kxjq5HfS3gnQ6b09cP1rRXo-EkWgtBFf",
        "https://lh3.googleusercontent.com/d/1Kq70vywpkjgRZoM3njsVFn4XId4BVQND"
      ],
      slabImages: [
        "https://lh3.googleusercontent.com/d/198G4mieNFsH1ebkuH1Xcpg1VupMw14Ay"
      ],
      foundationImages: [
        "https://lh3.googleusercontent.com/d/1O4pID4uOv2ndFNxNoPMfo80JVuwntyLC"
      ],
      analysisDescription: "The superstructure was modeled and analyzed using ETABS. We performed dynamic analysis to ensure resilience against both seismic and wind loads, focusing on shear wall placement.",
      slabTitle: "Slab Design",
      slabDescription: "Slab analysis and design were performed considering both gravity and lateral load distributions. We optimized the reinforcement layout to control deflections and ensure structural integrity.",
      foundationDescription: "Foundation design was carried out using SAFE. The 2B (two basement) levels required a robust raft foundation to handle the vertical loads and lateral earth pressures.",
      year: "2024"
    },
    {
      id: 1,
      title: "Warehouse",
      overview: "Structural design and optimization of a large-scale industrial warehouse featuring long-span steel trusses and heavy-duty flooring.",
      tags: ["Staad.Pro | Prokon", "IdeaStatiCa | Excel", "AutoCad"],
      industry: "Logistics & Warehousing",
      client: "Industrial Logistics Corp",
      heroImage: "https://lh3.googleusercontent.com/d/1FgeymNs7v2rjQqHqka3zTWyiK_dFUQLK",
      imageName: "3DRENDER.png",
      analysisImages: [
        "https://lh3.googleusercontent.com/d/1jgRxKEV5vgbnxbDmwmzZQ8bAlRbd4j-B",
        "https://lh3.googleusercontent.com/d/1evXoYiqY_thn2xqmUg4sErjN2qVDMn_h"
      ],
      slabImages: [
        "https://lh3.googleusercontent.com/d/1Icc1nxedhgH8fYCzmAr-LlhIaPW8Cjas",
        "https://lh3.googleusercontent.com/d/1kwovWRV3tCYCrbrXw-DmerAblwKLgG-D"
      ],
      foundationImages: [
        "https://lh3.googleusercontent.com/d/1aJRkYYbcJU_sSaYnYM5FXtIV1T8-AgBa"
      ],
      analysisDescription: "The warehouse structure was modeled and analyzed using Staad.Pro for heavy industrial loads and wind pressures. Long-span trusses were optimized for material efficiency and structural stability.",
      slabTitle: "Connection Design",
      slabDescription: "Connection and baseplate designs were performed using IdeaStatiCa to ensure robust load transfer and structural stability for the industrial steel frame.",
      foundationDescription: "Isolated and combined footings were designed and analyzed using Prokon based on soil bearing capacity to support the large column reactions from the steel frame.",
      year: "2023"
    },
    {
      id: 2,
      title: "Structural Retrofitting",
      overview: "Seismic rehabilitation and structural strengthening of a G+11 residential tower, upgrading the existing framework.",
      tags: ["ETABS | SAFE", "EXCEL", "AUTOCAD"],
      industry: "Commercial",
      client: "Municipal Heritage Board",
      heroImage: "https://lh3.googleusercontent.com/d/157r9sSrzEmYC_dm7Y6rff7okEh4Q47RT",
      imageName: "main.png",
      analysisImages: [
        "https://lh3.googleusercontent.com/d/1aJHOf088jpFOHfqQJSGN1AfJom8z3ZWV",
        "https://lh3.googleusercontent.com/d/1snEJ4XfhrEy1p9PGBj08kcI-AvoBNU6D"
      ],
      slabImages: [
        "https://lh3.googleusercontent.com/d/1mnIhdgfSw2nRG0Yt1l6pxMhkcGpxOH78"
      ],
      foundationImages: [
        "https://lh3.googleusercontent.com/d/1iKYM1D3PJ-xbk13KM6a8Ya6LKWOeR1kQ"
      ],
      analysisDescription: "The existing structure was modeled and analyzed using ETABS to identify critical stress points under seismic loading. Retrofitting strategies were then simulated to verify the improved performance.",
      slabTitle: "Slab Design",
      slabDescription: "Existing slabs were reinforced using slab jacketing and carbon fiber reinforced polymer (CFRP) to increase their load-carrying capacity and structural integrity.",
      foundationTitle: "Column Jacketing",
      foundationDescription: "Column jacketing was implemented to increase the axial and shear capacity of the existing columns, ensuring they can withstand the increased seismic demands.",
      year: "2025"
    },
    {
      id: 3,
      title: "Residential",
      overview: "Structural design of luxury residential villas, with a portfolio of over 30 completed villa projects focusing on architectural aesthetics.",
      tags: ["Residential Design", "Concrete Cantilevers", "SAFE | ETABS"],
      industry: "Residential Architecture",
      client: "Private Client",
      heroImage: "https://lh3.googleusercontent.com/d/1YdBJUZzSrTtEZLDaN0RMw5WgM2jBKvaM",
      imageName: "3d.png",
      analysisImages: [
        "https://picsum.photos/seed/res_analysis1/800/450",
        "https://picsum.photos/seed/res_analysis2/800/450"
      ],
      slabImages: [
        "https://picsum.photos/seed/res_slab/800/450"
      ],
      foundationImages: [
        "https://picsum.photos/seed/res_foundation/800/450"
      ],
      analysisDescription: "The villa's complex geometry, including large cantilevers, required rigorous finite element analysis to ensure deflection control and structural safety.",
      slabTitle: "Slab Design",
      slabDescription: "Post-tensioned slabs were utilized to achieve the long spans and thin profiles requested for the architectural aesthetic.",
      foundationDescription: "A combined raft foundation was designed to accommodate the varying column loads and ensure uniform settlement across the site.",
      year: "2024"
    }
  ];

  // Mobile carousel: mark the card closest to the viewport center as "active"
  useEffect(() => {
    if (view !== "list") return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    // With AnimatePresence `mode="wait"`, `view` can flip to "list" before the list DOM
    // (and therefore `mobileCarouselRef.current`) is actually mounted. Retry until it is.
    let rafId = 0;
    let retryRafId = 0;
    let mounted = true;
    let cleanupHandlers: (() => void) | null = null;

    const initWhenReady = () => {
      retryRafId = 0;
      if (!mounted) return;

      const el = mobileCarouselRef.current;
      if (!el) {
        retryRafId = window.requestAnimationFrame(initWhenReady);
        return;
      }
      if (!el.querySelector("[data-card-id]")) {
        retryRafId = window.requestAnimationFrame(initWhenReady);
        return;
      }

      const centerCard = (id: number) => {
        const target = el.querySelector(`[data-card-id="${id}"]`) as HTMLElement | null;
        if (!target) return false;

        const prevScrollBehavior = el.style.scrollBehavior;
        el.style.scrollBehavior = "auto";

        const containerRect = el.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const delta =
          (targetRect.left + targetRect.width / 2) - (containerRect.left + containerRect.width / 2);

        if (Math.abs(delta) < 1) {
          el.style.scrollBehavior = prevScrollBehavior;
          return true;
        }

        el.scrollTo({ left: el.scrollLeft + delta, behavior: "auto" });
        el.style.scrollBehavior = prevScrollBehavior;
        return true;
      };

      const updateActive = () => {
        rafId = 0;
        const cards = Array.from(el.querySelectorAll("[data-card-id]")) as HTMLElement[];
        if (cards.length === 0) return;

        const viewportCenterX = window.innerWidth / 2;
        let bestId = activeMobileCardIdRef.current;
        let bestDist = Number.POSITIVE_INFINITY;

        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const dist = Math.abs(centerX - viewportCenterX);
          if (dist < bestDist) {
            bestDist = dist;
            const idAttr = card.getAttribute("data-card-id");
            if (idAttr) bestId = parseInt(idAttr, 10);
          }
        }

        if (!Number.isNaN(bestId) && bestId !== activeMobileCardIdRef.current) {
          activeMobileCardIdRef.current = bestId;
          setActiveMobileCardId(bestId);
        }
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(updateActive);
      };

      // Init and keep in sync
      if (restoreMobileCarouselOnMountRef.current) {
        restoreMobileCarouselOnMountRef.current = false;
        centerCard(typeof selectedProjectId === "number" ? selectedProjectId : activeMobileCardIdRef.current);
      }
      updateActive();
      el.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      cleanupHandlers = () => {
        el.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    };

    initWhenReady();

    return () => {
      mounted = false;
      if (cleanupHandlers) cleanupHandlers();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (retryRafId) window.cancelAnimationFrame(retryRafId);
    };
    // Intentionally omit activeMobileCardId from deps; we only need to resubscribe on view changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    activeMobileCardIdRef.current = activeMobileCardId;
  }, [activeMobileCardId]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const currentProject = useMemo(() => 
    selectedProjectId !== null ? projects[selectedProjectId] : null, 
  [selectedProjectId, projects]);

  // Handle scroll-to-select logic for PC
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || view !== "list") return;

    const observerOptions = {
      root: container,
      rootMargin: "-40% 0px -40% 0px", // More generous intersection area (middle 20%)
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idAttr = entry.target.getAttribute("data-project-id");
          if (idAttr !== null) {
            setSelectedProjectId(parseInt(idAttr));
          }
        }
      });
    }, observerOptions);

    const items = container.querySelectorAll("[data-project-id]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [view, projects]);

  // Smooth scrolling with Lenis for PC
  useEffect(() => {
    if (view !== "list" || window.innerWidth < 768) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.querySelector('.lenis-content') as HTMLElement,
      lerp: 0.08, // Slightly more smoothing
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Global wheel handler to proxy to lenis
    const handleGlobalWheel = (e: WheelEvent) => {
      if (view !== "list" || window.innerWidth < 768) return;
      
      // If we are NOT over the container, we manually scroll it via lenis
      if (!container.contains(e.target as Node)) {
        // Use lenis.scrollTo for smooth relative movement
        // We use the current lenis scroll position + delta
        lenis.scrollTo(lenis.scroll + e.deltaY, { 
          immediate: false,
          force: true
        });
      }
    };

    // Explicitly handle top/bottom selection
    const handleScroll = () => {
      if (lenis.scroll <= 10) {
        setSelectedProjectId(projects[0].id);
      } else if (lenis.scroll >= lenis.limit - 10) {
        setSelectedProjectId(projects[projects.length - 1].id);
      }
    };

    lenis.on('scroll', handleScroll);
    if (enableGlobalWheel) {
      window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    }

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (enableGlobalWheel) {
        window.removeEventListener('wheel', handleGlobalWheel);
      }
    };
  }, [view, projects, enableGlobalWheel]);

  const handleProjectClick = (id: number) => {
    isScrollingRef.current = true;
    setSelectedProjectId(id);
    
    const container = scrollContainerRef.current;
    if (container) {
      const target = container.querySelector(`[data-project-id="${id}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const rootBgClass = embedded
    ? (view === "analysis" ? "bg-black" : "bg-transparent")
    : "bg-[#ffebe6]";

  const listTransition = isMobile
    ? {
        initial: { opacity: 1, scale: 1, filter: "blur(0px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: undefined,
      };

  const analysisTransition = isMobile
    ? {
        initial: { opacity: 0, y: 14, scale: 1.01, filter: "blur(12px)" },
        animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, y: 14, scale: 1.01, filter: "blur(12px)" },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: undefined,
      };

  return (
    <div
      className={`min-h-screen ${rootBgClass} text-[#dc461e] font-sans selection:bg-[#dc461e] selection:text-[#ffebe6] overflow-x-hidden`}
    >
      <AnimatePresence mode={isMobile ? "sync" : "wait"}>
        {view === "list" ? (
          <motion.div 
            key="list"
            initial={listTransition.initial}
            animate={listTransition.animate}
            exit={listTransition.exit}
            transition={listTransition.transition}
            className="w-full flex flex-col min-h-screen md:h-screen md:overflow-hidden px-5 md:px-0 pt-6 md:pt-0"
          >
            {/* Desktop Layout (Split Screen) */}
            <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-24 items-stretch h-full max-h-screen overflow-hidden">
              {/* Left Side: Selected Project Details */}
              <div className="flex flex-col justify-start h-full pt-4 pl-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentProject && (
                    <motion.div
                      key={currentProject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col w-full max-w-xl"
                    >
                      {/* Image Section */}
                      <div className="w-full mb-6">
                        <img 
                          src={currentProject.heroImage} 
                          alt={currentProject.imageName}
                          className="w-full object-cover shadow-sm h-[55vh]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Project Details Grid */}
                      <div className="flex flex-col border-t border-[#dc461e]/40 px-0">
                        <div className="py-1.5 grid grid-cols-12 gap-4 border-b border-[#dc461e]/20">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-[#dc461e]">Overview</h2>
                          </div>
                          <div className="col-span-8">
                            <p className="text-[14px] lg:text-[15px] leading-snug text-[#dc461e]/80">{currentProject.overview}</p>
                          </div>
                        </div>

                        <div className="py-1.5 grid grid-cols-12 gap-4 border-b border-[#dc461e]/20">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-[#dc461e]">Softwares</h2>
                          </div>
                          <div className="col-span-8">
                            <div className="flex flex-col gap-0">
                              {currentProject.tags.map((tag) => (
                                <span key={tag} className="text-[14px] lg:text-[15px] text-[#dc461e]/80">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5 grid grid-cols-12 gap-4 border-b border-[#dc461e]/20">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-[#dc461e]">Industry</h2>
                          </div>
                          <div className="col-span-8">
                            <span className="text-[14px] lg:text-[15px] text-[#dc461e]/80">{currentProject.industry}</span>
                          </div>
                        </div>

                        <div className="py-1.5 grid grid-cols-12 gap-4 border-b border-[#dc461e]/20">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-[#dc461e]">Structural System</h2>
                          </div>
                          <div className="col-span-8">
                            <span className="text-[14px] lg:text-[15px] text-[#dc461e]/80">{currentProject.client}</span>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={(e) => openCase(e)}
                          className="py-1.5 w-full border-b border-[#dc461e]/20 group cursor-pointer text-left hover:bg-[#dc461e]/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] lg:text-[15px] font-semibold text-[#dc461e]">Explore the case</span>
                            <ArrowUpRight className="w-4 h-4 text-[#dc461e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Side: Project Titles List */}
              <div 
                ref={scrollContainerRef}
                className="flex flex-col h-full pr-12 overflow-y-auto scroll-snap-y-mandatory scrollbar-hide"
              >
                <div className="lenis-content flex flex-col">
                  {/* Top Padding to center first item */}
                  <div className="h-[45vh] shrink-0" />
                  
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      data-project-id={project.id}
                      className="flex items-center group scroll-snap-align-center shrink-0 py-4"
                    >
                      <button
                        onClick={() => handleProjectClick(project.id)}
                        className="text-left py-2"
                      >
                        <h2 className={`text-7xl lg:text-9xl font-bold tracking-tighter transition-all duration-700 leading-[0.9] ${
                          selectedProjectId === project.id 
                            ? "text-[#dc461e]" 
                            : "text-[#dc461e]/10 hover:text-[#dc461e]/25"
                        }`}>
                          {project.title}
                        </h2>
                      </button>
                    </div>
                  ))}

                  {/* Bottom Padding to center last item */}
                  <div className="h-[45vh] shrink-0" />
                </div>
              </div>
            </div>

            {/* Mobile Layout (Swipeable Cards) */}
	            <div className="projects-mobile-shell md:hidden relative left-1/2 flex w-screen -translate-x-1/2 flex-col min-h-screen pt-12">
              {/* Decorative blurred circles for better glass effect */}
              <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#dc461e]/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#dc461e]/10 rounded-full blur-[100px]" />

              <div ref={mobileCarouselRef} className="projects-carousel pb-20 w-full">
		                {projects.map((project) => (
		                  <motion.div
		                    key={project.id}
		                    initial={false}
		                    data-card-id={project.id}
		                    className={`project-card-glass flex flex-col rounded-[2.5rem] p-6 text-white ${
		                      project.id === activeMobileCardId
		                        ? "is-center"
		                        : project.id < activeMobileCardId
		                          ? "is-peek-left"
		                          : "is-peek-right"
		                    }`}
		                  >
                    <h2 className="text-2xl font-bold tracking-tight mb-4 text-white">
                      {project.title}
                    </h2>
                    
                    <div className="project-card-media w-full rounded-2xl overflow-hidden mb-5 bg-white/5 shadow-inner">
                      <img 
                        src={project.heroImage} 
                        alt={project.imageName}
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="project-card-content flex flex-col border-t border-white/10 pr-1">
                      <div className="py-2.5 grid grid-cols-12 gap-3 border-b border-white/5">
                        <div className="col-span-4">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Overview</h3>
                        </div>
                        <div className="col-span-8">
                          <p className="text-xs leading-snug text-white/80 line-clamp-3">{project.overview}</p>
                        </div>
                      </div>

                      <div className="py-2.5 grid grid-cols-12 gap-3 border-b border-white/5">
                        <div className="col-span-4">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Tags</h3>
                        </div>
                        <div className="col-span-8">
                          <div className="flex flex-col gap-0.5">
                            {project.tags.map((tag) => (
                              <span key={tag} className="text-xs text-white/80 font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="py-2.5 grid grid-cols-12 gap-3 border-b border-white/5">
                        <div className="col-span-4">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Industry</h3>
                        </div>
                        <div className="col-span-8">
                          <span className="text-xs text-white/80 font-medium">{project.industry}</span>
                        </div>
                      </div>

                      <div className="py-2.5 grid grid-cols-12 gap-3 border-b border-white/5">
                        <div className="col-span-4">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">System</h3>
                        </div>
                        <div className="col-span-8">
                          <span className="text-xs text-white/80 font-medium">{project.client}</span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={(e) => openCase(e, project.id)}
                        className="pt-4 pb-1 group cursor-pointer w-full text-left mt-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white underline underline-offset-4 decoration-white/20 group-hover:decoration-white transition-all">Explore the case</span>
                          <ArrowUpRight className="w-4 h-4 text-white/60" />
                        </div>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
	        ) : (
	          <motion.div 
	            key="analysis"
	            initial={analysisTransition.initial}
	            animate={analysisTransition.animate}
	            exit={analysisTransition.exit}
	            transition={analysisTransition.transition}
	            className={`projects-analysis-shell w-full max-w-7xl mx-auto flex flex-col min-h-screen px-5 md:px-10 md:bg-transparent md:backdrop-blur-none ${embedded ? "projects-analysis-overlay" : ""}`}
	          >
	            <div className="pt-6">
	              <button 
	                type="button"
                onClick={(e) => closeCase(e)}
                className="flex items-center gap-2 text-white/60 md:text-[#dc461e]/60 hover:text-white md:hover:text-[#dc461e] transition-colors mb-8"
              >
                <ArrowLeft size={20} />
                <span>Back to projects</span>
              </button>
  
              <header className="mb-12">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white md:text-neutral-900">{currentProject?.title}</h1>
                <p className="text-white/70 md:text-[#dc461e]/80 text-lg md:text-xl leading-relaxed max-w-3xl">
	                  Detailed structural analysis and design methodology for the {currentProject?.title.toLowerCase()}.
	                </p>
	              </header>

	              <section className="mb-12">
	                <h2 className="text-xl font-semibold mb-4 text-white md:text-neutral-900 md:text-[#dc461e]/90 border-b border-white/10 md:border-[#dc461e]/20 pb-2">
	                  Overview
	                </h2>
	                <div
	                  style={{
	                    background: "rgba(255, 255, 255, 0.05)",
	                    backdropFilter: "blur(12px)",
	                    WebkitBackdropFilter: "blur(12px)",
	                    border: "1px solid rgba(255, 255, 255, 0.1)",
	                  }}
	                  className="p-6 shadow-sm rounded-2xl md:rounded-none md:bg-[#dc461e]/5 md:border-[#dc461e]/10 md:backdrop-blur-none"
	                >
	                  <p className="text-white/80 md:text-[#dc461e]/80 leading-relaxed text-[14px] lg:text-[15px] max-w-4xl">
	                    {currentProject?.overview}
	                  </p>
	                </div>
	              </section>
	            </div>
	
	            <div className="pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Superstructure Analysis */}
              <section className="flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-white md:text-neutral-900 md:text-[#dc461e]/90 border-b border-white/10 md:border-[#dc461e]/20 pb-2">Superstructure Analysis</h2>
                
                <div className="relative aspect-video w-full bg-white/5 md:bg-[#dc461e]/5 border border-white/10 md:border-[#dc461e]/10 overflow-hidden shadow-lg mb-6 rounded-2xl md:rounded-none">
                  <SwipeableImages 
                    images={currentProject?.analysisImages || []} 
                    activeIndex={activeAnalysisImage}
                    onChange={setActiveAnalysisImage}
                  />
                  
                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {currentProject?.analysisImages.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          activeAnalysisImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  className="p-6 shadow-sm flex-grow rounded-2xl md:rounded-none md:bg-[#dc461e]/5 md:border-[#dc461e]/10 md:backdrop-blur-none"
                >
                  <p className="text-white/80 md:text-[#dc461e]/80 leading-relaxed text-[14px] lg:text-[15px]">
                    {currentProject?.analysisDescription}
                  </p>
                </div>
              </section>

              {/* Slab Design Section */}
              <section className="flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-white md:text-neutral-900 md:text-[#dc461e]/90 border-b border-white/10 md:border-[#dc461e]/20 pb-2">{currentProject?.slabTitle || "Slab Design"}</h2>
                <div className="relative aspect-video w-full bg-white/5 md:bg-[#dc461e]/5 border border-white/10 md:border-[#dc461e]/10 overflow-hidden shadow-lg mb-6 rounded-2xl md:rounded-none">
                  {currentProject?.slabImages && currentProject.slabImages.length > 1 ? (
                    <>
                      <SwipeableImages 
                        images={currentProject.slabImages} 
                        activeIndex={activeSlabImage}
                        onChange={setActiveSlabImage}
                      />
                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {currentProject.slabImages.map((_, idx) => (
                          <div 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              activeSlabImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <img 
                      src={currentProject?.slabImages[0]} 
                      alt="Slab design analysis"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  className="p-6 shadow-sm flex-grow rounded-2xl md:rounded-none md:bg-[#dc461e]/5 md:border-[#dc461e]/10 md:backdrop-blur-none"
                >
                  <p className="text-white/80 md:text-[#dc461e]/80 leading-relaxed text-[14px] lg:text-[15px]">
                    {currentProject?.slabDescription}
                  </p>
                </div>
              </section>

              {/* Foundation System Section */}
              <section className="flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-white md:text-neutral-900 md:text-[#dc461e]/90 border-b border-white/10 md:border-[#dc461e]/20 pb-2">{currentProject?.foundationTitle || "Foundation System"}</h2>
                <div className="relative aspect-video w-full bg-white/5 md:bg-[#dc461e]/5 border border-white/10 md:border-[#dc461e]/10 overflow-hidden shadow-lg mb-6 rounded-2xl md:rounded-none">
                  {currentProject?.foundationImages && currentProject.foundationImages.length > 1 ? (
                    <>
                      <SwipeableImages 
                        images={currentProject.foundationImages} 
                        activeIndex={activeFoundationImage}
                        onChange={setActiveFoundationImage}
                      />
                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {currentProject.foundationImages.map((_, idx) => (
                          <div 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              activeFoundationImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <img 
                      src={currentProject?.foundationImages[0]} 
                      alt="Foundation design analysis"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  className="p-6 shadow-sm flex-grow rounded-2xl md:rounded-none md:bg-[#dc461e]/5 md:border-[#dc461e]/10 md:backdrop-blur-none"
                >
                  <p className="text-white/80 md:text-[#dc461e]/80 leading-relaxed text-[14px] lg:text-[15px]">
                    {currentProject?.foundationDescription}
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




function SwipeableImages({ 
  images, 
  activeIndex, 
  onChange 
}: { 
  images: string[], 
  activeIndex: number,
  onChange: (index: number) => void
}) {
  return (
    <div className="relative w-full h-full flex touch-pan-y overflow-hidden">
      <motion.div 
        className="flex w-full h-full"
        animate={{ x: `-${activeIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          const swipeThreshold = 50;
          if (info.offset.x < -swipeThreshold && activeIndex < images.length - 1) {
            onChange(activeIndex + 1);
          } else if (info.offset.x > swipeThreshold && activeIndex > 0) {
            onChange(activeIndex - 1);
          }
        }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0">
            <img 
              src={src} 
              alt={`Analysis screenshot ${idx + 1}`}
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
