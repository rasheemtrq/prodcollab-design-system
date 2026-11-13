'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPause, faPlay, faRepeat, faStop } from '@fortawesome/free-solid-svg-icons';
import ToolButton from './ToolButton';

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

  return (
    <div role="toolbar" aria-label="Transport" className="inline-flex flex-wrap items-end gap-2 p-2 rounded-xl bg-secondary border border-line">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          aria-pressed={playing}
          title={`${playing ? 'Pause' : 'Play'} (Space)`}
          onClick={onPlayToggle}
          className="w-[38px] h-[30px] rounded-pc-md bg-accent text-accent-ink hover:bg-accent-hover transition-colors duration-fast grid place-items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pc-surface-1)] focus-visible:ring-accent"
        >
          <FontAwesomeIcon icon={playing ? faPause : faPlay} className="w-3.5 h-3.5" />
        </button>
        <ToolButton size="md" label="Stop" onClick={onStop}>
          <FontAwesomeIcon icon={faStop} />
        </ToolButton>
        {onRecordToggle && (
          <ToolButton size="md" tone="record" label="Record" pressed={!!recording} onClick={onRecordToggle}>
            <FontAwesomeIcon icon={faCircle} className={recording ? '' : 'text-record'} />
          </ToolButton>
        )}
        {onLoopToggle && (
          <ToolButton size="md" label="Loop" pressed={!!looping} onClick={onLoopToggle}>
            <FontAwesomeIcon icon={faRepeat} />
          </ToolButton>
        )}
        {onMetronomeToggle && (
          <ToolButton size="md" label="Metronome" pressed={!!metronome} onClick={onMetronomeToggle}>
            <MetronomeIcon />
          </ToolButton>
        )}
      </div>

      <Lcd label="Bar.Beat.Tick" tone={recording ? 'record' : 'accent'}>
        <span aria-live="off">{formatBbt(position, beatsPerBar)}</span>
      </Lcd>
      <Lcd label="Time" className="hidden sm:inline-flex">
        {formatClock(position, bpm)}
      </Lcd>
      <label className="inline-flex flex-col items-start gap-0.5">
        <span className="text-[9px] uppercase tracking-wider text-subtle leading-none">BPM</span>
        <input
          type="text"
          inputMode="decimal"
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
          }}
          className="h-7 w-[64px] px-2.5 rounded-[7px] bg-surface-inset border border-line font-mono font-semibold text-sm text-accent tabular-nums outline-none focus:border-accent"
        />
      </label>
    </div>
  );
};

export default Transport;
