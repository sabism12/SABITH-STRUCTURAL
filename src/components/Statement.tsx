import FlowField from "./FlowField";
import { MaskLines } from "./Reveal";

/** Pause between About and Work: one bold line over the animated liquid-glyph field. */
export default function Statement() {
  return (
    <section className="relative overflow-hidden bg-[#7a1607] text-paper wrap py-16 md:py-28" aria-label="Approach">
      <div className="absolute inset-0">
        <FlowField />
      </div>
      {/* Keeps the text readable over the brightest patches. */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_70%)]" />

      <div className="relative text-center [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
        <h2 className="display text-[11vw] md:text-[7vw] leading-[0.95]">
          <MaskLines lines={["Designed to code,", "checked by hand."]} />
        </h2>
      </div>
    </section>
  );
}
