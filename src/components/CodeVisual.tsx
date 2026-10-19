import type { CodeLine } from "../data/content";

const tone: Record<CodeLine[0], string> = {
  c: "text-paper/40",
  k: "text-paper/85",
  s: "text-accent",
  "": "",
};

/** Editor-style card standing in for a photo on plugin entries. Fills its box. */
export default function CodeVisual({ lines, label, className = "" }: { lines: CodeLine[]; label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${label}: simplified code excerpt`}
      className={`bg-[#141414] border border-white/10 text-paper p-5 md:p-8 font-mono text-[10.5px] min-[400px]:text-[11px] sm:text-[12px] md:text-[14px] leading-[1.8] overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex items-center gap-1.5 mb-5 md:mb-8" aria-hidden>
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-paper/40 text-[11px] font-sans">{label}.py</span>
      </div>
      <div className="my-auto" aria-hidden>
        {lines.map(([t, text], i) => (
          <div key={i} className={`${tone[t]} whitespace-pre overflow-hidden text-ellipsis`}>
            {text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}
