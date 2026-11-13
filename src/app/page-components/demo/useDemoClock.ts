'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Seconds elapsed while `running`, updated every animation frame.
 * Docs-only: drives meters and playheads without any real audio.
 */
export function useDemoClock(running: boolean) {
  const [t, setT] = useState(0);
  const base = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const from = base.current;
    const tick = (now: number) => {
      base.current = from + (now - start) / 1000;
      setT(base.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const reset = () => {
    base.current = 0;
    setT(0);
  };

  return { t, reset };
}

/**
 * A fake level in dBFS that pulses with the beat. `seed` gives each track
 * its own rhythm; `loudness` is the average level before the fader.
 */
export function demoLevel(t: number, bpm: number, seed: number, loudness = -14) {
  const beat = (t * bpm) / 60;
  const rate = [1, 2, 0.5, 4, 1, 2][seed % 6];
  const phase = (beat * rate + seed * 0.37) % 1;
  const pulse = Math.exp(-phase * (3 + (seed % 3) * 2));
  const wobble = Math.sin(t * (2.3 + seed) + seed) * 1.5;
  return loudness + 20 * Math.log10(0.25 + 0.75 * pulse) + 6 + wobble;
}
