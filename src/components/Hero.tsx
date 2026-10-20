import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { profile } from "../data/content";
import { MaskLines } from "./Reveal";
import { useScrollToSection } from "./Nav";

export const FRAME_COUNT = 150;
// The sequence opens on bare gravel; start where the footings and starter bars are already in.
export const FRAME_START = 33;

// What the build sequence shows at each point (frame index ranges).
const stages: [number, string][] = [
  [0, "Site"],
  [12, "Footings & starter bars"],
  [38, "Ground beams"],
  [68, "Columns & walls"],
  [84, "Roof slab"],
  [112, "Finishes"],
  [142, "Complete"],
];

type Frames = {
  getFrame: (i: number) => HTMLImageElement | undefined;
  onFrameLoaded: (fn: () => void) => () => void;
};

export default function Hero({ frames, ready }: { frames: Frames; ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(FRAME_START);
  const [frame, setFrame] = useState(FRAME_START);
  const scrollTo = useScrollToSection();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const img = frames.getFrame(frameRef.current);
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      const box = canvas.parentElement!.getBoundingClientRect();
      const size = Math.floor(Math.min(box.width, box.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Resizing the canvas clears it, so skip address-bar resizes that keep the same size.
      if (size > 0 && canvas.width === Math.round(size * dpr)) return;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      draw();
    };

    let raf = 0;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const next = Math.min(FRAME_COUNT - 1, FRAME_START + Math.floor(p * (FRAME_COUNT - FRAME_START)));
      if (next === frameRef.current) return;
      frameRef.current = next;
      setFrame(next);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const off = frames.onFrameLoaded(draw);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    onScroll();
    return () => {
      off();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [frames]);

  const stage = [...stages].reverse().find(([start]) => frame >= start)![1];
  const percent = Math.round(((frame - FRAME_START) / (FRAME_COUNT - 1 - FRAME_START)) * 100);

  const goWork = (e: MouseEvent) => {
    e.preventDefault();
    scrollTo("work");
  };

  return (
    <section ref={sectionRef} className="relative h-[160vh] md:h-[220vh] bg-black" aria-label="Introduction">
      {/* Phones: one clean column (animation, name, buttons). Desktop: name left, animation right. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-16 md:block md:pt-0">
        {/* Build sequence */}
        <motion.div
          className="relative flex-1 min-h-0 mx-4 mt-4 md:m-0 md:absolute md:top-[11%] md:bottom-[6%] md:left-[47%] md:right-[2%] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <canvas ref={canvasRef} aria-label="A house being built, stage by stage, as you scroll" role="img" />
        </motion.div>

        <div className="relative z-10 flex-none wrap pt-6 pb-8 md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:pt-16 md:pb-0 pointer-events-none">
          <div className="flex flex-col gap-y-7 md:gap-y-10 md:w-[45%]">
            <div>
              <motion.p
                className="label text-white/60 mb-4 md:mb-6 tabular-nums"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : undefined}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="hidden md:inline">
                  {profile.role} — {profile.location} <span className="ml-3 text-white/40">/ 2026 /</span>
                </span>
                {/* Phones: the build readout lives here instead of in its own corner. */}
                <span className="md:hidden" aria-hidden>
                  {frame < FRAME_START + 3 ? "Scroll to build ↓" : `${stage} · ${percent}%`}
                </span>
              </motion.p>
              {ready && (
                <h1 className="display text-[16.2vw] md:text-[8vw]">
                  <MaskLines lines={[profile.firstName, profile.lastName]} animateOnMount delay={0.1} />
                </h1>
              )}
            </div>

            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="hidden md:block leading-snug text-white/75 max-w-[42ch] text-[16px] mb-6">{profile.heroLine}</p>
              <div className="flex gap-3">
                <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="pill flex-1 md:flex-none bg-paper text-ink hover:bg-white">
                  Download CV<span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
                <a href="/#work" onClick={goWork} className="pill flex-1 md:flex-none border border-white/25 hover:border-white/70">
                  View work
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Build progress readout (desktop) */}
        <motion.div
          className="hidden md:block absolute z-10 right-8 xl:right-10 top-[14%] label text-right tabular-nums"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.9 }}
          aria-hidden
        >
          <span className="text-white/60">Stage</span>
          <span className="block">{stage}</span>
          <span className="block mt-2 h-px w-28 bg-white/20 ml-auto relative overflow-hidden">
            <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${percent}%` }} />
          </span>
          <span className="block mt-1 text-white/60">{frame < FRAME_START + 3 ? "Scroll to build" : `${percent}%`}</span>
        </motion.div>
      </div>
    </section>
  );
}
