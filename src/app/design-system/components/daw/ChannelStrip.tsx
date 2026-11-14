'use client';

import React, { useId, useState } from 'react';
import { clamp, formatDb, trackColor, type TrackColor } from './color';
import { dbToPosition, positionToDb } from './Fader';
import { formatPan } from './Knob';
import { useDragValue } from './useDragValue';

type ChannelStripProps = {
  name: string;
  color?: TrackColor;
  /** Fader level in dB. */
  volume: number;
  onVolumeChange?: (db: number) => void;
  /** -1 (left) to 1 (right). */
  pan?: number;
  onPanChange?: (pan: number) => void;
  muted?: boolean;
  soloed?: boolean;
  onMute?: () => void;
  onSolo?: () => void;
  /** Silenced by another channel's solo: the meter dims like a mute. */
  dimmed?: boolean;
  /** Post-fader level per channel in dBFS. */
  levels?: number[];
  peaks?: number[];
  /** Effect names in the insert chain, top to bottom. */
  inserts?: string[];
  selected?: boolean;
  onSelect?: () => void;
  /** The master strip: accent handle, latching clip light, no pan/mute/solo. */
  master?: boolean;
  faderHeight?: number;
};

const MIN_DB = -60;
const MAX_DB = 6;
// Zone boundaries in dBFS. They match --pc-meter-low/mid/high and Meter.
const MID_DB = -12;
const HIGH_DB = -3;

const meterPos = (db: number) => (Number.isFinite(db) ? clamp((db - MIN_DB) / -MIN_DB, 0, 1) : 0);
const zone = (db: number) => (db > HIGH_DB ? 'var(--pc-meter-high)' : db > MID_DB ? 'var(--pc-meter-mid)' : 'var(--pc-meter-low)');
const formatPeak = (db: number) => (!Number.isFinite(db) || db <= MIN_DB ? '-∞' : `${db > 0 ? '+' : ''}${db.toFixed(1)}`);

/**
 * The fader track is the meter: level fills the track and the handle rides on
 * it. The slider and the meter are siblings so each keeps its own role.
 */
const MeterFader: React.FC<{
  name: string;
  value: number;
  onChange?: (db: number) => void;
  levels: number[];
  peaks?: number[];
  height: number;
  handleColor: string;
  dimmed?: boolean;
  wide?: boolean;
}> = ({ name, value, onChange, levels, peaks, height, handleColor, dimmed, wide }) => {
  const pos = dbToPosition(value, MIN_DB, MAX_DB);
  const { ref, handlers } = useDragValue<HTMLDivElement>({
    value: pos,
    min: 0,
    max: 1,
    defaultValue: dbToPosition(0, MIN_DB, MAX_DB),
    onChange: (p) => onChange?.(positionToDb(p, MIN_DB, MAX_DB)),
    travel: height,
  });
  const text = formatDb(value, MIN_DB);
  const unity = dbToPosition(0, MIN_DB, MAX_DB) * 100;
  const loudest = Math.max(...levels);
  const inset = wide ? 14 : 12;

  return (
    <div className={`relative shrink-0 ${wide ? 'w-12' : 'w-10'}`} style={{ height }}>
      <div
        role="meter"
        aria-label={`${name} level`}
        aria-valuemin={MIN_DB}
        aria-valuemax={0}
        aria-valuenow={Number.isFinite(loudest) ? Math.max(MIN_DB, Math.round(loudest)) : MIN_DB}
        className={`absolute inset-y-0 flex gap-[2px] p-[3px] rounded-[3px] bg-surface-inset pointer-events-none transition-opacity duration-fast ${dimmed ? 'opacity-35' : ''}`}
        style={{ left: inset, right: inset }}
      >
        {levels.map((db, i) => {
          const peak = peaks ? meterPos(peaks[i]) : 0;
          return (
            <div key={i} className="relative flex-1 overflow-hidden rounded-[1px] bg-secondary">
              <div className="absolute inset-x-0 bottom-0" style={{ height: `${meterPos(db) * 100}%`, background: zone(db) }} />
              {peak > 0 && <div className="absolute inset-x-0 h-[2px] bg-[var(--pc-text)]" style={{ bottom: `calc(${peak * 100}% - 2px)` }} />}
            </div>
          );
        })}
      </div>
      {/* unity marks either side of the track */}
      <div aria-hidden className="absolute left-[5px] w-1 h-px bg-[var(--pc-text-muted)] pointer-events-none" style={{ bottom: `${unity}%` }} />
      <div aria-hidden className="absolute right-[5px] w-1 h-px bg-[var(--pc-text-muted)] pointer-events-none" style={{ bottom: `${unity}%` }} />
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={`${name} volume`}
        aria-orientation="vertical"
        aria-valuemin={MIN_DB}
        aria-valuemax={MAX_DB}
        aria-valuenow={Number.isFinite(value) ? value : MIN_DB}
        aria-valuetext={text}
        title={`${name} volume: ${text}`}
        className="absolute inset-0 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pc-surface-0)] cursor-ns-resize touch-none"
        {...handlers}
      >
        <div
          aria-hidden
          className="absolute h-[5px] -mb-[2.5px] rounded-[1px] shadow-[0_0_0_2px_var(--pc-surface-0)]"
          style={{ left: wide ? 6 : 4, right: wide ? 6 : 4, bottom: `${pos * 100}%`, background: handleColor }}
        />
      </div>
    </div>
  );
};

