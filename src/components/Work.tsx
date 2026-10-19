import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { projects, specLabels, type Project } from "../data/content";
import CodeVisual from "./CodeVisual";
import { sizeOf } from "../data/imageSizes";
import { MaskLines } from "./Reveal";

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
  hidden: { scale: 1.25 },
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

/** Building: big image card, title band, one orange button. The whole card is the link. */
function BuildingCard({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  // While the card passes through the screen the photo drifts a little: depth without a gimmick.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <Link
        to={`/work/${p.slug}`}
        className="group block overflow-hidden bg-[#141414] -mx-4 md:mx-0 md:border md:border-white/10 md:hover:border-white/25 transition-colors"
      >
        <motion.div variants={wipe} className="relative aspect-[4/3.3] md:aspect-[4/3] overflow-hidden">
          <motion.div variants={settle} className="absolute inset-0">
            <motion.div style={{ y: drift }} className="absolute -inset-y-[8%] inset-x-0">
              <Visual p={p} className="absolute inset-0 size-full" />
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Title band: cream strip between the photo and the details. */}
        <h3 className="bg-paper text-ink font-marsden font-semibold uppercase text-center tracking-tight leading-[0.92] text-5xl md:text-6xl xl:text-7xl px-4 md:px-5 pt-4 pb-3 md:pt-5 md:pb-4 overflow-hidden">
          <motion.span variants={rise} className="block">
            {p.title}
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
      className="h-full"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delayChildren: index * 0.12 }}
    >
      <Link
        to={`/work/${p.slug}`}
        className="group flex flex-col h-full overflow-hidden bg-[#141414] border border-white/10 hover:border-white/25 transition-colors"
      >
        <motion.div variants={wipe} className="relative aspect-square md:aspect-[16/10] overflow-hidden bg-[#1b2129]">
          <motion.div variants={settle} className="absolute inset-0">
            <Visual p={p} className="absolute inset-0 size-full" />
          </motion.div>
        </motion.div>
        <div className="p-3 pb-4 md:p-5 flex flex-col flex-1">
          <h3 className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 mb-1 bg-paper text-ink px-3 md:px-5 pt-3 pb-2.5 md:pt-4 md:pb-3 font-marsden font-semibold uppercase text-center tracking-tight leading-[0.92] text-[26px] md:text-5xl">{p.title}</h3>
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

export default function Work() {
  const buildings = projects.filter((p) => p.kind !== "Plugin");
  const tools = projects.filter((p) => p.kind === "Plugin");
  return (
    <section id="work" className="bg-ink wrap pt-12 md:pt-20 pb-14 md:pb-24">
      <div className="grid-site gap-y-6 mb-10 md:mb-16">
        <p className="label text-white/60 col-span-2 md:col-span-3">(Work — {String(projects.length).padStart(2, "0")})</p>
        <p className="label text-white/60 col-span-2 md:col-span-2 md:col-start-11 text-right tabular-nums">/ 2024–26 /</p>
        <h2 className="col-span-4 md:col-span-9 md:col-start-4 md:row-start-1 display text-[12vw] md:text-[6.4vw]">
          <MaskLines lines={["Buildings designed,", "tools built."]} />
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {buildings.map((p) => (
          <BuildingCard key={p.slug} p={p} />
        ))}
      </div>

      <div className="mt-6 md:mt-10">
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {tools.map((p, i) => (
            <ToolCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { Spec, ArrowUpRight };
