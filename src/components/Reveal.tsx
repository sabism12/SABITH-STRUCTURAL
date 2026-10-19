import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children into place the first time they enter the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Headline whose lines slide up from behind a mask. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  animateOnMount = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  animateOnMount?: boolean;
}) {
  // The trigger sits on the wrapper: the lines themselves start clipped out of view,
  // so they would never register as intersecting.
  const trigger = animateOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <motion.span className={`block ${className ?? ""}`} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 1.1, delay: delay + i * 0.08, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]" aria-hidden>
      {word}
    </motion.span>
  );
}

/** Paragraph that lights up word by word as it scrolls through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  if (reduceMotion) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}
