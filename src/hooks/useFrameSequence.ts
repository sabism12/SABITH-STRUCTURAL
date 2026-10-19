import { useEffect, useRef, useState } from "react";

/**
 * Streams an image sequence in a coarse-to-fine order (first frame, every 10th, every 5th, ...)
 * so scrubbing works almost immediately and gets smoother as more frames arrive.
 */
export function useFrameSequence(frameCount: number, desktopBase: string, mobileBase: string) {
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [firstReady, setFirstReady] = useState(false);
  const listeners = useRef(new Set<() => void>());

  useEffect(() => {
    let cancelled = false;
    const base = window.innerWidth < 768 ? mobileBase : desktopBase;

    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [frameCount, 10, 5, 2, 1]) {
      for (let i = 0; i < frameCount; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }

    let next = 0;
    const loadNext = () => {
      if (cancelled || next >= order.length) return;
      const index = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.src = `${base}/ezgif-frame-${String(index + 1).padStart(3, "0")}.webp`;
      img.onload = () => {
        if (cancelled) return;
        framesRef.current[index] = img;
        if (index === 0) setFirstReady(true);
        listeners.current.forEach((fn) => fn());
        loadNext();
      };
      img.onerror = () => {
        if (index === 0) setFirstReady(true);
        loadNext();
      };
    };
    for (let i = 0; i < 6; i++) loadNext();

    return () => {
      cancelled = true;
    };
  }, [frameCount, desktopBase, mobileBase]);

  /** Nearest loaded frame to the one requested. */
  const getFrame = (index: number) => {
    const frames = framesRef.current;
    for (let d = 0; d < frameCount; d++) {
      if (frames[index - d]) return frames[index - d];
      if (frames[index + d]) return frames[index + d];
    }
    return undefined;
  };

  const onFrameLoaded = (fn: () => void) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  };

  return { firstReady, getFrame, onFrameLoaded };
}
