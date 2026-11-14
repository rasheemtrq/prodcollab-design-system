'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPause, faPlay, faRepeat, faStop } from '@fortawesome/free-solid-svg-icons';

/** Ticks per quarter note, matching the DAW engine. */
export const PPQ = 960;

/** 0-based position in beats → "1.1.000" (bar.beat.tick, 1-based bars and beats). */
export const formatBbt = (beats: number, beatsPerBar = 4) => {
  const b = Math.max(0, beats);
  const bar = Math.floor(b / beatsPerBar) + 1;
  const beat = Math.floor(b % beatsPerBar) + 1;
  const tick = Math.floor((b % 1) * PPQ);
  return `${bar}.${beat}.${String(tick).padStart(3, '0')}`;
};

/** Position in beats at a tempo → "0:07.500" (m:ss.mmm). */
export const formatClock = (beats: number, bpm: number) => {
  const s = (Math.max(0, beats) * 60) / bpm;
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toFixed(3).padStart(6, '0')}`;
};

/** The dark inset readout used for position, tempo and other numbers. */
export const Lcd: React.FC<{ label?: string; children: React.ReactNode; className?: string; tone?: 'accent' | 'record' }> = ({
  label,
  children,
  className = '',
  tone = 'accent',
}) => (
  <div className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
    {label && <span className="text-[9px] uppercase tracking-wider text-subtle leading-none">{label}</span>}
    <div
      className={`h-7 px-2.5 min-w-[74px] rounded-[7px] bg-surface-inset border border-line font-mono font-semibold text-sm tabular-nums flex items-center ${
        tone === 'record' ? 'text-record' : 'text-accent'
      }`}
    >
      {children}
    </div>
  </div>
);

const MetronomeIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
    <path d="M6 1h4l3.5 14h-11L6 1Zm1.2 1.5L4.4 13.5h7.2L10.4 7.9l2.3-3.4-.8-.6-1.8 2.6-1.3-4H7.2Z" />
  </svg>
);

type TransportProps = {
  playing: boolean;
  onPlayToggle: () => void;
  onStop: () => void;
  /** Current position in beats (quarter notes), 0-based. */
  position: number;
  bpm: number;
  onBpmChange?: (bpm: number) => void;
  recording?: boolean;
  onRecordToggle?: () => void;
  looping?: boolean;
  onLoopToggle?: () => void;
  metronome?: boolean;
  onMetronomeToggle?: () => void;
  beatsPerBar?: number;
};

const Transport: React.FC<TransportProps> = ({
  playing,
  onPlayToggle,
  onStop,
  position,
  bpm,
  onBpmChange,
  recording,
  onRecordToggle,
  looping,
  onLoopToggle,
  metronome,
  onMetronomeToggle,
  beatsPerBar = 4,
}) => {
  const [draft, setDraft] = useState(String(bpm));
  useEffect(() => setDraft(String(bpm)), [bpm]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n) && n > 0) onBpmChange?.(Math.min(300, Math.max(20, Math.round(n * 10) / 10)));
    else setDraft(String(bpm));
  };

  const nudge = (delta: number) => {
    const n = Math.min(300, Math.max(20, Math.round((bpm + delta) * 10) / 10));
    if (n !== bpm) onBpmChange?.(n);
  };

  const round = 'size-9 shrink-0 rounded-full grid place-items-center transition-colors duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent';
  const ghost = `${round} hover:bg-tertiary`;
  const toggled = 'bg-[color-mix(in_srgb,var(--pc-accent)_22%,transparent)] text-accent';
  const divider = <span aria-hidden className="w-px h-5 mx-2.5 shrink-0 bg-line-strong" />;
  const hasToggles = !!(onLoopToggle || onMetronomeToggle);

  return (
    <div
      role="toolbar"
      aria-label="Transport"
      className="inline-flex items-center gap-0.5 h-11 p-1 rounded-full bg-secondary shadow-[inset_0_0_0_1px_var(--pc-line)]"
    >
      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        title={`${playing ? 'Pause' : 'Play'} (Space)`}
        onClick={onPlayToggle}
        className={`${round} bg-accent text-inverse hover:bg-accent-hover`}
      >
        <FontAwesomeIcon icon={playing ? faPause : faPlay} className="w-3 h-3" />
      </button>
      <button type="button" aria-label="Stop" title="Stop" onClick={onStop} className={`${ghost} text-primary`}>
        <FontAwesomeIcon icon={faStop} className="w-2.5 h-2.5" />
      </button>
      {onRecordToggle && (
        <button
          type="button"
          aria-label="Record"
          aria-pressed={!!recording}
          title="Record"
          onClick={onRecordToggle}
          className={recording ? `${round} bg-record text-inverse` : `${ghost} text-record`}
        >
          <FontAwesomeIcon icon={faCircle} className="w-3 h-3" />
        </button>
      )}

      {divider}
      {/* No labels: the bar.beat.tick and m:ss.mmm formats say what each number is. */}
      <div role="timer" aria-label={`Position, bar beat tick${recording ? ', recording' : ''}`} className="flex items-baseline gap-2.5 pr-1">
        <span aria-live="off" className={`min-w-[84px] font-mono text-base font-semibold tabular-nums ${recording ? 'text-record' : 'text-primary'}`}>
          {formatBbt(position, beatsPerBar)}
        </span>
        <span className="hidden sm:inline font-mono text-xs tabular-nums text-secondary">{formatClock(position, bpm)}</span>
      </div>
      {divider}

      <label className="h-9 px-2.5 flex items-center gap-1 rounded-full cursor-text">
        <input
          type="text"
          inputMode="decimal"
          aria-label="Tempo in BPM"
          value={draft}
          readOnly={!onBpmChange}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') {
              setDraft(String(bpm));
              (e.target as HTMLInputElement).blur();
            }
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && onBpmChange) {
              e.preventDefault();
              nudge((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 0.1 : 1));
            }
          }}
          className="w-10 bg-transparent text-right font-mono text-base font-semibold tabular-nums rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <span aria-hidden className="text-[11px] text-secondary">
          BPM
        </span>
      </label>

      {hasToggles && (
        <>
          {divider}
          {onLoopToggle && (
            <button type="button" aria-label="Loop" aria-pressed={!!looping} title="Loop" onClick={onLoopToggle} className={`${ghost} ${looping ? toggled : 'text-secondary'}`}>
              <FontAwesomeIcon icon={faRepeat} className="w-3.5 h-3.5" />
            </button>
          )}
          {onMetronomeToggle && (
            <button
              type="button"
              aria-label="Metronome"
              aria-pressed={!!metronome}
              title="Metronome"
              onClick={onMetronomeToggle}
              className={`${ghost} ${metronome ? toggled : 'text-secondary'}`}
            >
              <MetronomeIcon />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Transport;
