'use client';

import React, { useId } from 'react';
import { useDragValue } from './useDragValue';

type KnobProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Double-click resets to this. Defaults to the center for bipolar knobs, else `min`. */
  defaultValue?: number;
  /** Visible label under the knob, also its accessible name. */
  label: string;
  /** Hide the visible label (it stays the accessible name). */
  hideLabel?: boolean;
  /** Fill from the center instead of from the left, e.g. for pan. */
  bipolar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Arc color. Any CSS color; defaults to the brand accent. */
  color?: string;
  /** Formats the readout and the value announced to screen readers. */
  formatValue?: (value: number) => string;
  disabled?: boolean;
};

const SIZES = { sm: 28, md: 40, lg: 56 };
const SWEEP = 135; // degrees either side of 12 o'clock

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
};

const arc = (r: number, from: number, to: number) => {
  if (Math.abs(to - from) < 0.01) return '';
  const [lo, hi] = from < to ? [from, to] : [to, from];
  const [x1, y1] = polar(r, lo);
  const [x2, y2] = polar(r, hi);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${hi - lo > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

/** Pan readout: "C", "L40", "R12" for values in -1..1. */
export const formatPan = (v: number) => {
  const pct = Math.round(Math.abs(v) * 100);
  return pct === 0 ? 'C' : `${v < 0 ? 'L' : 'R'}${pct}`;
};

const Knob: React.FC<KnobProps> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step,
  defaultValue,
  label,
  hideLabel,
  bipolar,
  size = 'md',
  color = 'var(--pc-accent)',
  formatValue = (v) => `${Math.round(((v - min) / (max - min)) * 100)}%`,
  disabled,
}) => {
  const labelId = useId();
  const reset = defaultValue ?? (bipolar ? (min + max) / 2 : min);
  const { ref, handlers } = useDragValue<HTMLDivElement>({
    value, min, max, step, defaultValue: reset, onChange, travel: 160, disabled,
  });

  const t = (value - min) / (max - min);
  const angle = -SWEEP + t * SWEEP * 2;
  const origin = bipolar ? 0 : -SWEEP;
  const [px, py] = polar(26, angle);
  const [ix, iy] = polar(12, angle);
  const text = formatValue(value);
  const dim = SIZES[size];

  return (
    <div className={`inline-flex flex-col items-center gap-1 select-none ${disabled ? 'opacity-40' : ''}`}>
      <div
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={text}
        aria-disabled={disabled || undefined}
        title={`${label}: ${text}`}
        className="group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-ns-resize touch-none"
        style={{ width: dim, height: dim }}
        {...handlers}
      >
        <svg viewBox="0 0 100 100" width={dim} height={dim} aria-hidden>
          <path d={arc(42, -SWEEP, SWEEP)} fill="none" stroke="var(--pc-surface-2)" strokeWidth="10" strokeLinecap="round" />
          <path d={arc(42, origin, angle)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
          <circle cx="50" cy="50" r="30" fill="var(--pc-surface-2)" className="transition-colors duration-fast group-hover:fill-[var(--pc-surface-3)]" />
          <line x1={ix} y1={iy} x2={px} y2={py} stroke="var(--pc-text)" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
      <span id={labelId} className={hideLabel ? 'sr-only' : 'text-[10px] uppercase tracking-wider text-secondary leading-none'}>
        {label}
      </span>
      {!hideLabel && <span className="text-[10px] font-mono text-primary leading-none tabular-nums">{text}</span>}
    </div>
  );
};

export default Knob;