/** A small bipolar pan slider: the fill grows from center toward the side. */
const PanSlider: React.FC<{ name: string; value: number; onChange?: (v: number) => void; color: string }> = ({ name, value, onChange, color }) => {
  const { ref, handlers } = useDragValue<HTMLDivElement>({ value, min: -1, max: 1, step: 0.01, defaultValue: 0, onChange, travel: 120, axis: 'x' });
  const text = formatPan(value);
  const pct = value * 50;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={`${name} pan`}
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={value}
        aria-valuetext={text}
        title={`${name} pan: ${text}`}
        className="relative w-14 h-5 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-ew-resize touch-none"
        {...handlers}
      >
        <div aria-hidden className="absolute inset-x-0 top-2 h-1 rounded-[1px] bg-tertiary" />
        <div aria-hidden className="absolute top-2 h-1 rounded-[1px]" style={{ left: `${50 + Math.min(0, pct)}%`, width: `${Math.abs(pct)}%`, background: color }} />
        <div aria-hidden className="absolute top-[5px] left-1/2 w-px h-2.5 bg-[var(--pc-text-muted)]" />
      </div>
      <span aria-hidden className="font-mono text-[11px] leading-none tabular-nums text-secondary">
        {text}
      </span>
    </div>
  );
};

const segment = 'w-[26px] h-7 rounded-full text-xs font-semibold leading-none transition-colors duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent';

const ChannelStrip: React.FC<ChannelStripProps> = ({
  name,
  color = 1,
  volume,
  onVolumeChange,
  pan = 0,
  onPanChange,
  muted,
  soloed,
  onMute,
  onSolo,
  dimmed,
  levels = [-Infinity, -Infinity],
  peaks,
  inserts = [],
  selected,
  onSelect,
  master,
  faderHeight = 220,
}) => {
  const c = master ? 'var(--pc-accent)' : trackColor(color);
  const listId = useId();
  const [insertsOpen, setInsertsOpen] = useState(false);
  const [clipped, setClipped] = useState(false);
  const peak = Math.max(...(peaks ?? levels));
  if (master && peak >= 0 && !clipped) setClipped(true);

  return (
    <div
      role="group"
      aria-label={`${name} channel`}
      className={`relative flex flex-col items-center gap-2 py-3 px-1 shrink-0 rounded-pc-lg transition-colors duration-fast ${master ? 'w-[88px]' : 'w-20'} ${
        selected ? 'bg-secondary shadow-[inset_0_0_0_1px_var(--pc-line-strong)]' : ''
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && insertsOpen) setInsertsOpen(false);
      }}
    >
      {master ? (
        <span className="h-8 flex items-center text-xs font-semibold">{name}</span>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={!!selected}
          title={name}
          className="h-8 max-w-full px-2 flex items-center gap-1.5 rounded-full text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-tertiary transition-colors duration-fast"
        >
          <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: c }} />
          <span className="truncate">{name}</span>
        </button>
      )}

      {/* Peak readout, so clipping never rests on red alone. The master swaps it for a latching clip light. */}
      <div className="h-3.5 flex items-center">
        {master && clipped ? (
          <button
            type="button"
            onClick={() => setClipped(false)}
            aria-label="Clipped. Reset clip indicator"
            className="h-5 px-2 rounded-full bg-[var(--pc-danger)] text-inverse text-[10px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            CLIP
          </button>
        ) : (
          <span aria-hidden className={`font-mono text-[11px] leading-none tabular-nums ${peak > HIGH_DB ? 'text-[var(--pc-danger)] font-bold' : 'text-secondary'}`}>
            {formatPeak(peak)}
          </span>
        )}
      </div>

      <MeterFader
        name={name}
        value={volume}
        onChange={onVolumeChange}
        levels={levels}
        peaks={peaks}
        height={faderHeight}
        handleColor={master ? 'var(--pc-accent)' : 'var(--pc-text)'}
        dimmed={muted || dimmed}
        wide={master}
      />

      <span aria-hidden className="font-mono text-xs leading-none tabular-nums">
        {formatDb(volume)}
      </span>

      {master ? (
        // Same height as the pan slider and mute/solo pair, so the FX buttons line up.
        <span className="h-[73px] flex items-center text-[11px] text-secondary">Stereo out</span>
      ) : (
        <>
          <PanSlider name={name} value={pan} onChange={onPanChange} color={c} />
          <div className="flex p-0.5 rounded-full bg-tertiary">
            <button
              type="button"
              onClick={onMute}
              aria-pressed={!!muted}
              aria-label={`Mute ${name}`}
              className={`${segment} ${muted ? 'bg-mute text-inverse' : 'text-secondary hover:text-[var(--pc-text)]'}`}
            >
              M
            </button>
            <button
              type="button"
              onClick={onSolo}
              aria-pressed={!!soloed}
              aria-label={`Solo ${name}`}
              className={`${segment} ${soloed ? 'bg-solo text-inverse' : 'text-secondary hover:text-[var(--pc-text)]'}`}
            >
              S
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setInsertsOpen((o) => !o)}
        aria-expanded={insertsOpen}
        aria-controls={listId}
        aria-label={`${name} inserts, ${inserts.length}${inserts.length ? `: ${inserts.join(', ')}` : ''}`}
        className="h-6 px-2 rounded-full text-[11px] text-secondary hover:text-[var(--pc-text)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {inserts.length} FX
      </button>
      {insertsOpen && (
        <ul
          id={listId}
          className={`absolute z-10 bottom-11 min-w-[132px] m-0 p-1.5 list-none rounded-pc-md bg-tertiary border border-line-strong text-xs leading-6 ${master ? 'right-1' : 'left-1'}`}
        >
          {inserts.length === 0 ? (
            <li className="px-1.5 text-secondary">No inserts</li>
          ) : (
            inserts.map((fx, i) => (
              <li key={i} className="px-1.5">
                {fx}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ChannelStrip;
