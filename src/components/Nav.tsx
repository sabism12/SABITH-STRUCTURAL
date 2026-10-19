import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { profile } from "../data/content";

const links = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function useDohaTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: profile.timeZone })
      .format(new Date())
      .toUpperCase();
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function useScrollToSection() {
  const lenis = useLenis();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (id: string) => {
    if (pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
}

/** Which home-page section is in the middle of the screen, for the nav's current-page state. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    // Above the first section (the hero) nothing is current.
    const onScroll = () => {
      const first = els[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);
  return active;
}

export default function Nav() {
  const time = useDohaTime();
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollToSection();
  const lenis = useLenis();
  const { pathname } = useLocation();
  const active = useActiveSection(pathname === "/");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(id);
  };

  // Mobile menu: lock the page behind it, focus its first link, close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    const t = setTimeout(() => firstLinkRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      root.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [open, lenis]);

  const skipToContent = (e: MouseEvent) => {
    e.preventDefault();
    const main = document.querySelector("main");
    if (!main) return;
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    if (lenis) lenis.scrollTo(main, { immediate: true });
    else main.scrollIntoView();
  };

  return (
    <>
      <a
        href="#main"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:h-11 focus:px-6 focus:rounded-full focus:bg-paper focus:text-ink focus:inline-flex focus:items-center focus:text-[14px] focus:font-medium"
      >
        Skip to content
      </a>

      {/* Phones: solid bar so headings slide under it cleanly. Desktop: blended over the page. */}
      <header className="fixed top-0 inset-x-0 z-50 text-white bg-black md:bg-transparent md:mix-blend-difference">
        <div className="wrap grid-site items-center md:items-start pt-2 pb-2 md:pt-6 md:pb-0 label">
          <Link to="/" className="col-span-3 md:col-span-3 leading-tight py-1" onClick={() => setOpen(false)}>
            {profile.name}
            <span className="block text-white/60">{profile.role}</span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex col-span-5 col-start-5 gap-8">
            {links.map((l) => (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => go(e, l.id)}
                aria-current={active === l.id ? "location" : undefined}
                className={`relative transition-colors hover:text-white/60 after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-current after:transition-all after:duration-300 ${
                  active === l.id ? "after:w-full" : "after:w-0"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block col-span-3 text-right leading-tight">
            {profile.location} · ({time})
            <span className="flex items-center justify-end gap-2 text-white/60">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex size-full rounded-full bg-white opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              {profile.availability}
            </span>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden col-span-1 justify-self-end h-11 min-w-11 px-2 -mr-2"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 bg-ink md:hidden flex flex-col justify-between wrap pt-28 pb-8"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Main" className="flex flex-col">
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`/#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  aria-current={active === l.id ? "location" : undefined}
                  className="display text-[17vw] border-b border-white/15 py-2"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="label text-white/60 flex justify-between">
              <span>
                {profile.location} · ({time})
              </span>
              <span>{profile.availability}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
