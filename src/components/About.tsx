import { profile, stats } from "../data/content";
import { Reveal, ScrollWords } from "./Reveal";
import ShaderBackground from "./ShaderBackground";

export default function About() {
  return (
    <section id="about" className="relative isolate overflow-clip bg-ink wrap pt-16 md:pt-24 pb-10 md:pb-16">
      {/* One screen tall and pinned while the section scrolls past: cheap even on a long section. */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="sticky top-0 h-[100svh] opacity-60">
          <ShaderBackground variant="blueprint" />
        </div>
      </div>
      <p className="label text-white/55 mb-6 md:mb-10">(About)</p>

      <div className="grid-site gap-y-8 items-start">
        <Reveal className="col-span-4 md:col-span-4">
          <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-graphite">
            <img
              src="/images/portrait.webp"
              alt={`Portrait of ${profile.name}`}
              loading="lazy"
              className="size-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-[filter] duration-700"
            />
          </div>
        </Reveal>

        <div className="col-span-4 md:col-span-8 flex flex-col gap-12 md:gap-16">
          <ScrollWords
            text={profile.statement}
            className="text-[7.2vw] md:text-[2.75vw] leading-[1.1] tracking-[-0.03em] font-medium -mt-[0.2em]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
            {profile.facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.08} className="border-t border-white/15 pt-4 pb-5 md:pb-8">
                <p className="label text-white/55 mb-3">{f.label}</p>
                <p className="text-[15px] leading-snug whitespace-pre-line">{f.value}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 mt-10 md:mt-16">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-t border-white/15 pt-4 pb-4 md:pb-6">
            <p className="display text-[12.4vw] md:text-[7vw] leading-none whitespace-nowrap">
              {s.value}
              {s.unit && <span className="text-[0.4em] tracking-normal ml-1 text-white/55">{s.unit}</span>}
            </p>
            <p className="label text-white/55 mt-3 max-w-[22ch]">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
