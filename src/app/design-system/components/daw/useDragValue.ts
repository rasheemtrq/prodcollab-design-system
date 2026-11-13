'use client';

import { useCallback, useEffect, useRef } from 'react';
import { clamp } from './color';

type Options = {
  value: number;
  min: number;
  max: number;
  /** Values snap to this increment. 0 or undefined means continuous. */
  step?: number;
  /** Double-click resets to this value. */
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Pixels of pointer travel for the full range. */
  travel?: number;
  /** Drag axis. Knobs use 'y'; horizontal sliders use 'x'. */
  axis?: 'x' | 'y';
  disabled?: boolean;
};

/**
 * The gestures every DAW control shares:
 * - drag along the axis (hold Shift for 10x finer moves)
 * - mouse wheel / trackpad scroll
 * - arrow keys (Shift = fine), PageUp/PageDown (coarse), Home/End
 * - double-click to reset to `defaultValue`
 *
 * Spread `handlers` on the focusable element and attach `ref` to it
 * (the wheel listener needs to be non-passive, so it is added natively).
 */
export function useDragValue<T extends HTMLElement>(options: Options) {
  const ref = useRef<T>(null);
  const opts = useRef(options);
  opts.current = options;
  // The unsnapped value during a drag, so small moves add up across steps.
  const drag = useRef<{ id: number; last: number; raw: number } | null>(null);

  const emit = useCallback((raw: number) => {
    const { min, max, step, value, onChange } = opts.current;
    let next = clamp(raw, min, max);
    if (step) next = Number((Math.round((next - min) / step) * step + min).toFixed(6));
    if (next !== value) onChange?.(next);
  }, []);

  const nudge = useCallback(
    (fraction: number) => {
      const { min, max, step, value } = opts.current;
      const range = max - min;
      const delta = range * fraction;
      // Make sure a keypress always moves at least one step.
      const sized = step ? Math.sign(delta) * Math.max(step, Math.abs(delta)) : delta;
      emit(value + sized);
    },
    [emit],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (opts.current.disabled) return;
      e.preventDefault();
      const dir = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? -e.deltaY : e.deltaX;
      if (dir) nudge((e.shiftKey ? 0.002 : 0.02) * Math.sign(dir));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [nudge]);

  const coord = (e: React.PointerEvent) => (opts.current.axis === 'x' ? e.clientX : -e.clientY);

  const handlers = {
    onPointerDown(e: React.PointerEvent<T>) {
      if (opts.current.disabled || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.focus();
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { id: e.pointerId, last: coord(e), raw: opts.current.value };
    },
    onPointerMove(e: React.PointerEvent<T>) {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      const { min, max, travel = 200 } = opts.current;
      const pos = coord(e);
      const scale = ((max - min) / travel) * (e.shiftKey ? 0.1 : 1);
      d.raw = clamp(d.raw + (pos - d.last) * scale, min, max);
      d.last = pos;
      emit(d.raw);
    },
    onPointerUp(e: React.PointerEvent<T>) {
      if (drag.current?.id === e.pointerId) drag.current = null;
    },
    onPointerCancel() {
      drag.current = null;
    },
    onDoubleClick() {
      const { defaultValue, disabled } = opts.current;
      if (!disabled && defaultValue !== undefined) emit(defaultValue);
    },
    onKeyDown(e: React.KeyboardEvent<T>) {
      if (opts.current.disabled) return;
      const fine = e.shiftKey ? 0.1 : 1;
      const { min, max } = opts.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          nudge(0.01 * fine);
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          nudge(-0.01 * fine);
          break;
        case 'PageUp':
          nudge(0.1);
          break;
        case 'PageDown':
          nudge(-0.1);
          break;
        case 'Home':
          emit(min);
          break;
        case 'End':
          emit(max);
          break;
        default:
          return;
      }
      e.preventDefault();
    },
  };

  return { ref, handlers };
}
