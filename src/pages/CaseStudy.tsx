import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { sizeOf } from "../data/imageSizes";
import { MaskLines, Reveal } from "../components/Reveal";
import { ArrowUpRight, Spec } from "../components/Work";
import CodeVisual from "../components/CodeVisual";
import { profile, projects } from "../data/content";

export default function CaseStudy() {
  const { slug } = useParams();
  const lenis = useLenis();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [slug, lenis]);

  useEffect(() => {
    if (project) document.title = `${project.title} — Mohammed Sabith`;
    return () => {
      document.title = "Mohammed Sabith — Structural Design Engineer, Doha";
    };
  }, [project]);

  if (!project) return <Navigate to="/" replace />;
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <main id="main" className="bg-ink">
        <section className="wrap pt-24 md:pt-32 pb-8 md:pb-12">
          <div className="grid-site gap-y-6">
            <Link to="/#work" className="label text-white/55 hover:text-paper transition-colors col-span-2 md:col-span-3">
              ← All work
            </Link>
            <p className="label text-white/55 col-span-2 md:col-span-1 md:col-start-12 text-right tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
            <h1 key={project.slug} className="col-span-4 md:col-span-11 md:col-start-4 md:row-start-1 display text-[14vw] md:text-[8.4vw]">
              <MaskLines lines={[project.title]} animateOnMount delay={0.05} />
            </h1>
          </div>
        </section>

        <motion.div
          key={project.slug}
          className="wrap"
          initial={{ clipPath: "inset(12% 0 0 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.hero ? (
            <div className={`overflow-hidden bg-graphite ${project.heroFocus === "top" ? "aspect-[3/2] md:aspect-[16/9]" : "aspect-[4/3] md:aspect-[21/9]"}`}>
              <img src={project.hero} alt={project.title} {...sizeOf(project.hero)} className={`size-full object-cover ${project.heroFocus === "top" ? "object-top" : ""}`} />
            </div>
          ) : (
            <CodeVisual lines={project.code ?? []} label={project.slug} className="aspect-[4/3] md:aspect-[21/9]" />
          )}
        </motion.div>

        <section className="wrap pt-8 md:pt-12 pb-10 md:pb-16">
          <div className="grid-site gap-y-6">
            <p className="label text-white/60 col-span-4 md:col-span-3">{project.kind ?? "Building"}</p>
            <div className="col-span-4 md:col-span-6">
              <Spec p={project} />
            </div>
          </div>
        </section>

        {project.sections.map((s, i) => (
          <section key={s.title} className="wrap py-10 md:py-14 border-t border-white/10">
            <div className="grid-site gap-y-8">
              <div className="col-span-4 md:col-span-3">
                <p className="label text-white/55 tabular-nums mb-2">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-[26px] md:text-[30px] font-medium tracking-[-0.02em] leading-tight">{s.title}</h2>
              </div>
              <Reveal className={`col-span-4 ${s.images.length ? "md:col-span-4 lg:col-span-3" : "md:col-span-6"}`}>
                <p className={`leading-[1.5] text-white/75 ${s.images.length ? "text-[15px]" : "text-[17px] md:text-[20px]"}`}>{s.text}</p>
              </Reveal>
              {s.images.length > 0 && (
              <div className={`col-span-4 md:col-span-12 lg:col-span-6 grid gap-4 ${s.images.length > 1 ? "sm:grid-cols-2 lg:grid-cols-1" : ""}`}>
                {s.images.map((src) => (
                  <Reveal key={src}>
                    <img src={src} alt={`${project.title}: ${s.title}`} {...sizeOf(src)} loading="lazy" decoding="async" className="w-full h-auto bg-graphite" />
                  </Reveal>
                ))}
              </div>
              )}
            </div>
          </section>
        ))}

        <Link to={`/work/${next.slug}`} className="block wrap pt-10 pb-14 md:pb-20 border-t border-white/10 group">
          <span className="label text-white/55 flex items-center gap-2">
            Next <ArrowUpRight />
          </span>
          <span className="display block text-[14vw] md:text-[8.4vw] mt-4 text-white/40 group-hover:text-paper transition-colors duration-500">
            {next.title}
          </span>
        </Link>
      </main>
      {/* Project pages end with a slim footer, not the full contact section. */}
      <footer className="bg-black text-paper wrap py-6 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 label">
          <Link to="/#work" className="text-white/70 hover:text-paper transition-colors">
            ← All work
          </Link>
          <a href={`mailto:${profile.email}`} className="text-white/70 hover:text-accent transition-colors break-all">
            {profile.email}
          </a>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
            className="text-white/70 hover:text-paper transition-colors whitespace-nowrap"
          >
            Back to top ↑
          </button>
        </div>
      </footer>
    </>
  );
}
