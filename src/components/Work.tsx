import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { projects, specLabels, type Project } from "../data/content";
import CodeVisual from "./CodeVisual";
import { sizeOf } from "../data/imageSizes";
import ShaderBackground from "./ShaderBackground";

/** Full spec table, used on the case-study pages. */
function Spec({ p, tone = "text-white/60" }: { p: Project; tone?: string }) {
  const labels = specLabels(p);
  const rows: [string, string][] = [
    ["Overview", p.summary],
    ["Software", p.software.join(" · ")],
    [labels.sector, p.sector],
    [labels.system, p.system],
  ];
  return (
    <dl className="text-[15px] leading-snug">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_1fr] md:grid-cols-[120px_1fr] gap-4 border-b border-white/15 py-3">
          <dt className="font-medium">{k}</dt>
          <dd className={tone}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function ArrowUpRight({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3.5 10.5 10.5 3.5M4.5 3.5h6v6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function Visual({ p, className }: { p: Project; className: string }) {
  return p.hero ? (
    <img
      src={p.hero}
      alt=""
      {...sizeOf(p.hero)}
      loading="lazy"
      decoding="async"
      className={`${className} object-cover ${p.heroFocus === "top" ? "object-top" : ""} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
    />
  ) : (
    <CodeVisual lines={p.code ?? []} label={p.slug} className={className} />
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

// Entrance, played once as a card scrolls into view: the photo wipes open from the bottom while it
// settles from a slight zoom, the title rises out of its band, then the orange bar sweeps in.
const wipe = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease } },
};
const settle = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.6, ease } },
};
const rise = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.9, delay: 0.25, ease } },
};
const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease } },
};
const sweep = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, delay: 0.5, ease } },
};
const label = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.9, ease } },
};

/**
 * One heading line stretched to the full width of its box. Measured at 100px and scaled, re-fitted
 * on resize and once the web font arrives. Slides in and settles into a forward slant.
 */
function FitLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const box = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fit = () => {
      const b = box.current;
      const t = text.current;
      if (!b || !t) return;
      t.style.fontSize = "100px";
      // 0.95 leaves room for the slant, which pushes the tops of the letters sideways.
      t.style.fontSize = `${Math.floor((b.clientWidth / t.offsetWidth) * 100 * 0.95)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    let width = 0;
    const ro = new ResizeObserver(([e]) => {
      if (Math.round(e.contentRect.width) === width) return;
      width = Math.round(e.contentRect.width);
      fit();
    });
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  return (
    <span ref={box} className="block">
      <motion.span
        className="block origin-bottom-left"
        initial={{ opacity: 0, x: "-8%", skewX: -24 }}
        whileInView={{ opacity: 1, x: "0%", skewX: -10 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, delay, ease }}
      >
        <span ref={text} className="inline-block whitespace-nowrap">
          {children}
        </span>
      </motion.span>
    </span>
  );
}

/** Building: big image card, title band, one orange button. The whole card is the link. */
function BuildingCard({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  // While the card passes through the screen the photo drifts a little: depth without a gimmick.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <motion.div ref={ref} className="min-w-0" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <Link
        to={`/work/${p.slug}`}
        className="group block isolate overflow-hidden rounded-[28px] md:rounded-[40px] bg-[#141414] border border-white/10 md:hover:border-white/25 transition-colors"
      >
        <motion.div variants={wipe} className="relative aspect-[3/2] overflow-hidden">
          <motion.div variants={settle} className="absolute inset-0">
            <motion.div style={{ y: drift }} className="absolute -inset-y-[5%] inset-x-0">
              <Visual p={p} className="absolute inset-0 size-full" />
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Title band: cream strip between the photo and the details. */}
        <h3 className="bg-paper text-ink font-shoulders font-extrabold uppercase text-center tracking-tight leading-[0.92] text-base px-4 md:px-5 pt-4 pb-3 md:pt-5 md:pb-4 overflow-hidden">
          <motion.span variants={rise} className="block">
            <span data-fit className="inline-block whitespace-nowrap">{p.title}</span>
          </motion.span>
        </h3>
        <motion.div variants={fade} className="px-4 md:px-5 pt-4 pb-5">
          <p className="text-[15px] leading-snug text-paper/80 line-clamp-2">{p.summary}</p>
          <p className="label text-paper/55 mt-2">{p.software.join(" · ")}</p>
        </motion.div>
        {/* Bottom panel: the full-width orange "View project" bar closes the card. */}
        <span className="relative block h-14 md:h-16">
          <motion.span variants={sweep} className="absolute inset-0 origin-left bg-accent group-hover:bg-[#ff7240] transition-colors" />
          <motion.span variants={label} className="relative flex items-center justify-between h-full px-4 md:px-5 text-ink text-[16px] md:text-[17px] font-semibold">
            View project
            <span aria-hidden className="text-[20px] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.span>
        </span>
      </Link>
    </motion.div>
  );
}

/** Plugin: smaller square card, two side by side. */
function ToolCard({ p, index }: { p: Project; index: number }) {
  return (
    <motion.div
      className="h-full min-w-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delayChildren: index * 0.12 }}
    >
      <Link
        to={`/work/${p.slug}`}
        className="group flex flex-col h-full isolate overflow-hidden rounded-[22px] md:rounded-[40px] bg-[#141414] border border-white/10 hover:border-white/25 transition-colors"
      >
        <motion.div variants={wipe} className="relative aspect-[3/2] overflow-hidden bg-[#1b2129]">
          <motion.div variants={settle} className="absolute inset-0">
            <Visual p={p} className="absolute inset-0 size-full" />
          </motion.div>
        </motion.div>
        <div className="p-3 pb-4 md:p-5 flex flex-col flex-1">
          <h3 className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 mb-1 bg-paper text-ink px-3 md:px-5 pt-3 pb-2.5 md:pt-4 md:pb-3 font-shoulders font-extrabold uppercase text-center tracking-tight leading-[0.92] text-base">
            <span data-fit className="inline-block whitespace-nowrap">{p.title}</span>
          </h3>
          <p className="label text-paper/55 mt-1.5">{p.software.slice(0, 2).join(" · ")}</p>
        </div>
        <span className="relative block h-12 md:h-14">
          <motion.span variants={sweep} className="absolute inset-0 origin-left bg-accent group-hover:bg-[#ff7240] transition-colors" />
          <motion.span variants={label} className="relative flex items-center justify-between h-full px-3 md:px-5 text-ink text-[15px] font-semibold">
            Open
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.span>
        </span>
      </Link>
    </motion.div>
  );
}

/**
 * Like the CPA padel headline: the title pins under the top bar while the cards scroll up over it,
 * fading out and shrinking a little as they cover it. Sticky positioning does the pinning (smooth
 * on iPhone too); this only writes the fade and scale, once per frame, with no React re-render.
 */
function useCoverFade() {
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const pin = pinRef.current;
      const title = titleRef.current;
      const cover = pin?.nextElementSibling as HTMLElement | null;
      if (!pin || !title || !cover) return;
      const r = pin.getBoundingClientRect();
      const height = Math.max(1, r.height);
      // 0 while the cards are still below the title, 1 once they cover it.
      const progress = Math.min(1, Math.max(0, (r.top + height - cover.getBoundingClientRect().top) / height));
      title.style.opacity = String(1 - progress);
      title.style.transform = reduce ? "" : `scale(${1 - progress * 0.12})`;
      title.style.visibility = progress >= 1 ? "hidden" : "visible";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(update).catch(() => undefined);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { pinRef, titleRef };
}

/**
 * Card titles stay on one line at one shared size: the largest size at which every title in the
 * group fits its card. Re-fitted when the width changes and once the web font has loaded.
 */
function useFitTitles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fit = () => {
      const titles = [...root.querySelectorAll<HTMLElement>("[data-fit]")];
      if (!titles.length) return;
      titles.forEach((t) => (t.style.fontSize = "100px"));
      let size = Infinity;
      for (const t of titles) {
        const box = t.parentElement!;
        const cs = getComputedStyle(box);
        const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        size = Math.min(size, (room / t.offsetWidth) * 100);
      }
      titles.forEach((t) => (t.style.fontSize = `${Math.floor(size * 0.97)}px`));
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => undefined);
    let width = 0;
    const ro = new ResizeObserver(([e]) => {
      if (Math.round(e.contentRect.width) === width) return;
      width = Math.round(e.contentRect.width);
      fit();
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return ref;
}

export default function Work() {
  const buildings = projects.filter((p) => p.kind !== "Plugin");
  const tools = projects.filter((p) => p.kind === "Plugin");
  const { pinRef, titleRef } = useCoverFade();
  const buildingsRef = useFitTitles();
  const toolsRef = useFitTitles();
  return (
    <section id="work" className="relative isolate overflow-clip bg-ink wrap pt-12 md:pt-20 pb-14 md:pb-24">
      {/* One screen tall and pinned while the section scrolls past: cheap even on a long section. */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="sticky top-0 h-[100svh] opacity-60">
          <ShaderBackground variant="blueprint" />
        </div>
      </div>
      {/* Title: one heavy word in a slanted condensed face, stretched to the full width. It pins and
          fades back as the first card scrolls over it. */}
      <div ref={pinRef} className="sticky top-16 md:top-20 z-0 pointer-events-none">
        <h2 ref={titleRef} className="origin-top will-change-[opacity,transform] font-shoulders font-black uppercase text-paper leading-[0.84] tracking-[-0.01em] pb-6 md:pb-12">
          <FitLine>Works</FitLine>
        </h2>
      </div>

      <div ref={buildingsRef} className="relative z-10 grid md:grid-cols-2 gap-6">
        {buildings.map((p) => (
          <BuildingCard key={p.slug} p={p} />
        ))}
      </div>

      <div className="relative z-10 mt-6 md:mt-10">
        {/* One column on phones so the one-line titles stay readable. */}
        <div ref={toolsRef} className="grid sm:grid-cols-2 gap-6">
          {tools.map((p, i) => (
            <ToolCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { Spec, ArrowUpRight };
