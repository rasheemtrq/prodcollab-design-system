'use client';

import React from 'react';
import { colorVar, formatDb, trackColor, type TrackColor } from './color';
import Fader from './Fader';
import Knob, { formatPan } from './Knob';
import Meter from './Meter';
import ToolButton from './ToolButton';

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
  /** Post-fader level per channel in dBFS. */
  levels?: number[];
  peaks?: number[];
  /** Effect names in the insert chain, top to bottom. */
  inserts?: string[];
  selected?: boolean;
  onSelect?: () => void;
  /** The master strip: wider, accent colored, no pan/mute/solo. */
  master?: boolean;
  faderHeight?: number;
};

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
  levels = [-Infinity, -Infinity],
  peaks,
  inserts = [],
  selected,
  onSelect,
  master,
  faderHeight = 180,
}) => {
  const c = master ? 'var(--pc-accent)' : trackColor(color);
  return (
    <div
      role="group"
      aria-label={`${name} channel`}
      onClick={onSelect}
      style={colorVar(c)}
      className={`flex flex-col items-center gap-2 p-1.5 shrink-0 rounded-pc-md border border-t-[3px] border-t-[var(--c)] transition-colors duration-fast ${
        master ? 'w-[92px]' : 'w-[84px]'
      } ${selected ? 'bg-tertiary border-line-strong' : 'bg-secondary border-line'}`}
    >
      <ul
        aria-label="Inserts"
        className="w-full h-[52px] overflow-hidden rounded-[5px] bg-surface-inset px-1.5 py-1 text-[10px] leading-[14px] text-secondary"
      >
        {inserts.length === 0 ? (
          <li className="text-subtle">No inserts</li>
        ) : (
          inserts.map((fx, i) => (
            <li key={i} className="truncate">
              {fx}
            </li>
          ))
        )}
      </ul>

      <div className="h-[64px] flex items-center" onClick={(e) => e.stopPropagation()}>
        {master ? (
          <span className="text-[10px] uppercase tracking-wider text-subtle">Stereo out</span>
        ) : (
          <Knob label="Pan" value={pan} min={-1} max={1} bipolar size="sm" color={c} formatValue={formatPan} onChange={onPanChange} />
        )}
      </div>

      <div className="flex gap-1.5 items-stretch" onClick={(e) => e.stopPropagation()}>
        <Fader label={`${name} volume`} value={volume} onChange={onVolumeChange} color={c} height={faderHeight} showScale={false} />
        <Meter levels={levels} peaks={peaks} length={faderHeight} thickness={4} showClip={master} label={`${name} level`} />
      </div>

      <span className="font-mono text-[10px] tabular-nums text-secondary">{formatDb(volume)}</span>

      <div className="flex gap-1 h-5" onClick={(e) => e.stopPropagation()}>
        {!master && (
          <>
            <ToolButton size="xs" tone="mute" pressed={!!muted} onClick={onMute} label={`Mute ${name}`}>
              M
            </ToolButton>
            <ToolButton size="xs" tone="solo" pressed={!!soloed} onClick={onSolo} label={`Solo ${name}`}>
              S
            </ToolButton>
          </>
        )}
      </div>

      <span className="w-full text-center text-xs font-semibold truncate" title={name}>
        {name}
      </span>
    </div>
  );
};

export default ChannelStrip;
