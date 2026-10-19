import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { profile } from "../data/content";

const MIN_MS = 900;
const MAX_MS = 5000;

/** Short intro counter. Closes once the first hero frame is in (or after MAX_MS). */
export default function Loader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const start = useRef(performance.now());
  const readyRef = useRef(ready);
  const doneRef = useRef(onDone);
  readyRef.current = ready;
  doneRef.current = onDone;

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setCount(100);
      setTimeout(() => doneRef.current(), 200);
    };
    // Timers rather than rAF, so the loader also closes in background tabs.
    const tick = setInterval(() => {
      const elapsed = performance.now() - start.current;
      if ((readyRef.current && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        clearInterval(tick);
        finish();
      } else {
        setCount(Math.min(99, Math.round((elapsed / MIN_MS) * 92)));
      }
    }, 30);
    return () => clearInterval(tick);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black text-paper wrap flex flex-col justify-between py-6"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label="Loading"
    >
      <div className="label flex justify-between">
        <span>{profile.name}</span>
        <span className="text-white/55">{profile.role}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="label text-white/60">Loading portfolio</span>
        <span className="display text-[28vw] md:text-[16vw] tabular-nums leading-[0.8]" aria-hidden>{count}</span>
      </div>
    </motion.div>
  );
}
