/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, type CSSProperties, type MouseEvent, type WheelEvent as ReactWheelEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

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

  const mobileDeckRef = useRef<HTMLDivElement>(null);
  const mobileSnapTimeoutRef = useRef<number | null>(null);
  const isAutoSnappingRef = useRef(false);
  const scrollLockYRef = useRef(0);
  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const listShellRef = useRef<HTMLDivElement>(null);
  const [desktopSectionHeight, setDesktopSectionHeight] = useState<number>(0);
  const [desktopShellStyle, setDesktopShellStyle] = useState<CSSProperties | undefined>(undefined);

  // Reset scroll position and image indices when view or project changes
  useEffect(() => {
    if (view === "analysis") {
      // Desktop: only force scroll-to-top on the standalone /projects route.
      // When Projects is embedded inside Home, keep the current scroll position.
      const isStandaloneProjectsRoute =
        typeof window !== "undefined" && window.location.pathname === "/projects";
      if (!embedded && !isMobile && isStandaloneProjectsRoute) window.scrollTo(0, 0);
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
    if (typeof projectId === "number") setSelectedProjectId(projectId);
    if (!embedded && isMobile) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setView("analysis");
  };

  const closeCase = (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    setView("list");
  };

  useEffect(() => {
    if (!embedded || view !== "analysis") return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    scrollLockYRef.current = scrollY;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousOverscrollBehavior = documentElement.style.overscrollBehavior;

    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = isMobile ? "none" : previousBodyTouchAction;

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      documentElement.style.overscrollBehavior = previousOverscrollBehavior;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;
      window.scrollTo({ top: scrollLockYRef.current, left: 0, behavior: "auto" });
    };
  }, [embedded, view, isMobile]);

  useEffect(() => {
    // Safety: restore body scroll if this component unmounts while the overlay is open.
    return () => {
      if (embedded) {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.overscrollBehavior = "";
      }
      document.body.classList.remove("projects-detail-open");
    };
  }, [embedded]);

  useEffect(() => {
    if (!embedded) return;

    if (view === "analysis") {
      document.body.classList.add("projects-detail-open");
    } else {
      document.body.classList.remove("projects-detail-open");
    }

    return () => {
      document.body.classList.remove("projects-detail-open");
    };
  }, [embedded, view]);

  useEffect(() => {
    if (!isMobile || view !== "list") return;
    if (typeof window === "undefined") return;

    const deck = mobileDeckRef.current;
    if (!deck) return;

    const clearSnapTimeout = () => {
      if (mobileSnapTimeoutRef.current !== null) {
        window.clearTimeout(mobileSnapTimeoutRef.current);
        mobileSnapTimeoutRef.current = null;
      }
    };

    const releaseAutoSnap = () => {
      window.setTimeout(() => {
        isAutoSnappingRef.current = false;
      }, 360);
    };

    const snapNearestCard = () => {
      if (isAutoSnappingRef.current) return;

      const deckRect = deck.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (deckRect.top > viewportHeight * 0.7 || deckRect.bottom < viewportHeight * 0.3) return;

      const cards = Array.from(deck.querySelectorAll(".project-card-stack-item")) as HTMLElement[];
      if (cards.length === 0) return;

      const targetCenterY = viewportHeight * 0.5;
      let nearestCard = cards[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - targetCenterY);

        if (distance < bestDistance) {
          bestDistance = distance;
          nearestCard = card;
        }
      }

      const lastCard = cards[cards.length - 1];
      const lastRect = lastCard.getBoundingClientRect();
      const lastCardSettled = nearestCard === lastCard && lastRect.top <= viewportHeight * 0.2;
      const leavingProjectsForFooter = lastRect.top <= viewportHeight * 0.65;

      if (lastCardSettled || leavingProjectsForFooter) return;

      const nearestRect = nearestCard.getBoundingClientRect();
      const deltaY = (nearestRect.top + nearestRect.height / 2) - targetCenterY;

      if (Math.abs(deltaY) < 8) return;

      isAutoSnappingRef.current = true;
      window.scrollTo({
        top: window.scrollY + deltaY,
        behavior: "smooth",
      });
      releaseAutoSnap();
    };

    const onScroll = () => {
      if (isAutoSnappingRef.current) return;
      clearSnapTimeout();
      mobileSnapTimeoutRef.current = window.setTimeout(snapNearestCard, 110);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearSnapTimeout();
      isAutoSnappingRef.current = false;
    };
  }, [isMobile, view]);

  const projects = [
    {
      id: 0,
      title: "Buildings",
      overview: "The structural design of the 2B+G+7 commercial building covers the complete analysis of the superstructure and foundation systems.",
      tags: ["ETABS | SAFE", "EXCEL | SAP 2000", "AutoCad | Revit"],
      industry: "Commercial Real Estate",
      client: "RC Frame with Shear Walls",
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
      client: "Structural Steel Truss & Columns",
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
      client: "Steel Jacketing & Section Enlargement",
      heroImage: "/images/slab retrofitting.webp",
      imageName: "slab_retrofitting.png",
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
      tags: ["SAFE | ETABS", "PROKON | EXCEL", "AUTOCAD | REVIT"],
      industry: "Residential Architecture",
      client: "RC Framed Structure",
      heroImage: "https://lh3.googleusercontent.com/d/1YdBJUZzSrTtEZLDaN0RMw5WgM2jBKvaM",
      imageName: "3d.png",
      analysisImages: [
        "/images/model.webp"
      ],
      slabImages: [
        "/images/slab.webp"
      ],
      foundationImages: [
        "/images/piles.webp"
      ],
      analysisDescription: "The villa's complex geometry, including large cantilevers, required rigorous finite element analysis to ensure deflection control and structural safety.",
      slabTitle: "Slab Design",
      slabDescription: "Post-tensioned slabs were utilized to achieve the long spans and thin profiles requested for the architectural aesthetic.",
      foundationDescription: "A combined raft foundation was designed to accommodate the varying column loads and ensure uniform settlement across the site.",
      year: "2024"
    }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const currentProject = useMemo(() =>
    selectedProjectId !== null ? projects[selectedProjectId] : null,
    [selectedProjectId, projects]);

  // Desktop: activate the project whose title is closest to the right-column center.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || view !== "list" || isMobile) return;

    const items = Array.from(container.querySelectorAll("[data-project-id]")) as HTMLElement[];
    if (items.length === 0) return;

    let rafId: number | null = null;

    const updateActiveByCenter = () => {
      rafId = null;
      if (isScrollingRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const viewportCenterY = containerRect.top + container.clientHeight * 0.5;
      let nearestId: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenterY - viewportCenterY);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          const idAttr = item.getAttribute("data-project-id");
          nearestId = idAttr !== null ? parseInt(idAttr, 10) : null;
        }
      }

      if (nearestId !== null) {
        setSelectedProjectId((prev) => (prev === nearestId ? prev : nearestId));
      }
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateActiveByCenter);
    };

    requestUpdate();
    container.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      container.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [view, projects, isMobile]);

  // Desktop: size the sticky track so the section stays pinned until the right rail is fully traversed.
  useEffect(() => {
    if (view !== "list" || isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateSectionHeight = () => {
      const railLimit = Math.max(0, container.scrollHeight - container.clientHeight);
      setDesktopSectionHeight(window.innerHeight + railLimit);
    };

    updateSectionHeight();
    window.addEventListener("resize", updateSectionHeight);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => updateSectionHeight())
      : null;

    resizeObserver?.observe(container);
    if (container.firstElementChild instanceof HTMLElement) {
      resizeObserver?.observe(container.firstElementChild);
    }

    return () => {
      window.removeEventListener("resize", updateSectionHeight);
      resizeObserver?.disconnect();
    };
  }, [view, isMobile, projects]);

  // Desktop: map page scroll progress to the right rail while the projects section is pinned.
  useEffect(() => {
    if (view !== "list" || isMobile) return;
    const section = desktopSectionRef.current;
    const container = scrollContainerRef.current;
    if (!section || !container) return;

    let rafId: number | null = null;

    const syncRailToPageScroll = () => {
      rafId = null;
      const sectionRect = section.getBoundingClientRect();
      const railLimit = Math.max(0, container.scrollHeight - container.clientHeight);
      const sectionProgress = Math.min(Math.max(-sectionRect.top, 0), railLimit);
      container.scrollTop = sectionProgress;
    };

    const requestSync = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncRailToPageScroll);
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [view, isMobile, desktopSectionHeight, projects]);

  // Desktop: pin the entire projects shell explicitly so the left side cannot drift.
  useEffect(() => {
    if (view !== "list" || isMobile) {
      setDesktopShellStyle(undefined);
      return;
    }

    const section = desktopSectionRef.current;
    if (!section || desktopSectionHeight <= 0) return;

    let rafId: number | null = null;

    const updatePinnedShell = () => {
      rafId = null;
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;
      const pinStart = sectionTop;
      // Extend pinEnd by 1 viewport height for the footer curtain reveal zone
      const pinEnd = sectionTop + Math.max(0, desktopSectionHeight - window.innerHeight) + window.innerHeight;
      const scrollY = window.scrollY;

      if (scrollY <= pinStart) {
        setDesktopShellStyle({
          position: "absolute",
          inset: "0 auto auto 0",
          width: "100%",
          height: "100vh",
        });
        return;
      }

      if (scrollY >= pinEnd) {
        setDesktopShellStyle({
          position: "absolute",
          top: `${Math.max(0, desktopSectionHeight - window.innerHeight)}px`,
          left: 0,
          width: "100%",
          height: "100vh",
        });
        return;
      }

      setDesktopShellStyle({
        position: "fixed",
        top: 0,
        left: `${sectionRect.left}px`,
        width: `${sectionRect.width}px`,
        height: "100vh",
      });
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updatePinnedShell);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [view, isMobile, desktopSectionHeight]);

  const handleProjectClick = (id: number) => {
    isScrollingRef.current = true;
    setSelectedProjectId(id);

    const container = scrollContainerRef.current;
    if (container) {
      const target = container.querySelector(`[data-project-id="${id}"]`);
      if (target) {
        if (!isMobile) {
          const section = desktopSectionRef.current;
          if (section) {
            const targetEl = target as HTMLElement;
            const railLimit = Math.max(0, container.scrollHeight - container.clientHeight);
            const targetRailOffset = Math.max(
              0,
              Math.min(
                railLimit,
                targetEl.offsetTop + targetEl.offsetHeight / 2 - container.clientHeight / 2,
              ),
            );
            const sectionTop = window.scrollY + section.getBoundingClientRect().top;
            window.scrollTo({ top: sectionTop + targetRailOffset, behavior: "smooth" });
          }
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const handleDesktopRailWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (isMobile || view !== "list") return;
    if (event.ctrlKey) return;

    const dominantDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    // Ensure wheel scroll works even when cursor is over the right rail.
    event.preventDefault();
    window.scrollBy({ top: dominantDelta, left: 0, behavior: "auto" });
  };

  const rootBgClass = embedded
    ? (view === "analysis" ? "bg-black" : "bg-transparent")
    : (isMobile ? "bg-[#ffebe6]" : "bg-[#050607]");

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

  const isDesktopEmbedded = embedded && !isMobile;
  const shouldRenderList = view === "list" || isDesktopEmbedded;
  const shouldRenderAnalysis = view === "analysis";
  const presenceMode = isMobile || isDesktopEmbedded ? "sync" : "wait";

  return (
    <div
      className={`min-h-screen ${rootBgClass} text-[#dc461e] font-sans selection:bg-[#dc461e] selection:text-[#ffebe6] md:overflow-x-hidden`}
    >
      <AnimatePresence mode={presenceMode}>
        {shouldRenderList ? (
          <motion.div
            key="list"
            initial={listTransition.initial}
            animate={listTransition.animate}
            exit={listTransition.exit}
            transition={listTransition.transition}
            ref={desktopSectionRef}
            className="relative w-full flex flex-col min-h-screen px-5 md:px-0 pt-6 md:pt-0"
            style={!isMobile && desktopSectionHeight > 0 ? { height: `${desktopSectionHeight}px` } : undefined}
          >
            {/* Desktop Layout (Split Screen) */}
            <div
              ref={listShellRef}
              className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-14 items-stretch md:h-screen md:min-h-screen overflow-hidden relative text-white"
              style={desktopShellStyle}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage: "linear-gradient(to right, rgba(12,18,20,0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,18,20,0.75) 1px, transparent 1px)",
                  backgroundSize: "100% 120px, 100% 120px",
                }}
              />
              {/* Left Side: Selected Project Details */}
              <div className="relative z-10 flex h-full flex-col justify-start pt-4 pl-4 pr-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentProject && (
                    <motion.div
                      key={currentProject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col w-full max-w-2xl"
                    >
                      {/* Image Section */}
                      <div className="w-full mb-6 border border-[#17343a]/80 bg-black/30">
                        <img
                          src={currentProject.heroImage}
                          alt={currentProject.imageName}
                          className="w-full object-cover shadow-sm h-[56vh]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Project Details Grid */}
                      <div className="flex flex-col border-t border-[#17343a]/70 px-0">
                        <div className="py-2 grid grid-cols-12 gap-4 border-b border-[#17343a]/70">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-white/95">Overview</h2>
                          </div>
                          <div className="col-span-8">
                            <p className="text-[14px] lg:text-[15px] leading-snug text-white/72">{currentProject.overview}</p>
                          </div>
                        </div>

                        <div className="py-2 grid grid-cols-12 gap-4 border-b border-[#17343a]/70">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-white/95">Softwares</h2>
                          </div>
                          <div className="col-span-8">
                            <div className="flex flex-col gap-0">
                              {currentProject.tags?.map((tag) => (
                                <span key={tag} className="text-[14px] lg:text-[15px] text-white/72">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="py-2 grid grid-cols-12 gap-4 border-b border-[#17343a]/70">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-white/95">Industry</h2>
                          </div>
                          <div className="col-span-8">
                            <span className="text-[14px] lg:text-[15px] text-white/72">{currentProject.industry}</span>
                          </div>
                        </div>

                        <div className="py-2 grid grid-cols-12 gap-4 border-b border-[#17343a]/70">
                          <div className="col-span-4">
                            <h2 className="text-[14px] lg:text-[15px] font-semibold text-white/95">System</h2>
                          </div>
                          <div className="col-span-8">
                            <span className="text-[14px] lg:text-[15px] text-white/72">{currentProject.client}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => openCase(e)}
                          className="py-2 w-full border-b border-[#17343a]/70 group cursor-pointer text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] lg:text-[15px] font-semibold text-white/95">Explore the case</span>
                            <ArrowUpRight className="w-4 h-4 text-white/90 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                onWheel={handleDesktopRailWheel}
                className="relative z-10 flex flex-col h-full pr-8 lg:pr-12 overflow-hidden overscroll-contain scrollbar-hide"
              >
                <div className="flex flex-col">
                  {/* Desktop center spacer */}
                  <div className="h-[42vh] shrink-0" />

                  {projects.map((project) => (
                    <div
                      key={project.id}
                      data-project-id={project.id}
                      className="flex items-center gap-6 group shrink-0 py-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block w-20 shrink-0"
                      />
                      <button
                        onClick={() => handleProjectClick(project.id)}
                        className="text-left py-2"
                      >
                        <h2 className={`font-['Inter'] text-[4.6rem] lg:text-[5.8rem] xl:text-[6.6rem] font-semibold tracking-[-0.03em] transition-all duration-700 leading-[0.9] ${selectedProjectId === project.id
                          ? "text-white/95"
                          : "text-[#3a3d43] hover:text-[#545962]"
                          }`}>
                          {project.title}
                        </h2>
                      </button>
                    </div>
                  ))}

                  {/* Desktop center spacer */}
                  <div className="h-[42vh] shrink-0" />
                </div>
              </div>
            </div>

            {/* Mobile Layout (Vertical Stacking Deck) */}
            <div className="projects-mobile-shell md:hidden relative left-1/2 flex w-screen -translate-x-1/2 flex-col pt-12">
              {/* Decorative blurred circles for better glass effect */}
              <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#dc461e]/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#dc461e]/10 rounded-full blur-[100px]" />

              <div ref={mobileDeckRef} className="projects-carousel pb-[34vh] w-full">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="project-card-stack-item w-full"
                    style={{ top: `calc(11vh + ${index * 14}px)`, zIndex: index + 1 }}
                  >
                    <motion.div
                      initial={false}
                      className="project-card-glass flex flex-col rounded-[2.5rem] p-6 text-white"
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
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Softwares</h3>
                          </div>
                          <div className="col-span-8">
                            <div className="flex flex-col gap-0.5">
                              {project.tags?.map((tag) => (
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
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}

        {shouldRenderAnalysis ? (
          <motion.div
            key="analysis"
            initial={analysisTransition.initial}
            animate={analysisTransition.animate}
            exit={analysisTransition.exit}
            transition={analysisTransition.transition}
            className={`projects-analysis-shell w-full flex flex-col min-h-screen px-5 md:px-10 ${embedded
              ? "projects-analysis-overlay fixed inset-0 z-[10000] overflow-y-auto bg-black md:bg-black md:max-w-none md:mx-0"
              : "md:max-w-7xl md:mx-auto md:bg-transparent md:backdrop-blur-none"
              }`}
          >
            <div className={embedded ? "w-full md:max-w-7xl md:mx-auto" : ""}>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => closeCase(e)}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
                >
                  <ArrowLeft size={20} />
                  <span>Back to projects</span>
                </button>

                <header className="mb-12">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">{currentProject?.title}</h1>
                  <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl">
                    Detailed structural analysis and design methodology for the {currentProject?.title.toLowerCase()}.
                  </p>
                </header>

                <section className="mb-12">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">
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
                    <p className="text-white/80 leading-relaxed text-[14px] lg:text-[15px] max-w-4xl">
                      {currentProject?.overview}
                    </p>
                  </div>
                </section>
              </div>

              <div className="pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Superstructure Analysis */}
                <section className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Superstructure Analysis</h2>

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
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeAnalysisImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
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
                    <p className="text-white/80 leading-relaxed text-[14px] lg:text-[15px]">
                      {currentProject?.analysisDescription}
                    </p>
                  </div>
                </section>

                {/* Slab Design Section */}
                <section className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">{currentProject?.slabTitle || "Slab Design"}</h2>
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
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSlabImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
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
                    <p className="text-white/80 leading-relaxed text-[14px] lg:text-[15px]">
                      {currentProject?.slabDescription}
                    </p>
                  </div>
                </section>

                {/* Foundation System Section */}
                <section className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">{currentProject?.foundationTitle || "Foundation System"}</h2>
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
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeFoundationImage === idx ? "bg-white md:bg-[#dc461e] w-4" : "bg-white/20 md:bg-[#dc461e]/30"
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
                    <p className="text-white/80 leading-relaxed text-[14px] lg:text-[15px]">
                      {currentProject?.foundationDescription}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        ) : null}
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
