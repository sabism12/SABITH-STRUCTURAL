import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useLocation, useNavigationType } from "react-router-dom";
import { useLenis } from "lenis/react";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import About from "../components/About";
import Statement from "../components/Statement";
import Work from "../components/Work";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import { useFrameSequence } from "../hooks/useFrameSequence";
import { FRAME_COUNT, FRAME_START } from "../components/Hero";

// The intro loader only runs on the first visit in a session's page load.
let introShown = false;
// Where the visitor was on the home page, so Back from a case study returns there.
let savedScrollY = 0;

export default function Home() {
  const frames = useFrameSequence(FRAME_COUNT, "/images/hero-sequence", "/images/hero-sequence-mobile", FRAME_START);
  const [loading, setLoading] = useState(!introShown);
  const { hash } = useLocation();
  const navigationType = useNavigationType();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => {
      savedScrollY = window.scrollY;
    };
  }, []);

  // Back/forward into the home page: put the visitor where they left it.
  useEffect(() => {
    if (loading || hash || navigationType !== "POP" || !savedScrollY) return;
    const y = savedScrollY;
    const t = setTimeout(() => {
      // Lenis still holds the previous page's height; re-measure so it doesn't cap the scroll.
      lenis?.resize();
      window.scrollTo(0, y);
      lenis?.scrollTo(y, { immediate: true, force: true });
    }, 60);
    return () => clearTimeout(t);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (!loading) introShown = true;
  }, [loading]);

  // Keep the page still while the loader is up.
  useEffect(() => {
    if (!lenis) return;
    if (loading) lenis.stop();
    else lenis.start();
  }, [loading, lenis]);

  // Arriving from another page with /#section.
  useEffect(() => {
    if (loading || !hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const t = setTimeout(() => (lenis ? lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView()), 50);
    return () => clearTimeout(t);
  }, [hash, loading, lenis]);

  return (
    <>
      <AnimatePresence>{loading && <Loader ready={frames.firstReady} onDone={() => setLoading(false)} />}</AnimatePresence>
      <main id="main">
        <Hero frames={frames} ready={!loading} />
        <About />
        <Statement />
        <Work />
        <Experience />
      </main>
      <Contact />
    </>
  );
}
