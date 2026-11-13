'use client';

import React, { useRef, useState } from 'react';
import { colorVar, trackColor, type TrackColor } from './color';

export type StepRow = {
  name: string;
  steps: boolean[];
  color?: TrackColor;
};

type StepSequencerProps = {
  rows: StepRow[];
  onToggle: (row: number, step: number) => void;
  /** Step being played, highlighted across every row. */
  currentStep?: number;
  /** Steps per beat; every beat after the first is shaded. */
  stepsPerBeat?: number;
  label?: string;
};

const StepSequencer: React.FC<StepSequencerProps> = ({ rows, onToggle, currentStep, stepsPerBeat = 4, label = 'Drum pattern' }) => {
  // Roving focus: one cell is tabbable, arrow keys move between cells.
  const [focus, setFocus] = useState<[number, number]>([0, 0]);
  const cells = useRef<Map<string, HTMLButtonElement>>(new Map());
  const steps = Math.max(...rows.map((r) => r.steps.length), 0);

  const move = (r: number, s: number) => {
    const nr = (r + rows.length) % rows.length;
    const ns = (s + steps) % steps;
    setFocus([nr, ns]);
    cells.current.get(`${nr}:${ns}`)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, r: number, s: number) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => move(r, s + 1),
      ArrowLeft: () => move(r, s - 1),
      ArrowDown: () => move(r + 1, s),
      ArrowUp: () => move(r - 1, s),
      Home: () => move(r, 0),
      End: () => move(r, steps - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <div role="group" aria-label={label} className="inline-flex flex-col gap-1 p-2 rounded-xl bg-secondary border border-line">
      {rows.map((row, r) => (
        <div key={row.name} role="group" aria-label={row.name} className="flex items-center gap-2" style={colorVar(trackColor(row.color ?? 1))}>
          <span className="w-16 shrink-0 text-[11px] text-secondary truncate">{row.name}</span>
          <div className="flex gap-[3px]">
            {row.steps.map((on, s) => {
              const beat = Math.floor(s / stepsPerBeat);
              const now = s === currentStep;
              const tabbable = focus[0] === r && focus[1] === s;
              return (
                <button
                  key={s}
                  ref={(el) => {
                    if (el) cells.current.set(`${r}:${s}`, el);
                    else cells.current.delete(`${r}:${s}`);
                  }}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${row.name} step ${s + 1}`}
                  tabIndex={tabbable ? 0 : -1}
                  onFocus={() => setFocus([r, s])}
                  onClick={() => onToggle(r, s)}
                  onKeyDown={(e) => onKeyDown(e, r, s)}
                  className={`w-6 h-7 rounded-[4px] transition-[background-color,box-shadow] duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    on
                      ? 'bg-[var(--c)] hover:brightness-110'
                      : beat % 2
                        ? 'bg-[color-mix(in_srgb,var(--pc-surface-2)_70%,var(--pc-surface-0))] hover:bg-surface-3'
                        : 'bg-tertiary hover:bg-surface-3'
                  } ${now ? 'shadow-[inset_0_0_0_2px_var(--pc-playhead)]' : ''} ${s > 0 && s % stepsPerBeat === 0 ? 'ml-1' : ''}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepSequencer;
