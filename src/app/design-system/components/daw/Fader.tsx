'use client';

import React, { useId } from 'react';
import { clamp, formatDb } from './color';
import { useDragValue } from './useDragValue';

type FaderProps = {
  /** Gain in dB. Values at or below `minDb` read as -∞. */
  value: number;
  onChange?: (db: number) => void;
  label: string;
  minDb?: number;
  maxDb?: number;
  /** Track color for the cap stripe. */
  color?: string;
  /** Track height in px. */
  height?: number;
  /** Show dB tick marks beside the track. */
  showScale?: boolean;
  disabled?: boolean;
};

// Fader law: position = ((dB - min) / (max - min))^2. With the defaults this
// puts 0 dB at about 83% of the travel and gives the top third (−12 to +6 dB)
// almost half the throw, which is where fine mixing moves happen.
export const dbToPosition = (db: number, minDb = -60, maxDb = 6) =>
  db <= minDb ? 0 : clamp((db - minDb) / (maxDb - minDb), 0, 1) ** 2;
export const positionToDb = (p: number, minDb = -60, maxDb = 6) =>
  p <= 0 ? -Infinity : Number((Math.sqrt(p) * (maxDb - minDb) + minDb).toFixed(1));

const TICKS = [6, 0, -6, -12, -24, -40];

const Fader: React.FC<FaderProps> = ({
  value,
  onChange,
  label,
  minDb = -60,
  maxDb = 6,
  color = 'var(--pc-text)',
  height = 160,
  showScale = true,
  disabled,
}) => {
  const labelId = useId();
  const pos = dbToPosition(value, minDb, maxDb);
  // The hook works in position space (0..1); we convert to dB on the way out.
  const { ref, handlers } = useDragValue<HTMLDivElement>({
    value: pos,
    min: 0,
    max: 1,
    defaultValue: dbToPosition(0, minDb, maxDb),
    onChange: (p) => onChange?.(positionToDb(p, minDb, maxDb)),
    travel: height,
    disabled,
  });
  const text = formatDb(value, minDb);
  const CAP = 26;

  return (
    <div className={`inline-flex items-stretch gap-1 select-none ${disabled ? 'opacity-40' : ''}`} style={{ height }}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <div
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-orientation="vertical"
        aria-valuemin={minDb}
        aria-valuemax={maxDb}
        aria-valuenow={Number.isFinite(value) ? value : minDb}
        aria-valuetext={text}
        aria-disabled={disabled || undefined}
        title={`${label}: ${text}`}
        className="group relative w-7 rounded-pc-sm outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-ns-resize touch-none"
        {...handlers}
      >
        {/* slot */}
        <div className="absolute left-1/2 -translate-x-1/2 w-1 rounded-full bg-surface-inset border border-line" style={{ top: CAP / 2, bottom: CAP / 2 }} />
        {/* unity mark */}
        <div
          className="absolute left-1 right-1 h-px bg-line-strong"
          style={{ bottom: `calc(${CAP / 2}px + (100% - ${CAP}px) * ${dbToPosition(0, minDb, maxDb)})` }}
        />
        {/* cap */}
        <div
          className="absolute left-0 right-0 rounded-[5px] bg-tertiary border border-line-strong shadow-md transition-colors duration-fast group-hover:bg-surface-3 flex items-center justify-center"
          style={{ height: CAP, bottom: `calc((100% - ${CAP}px) * ${pos})` }}
        >
          <div className="w-4 h-[2px] rounded-full" style={{ background: color }} />
        </div>
      </div>
      {showScale && (
        <div className="relative w-5 text-[9px] font-mono text-subtle tabular-nums" aria-hidden>
          {TICKS.filter((t) => t <= maxDb && t > minDb).map((t) => (
            <span
              key={t}
              className="absolute left-0 leading-none -translate-y-1/2"
              style={{ top: `calc(${CAP / 2}px + (100% - ${CAP}px) * ${1 - dbToPosition(t, minDb, maxDb)})` }}
            >
              {t > 0 ? `+${t}` : t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fader;
