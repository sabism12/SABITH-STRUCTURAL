import { useState } from "react";
import { useLenis } from "lenis/react";
import { profile } from "../data/content";
import { MaskLines, Reveal } from "./Reveal";
import ShaderBackground from "./ShaderBackground";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const lenis = useLenis();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone", value: profile.phone, href: profile.phoneHref },
    { label: "WhatsApp", value: "Message me", href: profile.whatsapp, external: true },
    { label: "LinkedIn", value: "in/sabithismail", href: profile.linkedin, external: true },
  ];

  return (
    <footer id="contact" className="bg-black text-paper relative z-10 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
        <ShaderBackground variant="contours" />
      </div>
      <div className="wrap pt-14 md:pt-20">
        <div className="grid-site gap-y-6">
          <p className="label text-white/55 col-span-4 md:col-span-3">(Contact)</p>
          <div className="col-span-4 md:col-span-9">
            <h2 className="display text-[13vw] md:text-[7.4vw]">
              <MaskLines lines={["Let's build", "something that", "stands."]} />
            </h2>
            <Reveal className="flex flex-wrap items-center gap-3 mt-8 md:mt-10">
              <button type="button" onClick={copyEmail} aria-live="polite" className="pill bg-paper text-ink hover:bg-white min-w-[180px]">
                {copied ? "Email copied" : "Copy email"}
              </button>
              <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="pill border border-white/25 hover:border-white/70">
                Download CV<span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
        </div>

      </div>

      {/* Scrolling orange strip; the whole band is a mail link. */}
      <a href={`mailto:${profile.email}`} className="marquee block mt-12 md:mt-16 bg-accent text-ink overflow-hidden py-3 md:py-5" aria-label={`Let's connect: email ${profile.email}`}>
        <div className="marquee-track flex w-max" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="display text-[16vw] md:text-[7vw] leading-none whitespace-nowrap flex items-center">
                  Let&rsquo;s connect
                  <span className="inline-flex items-center justify-center mx-[0.35em] size-[0.8em] rounded-full border-[0.06em] border-current text-[0.5em] font-medium">
                    ©
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </a>

      <div className="wrap pt-10 md:pt-14">
        <div className="grid-site gap-y-10">
          {/* Boxed details */}
          <Reveal className="col-span-4 md:col-span-5 lg:col-span-4">
            <div className="border border-white/25 label uppercase tracking-[0.04em]">
              <p className="px-4 py-3 border-b border-white/25">{profile.location}</p>
              <div className="grid grid-cols-[56px_1fr_56px]">
                <span className="flex items-center justify-center border-r border-white/25 py-3" aria-hidden>
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
                  </svg>
                </span>
                <span className="px-4 py-3 leading-snug text-center">
                  Open to roles
                  <br />
                  across the GCC
                </span>
                <span className="flex items-center justify-center border-l border-white/25 [writing-mode:vertical-rl] rotate-180 py-3">QAT</span>
              </div>
            </div>
          </Reveal>

          {/* Links */}
          <Reveal className="col-span-4 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8" delay={0.08}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] md:text-[16px]">
              {channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hover:text-accent transition-colors">
                    {c.label}
                    {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  CV (PDF)<span className="sr-only"> opens in a new tab</span>
                </a>
              </li>
            </ul>
            <a href={`mailto:${profile.email}`} className="block mt-8 text-[17px] md:text-[20px] font-medium break-words hover:text-accent transition-colors">
              {profile.email}
            </a>
            <p className="label text-white/55 mt-2 tabular-nums">{profile.phone}</p>
          </Reveal>
        </div>
      </div>

      <div className="wrap mt-8 md:mt-12">
        <p className="display text-[11.1vw] leading-[0.8] whitespace-nowrap select-none text-paper/95" aria-hidden>
          {profile.name}
        </p>
      </div>

      <div className="wrap flex justify-between items-center label text-white/55 gap-4 py-5 md:py-6 mt-4 md:mt-6 border-t border-white/10">
        <span>
          ©{new Date().getFullYear()} {profile.name}<span className="hidden sm:inline">. All rights reserved</span>
        </span>
        <button type="button" onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))} className="hover:text-paper transition-colors whitespace-nowrap shrink-0">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
