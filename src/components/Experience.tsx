import { useId, useState } from "react";
import { credentials, designAreas, experience, toolkit } from "../data/content";
import { MaskLines, Reveal } from "./Reveal";

type JobT = (typeof experience)[number];

function Job({ job, index, defaultOpen }: { job: JobT; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const hasPoints = job.points.length > 0;
  return (
    <li className="border-t border-ink/15">
      <button
        type="button"
        className="w-full text-left grid grid-cols-[36px_1fr_auto] md:grid-cols-[48px_1fr_auto_32px] items-baseline gap-x-4 md:gap-x-6 py-5 md:py-7 disabled:cursor-default"
        aria-expanded={hasPoints ? open : undefined}
        aria-controls={hasPoints ? id : undefined}
        disabled={!hasPoints}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="label text-ink/50 tabular-nums">({String(index + 1).padStart(2, "0")})</span>
        <span>
          <span className="block text-[21px] md:text-[28px] font-medium tracking-[-0.02em] leading-tight">{job.role}</span>
          <span className="block text-[14px] md:text-[15px] text-ink/65 mt-1">
            {job.company} · {job.place}
          </span>
        </span>
        <span className="label text-ink/65 tabular-nums text-right whitespace-nowrap">{job.period.replace("Present", "Now")}</span>
        {hasPoints ? (
          <span aria-hidden className={`hidden md:block justify-self-end text-[22px] leading-none transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
            +
          </span>
        ) : (
          <span className="hidden md:block" />
        )}
      </button>
      {hasPoints && (
        <div id={id} className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ul className="pl-[52px] md:pl-[72px] md:pr-[56px] pb-6 md:pb-8 md:columns-2 md:gap-10 text-[15px] leading-[1.5] text-ink/75 space-y-2">
              {job.points.map((pt) => (
                <li key={pt} className="grid grid-cols-[14px_1fr] break-inside-avoid">
                  <span className="text-ink/35">—</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {hasPoints && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-hidden
          tabIndex={-1}
          className="md:hidden -mt-2 mb-4 ml-[52px] label text-ink/65 underline underline-offset-4"
        >
          {open ? "Show less" : `Show ${job.points.length} highlight${job.points.length > 1 ? "s" : ""}`}
        </button>
      )}
    </li>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="bg-paper text-ink wrap pt-14 md:pt-20 pb-14 md:pb-20 relative z-10">
      <div className="grid-site gap-y-6 mb-8 md:mb-12">
        <p className="label text-ink/65 col-span-4 md:col-span-3">(Experience)</p>
        <h2 className="col-span-4 md:col-span-9 display text-[12vw] md:text-[6.4vw]">
          <MaskLines lines={["Where I've worked", "and what I use."]} />
        </h2>
      </div>

      {/* Jobs: numbered rows that open to show the details; the current role starts open. */}
      <ol className="border-b border-ink/15">
        {experience.map((e, i) => (
          <Reveal key={e.role} delay={i * 0.05}>
            <Job index={i} job={e} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </ol>

      {/* Toolkit: numbered lists, one group per column */}
      <div className="grid-site gap-y-6 mt-12 md:mt-16">
        <p className="label text-ink/65 col-span-4 md:col-span-3">(Toolkit)</p>
        <div className="col-span-4 md:col-span-9 grid md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-10">
          {[...toolkit, { label: "Design areas", items: designAreas }].map((t, i) => (
            <Reveal key={t.label} delay={(i % 2) * 0.06}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="label text-ink/65 tabular-nums">({String(t.items.length).padStart(2, "0")})</span>
                <h3 className="text-[22px] md:text-[26px] font-medium tracking-[-0.02em] leading-tight">{t.label}</h3>
              </div>
              <ol className="grid grid-cols-2 md:grid-cols-1 gap-x-4">
                {t.items.map((it, n) => (
                  <li key={it} className="flex justify-between gap-3 border-b border-ink/15 py-2.5 text-[14px] md:text-[16px]">
                    <span>{it}</span>
                    <span className="text-ink/50 tabular-nums">{n + 1}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <div className="grid-site gap-y-6 mt-10 md:mt-14">
        <p className="label text-ink/65 col-span-4 md:col-span-3">(Credentials)</p>
        <ul className="col-span-4 md:col-span-9">
          {credentials.map((c, ci) => (
            <li key={c.title} className="grid grid-cols-[36px_1fr_auto] md:grid-cols-[48px_1fr_1fr_auto] gap-x-4 md:gap-x-6 gap-y-1 border-t border-ink/15 py-4 text-[15px]">
              <span className="label text-ink/50 tabular-nums pt-0.5">({String(ci + 1).padStart(2, "0")})</span>
              <span className="font-medium">{c.title}</span>
              <span className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 text-ink/65">{c.by}</span>
              <span className="col-start-3 row-start-1 md:col-start-4 text-right text-ink/65 whitespace-nowrap">{c.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
