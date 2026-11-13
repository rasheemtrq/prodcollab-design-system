'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrum, faMicrophone, faMusic, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { colorVar, trackColor, type TrackColor } from './color';
import Meter from './Meter';
import ToolButton from './ToolButton';

export type TrackKind = 'audio' | 'midi' | 'drums' | 'vocal';

const KIND_ICON = { audio: faWaveSquare, midi: faMusic, drums: faDrum, vocal: faMicrophone };
const KIND_LABEL = { audio: 'Audio', midi: 'Instrument', drums: 'Drums', vocal: 'Vocal' };

type TrackHeaderProps = {
  name: string;
  kind?: TrackKind;
  color?: TrackColor;
  muted?: boolean;
  soloed?: boolean;
  armed?: boolean;
  selected?: boolean;
  /** Level in dBFS for the meter. Omit to hide the meter. */
  level?: number;
  onMute?: () => void;
  onSolo?: () => void;
  onArm?: () => void;
  onSelect?: () => void;
  /** A slot at the end of the name row, usually a <Menu> of track actions. */
  menu?: React.ReactNode;
  /** Row height in px; match the lane height. */
  height?: number;
  width?: number;
};

const TrackHeader: React.FC<TrackHeaderProps> = ({
  name,
  kind = 'audio',
  color = 1,
  muted,
  soloed,
  armed,
  selected,
  level,
  onMute,
  onSolo,
  onArm,
  onSelect,
  menu,
  height = 64,
  width = 220,
}) => (
  <div
    role="group"
    aria-label={`${name}, ${KIND_LABEL[kind]} track`}
    onClick={onSelect}
    style={{ ...colorVar(trackColor(color)), height, width }}
    className={`relative flex items-stretch shrink-0 overflow-hidden rounded-pc-md border transition-colors duration-fast ${
      selected ? 'bg-tertiary border-line-strong' : 'bg-secondary border-line hover:bg-[color-mix(in_srgb,var(--pc-surface-2)_60%,var(--pc-surface-1))]'
    } ${muted ? 'opacity-60' : ''}`}
  >
    <div className="w-1 shrink-0 bg-[var(--c)]" aria-hidden />
    <div className="flex flex-1 min-w-0 flex-col justify-between py-2 pl-2.5 pr-2">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-5 h-5 shrink-0 rounded-[5px] grid place-items-center text-[10px] text-[var(--c)] bg-[color-mix(in_srgb,var(--c)_18%,transparent)]"
          title={KIND_LABEL[kind]}
          aria-hidden
        >
          <FontAwesomeIcon icon={KIND_ICON[kind]} />
        </span>
        <span className="text-sm font-semibold truncate flex-1">{name}</span>
        {menu && (
          <span className="shrink-0 -mr-1" onClick={(e) => e.stopPropagation()}>
            {menu}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <ToolButton size="xs" tone="mute" pressed={!!muted} onClick={onMute} label={`Mute ${name}`}>
          M
        </ToolButton>
        <ToolButton size="xs" tone="solo" pressed={!!soloed} onClick={onSolo} label={`Solo ${name}`}>
          S
        </ToolButton>
        {onArm && (
          <ToolButton size="xs" tone="record" pressed={!!armed} onClick={onArm} label={`Arm ${name} for recording`}>
            R
          </ToolButton>
        )}
        {level !== undefined && (
          <div className="ml-auto">
            <Meter levels={[level]} orientation="horizontal" length={width - 120} thickness={4} label={`${name} level`} />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TrackHeader;
