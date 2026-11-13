import React, { useMemo } from 'react';
import { colorVar, peerColor, trackColor, type PeerColor, type TrackColor } from './color';

export type ClipNote = {
  /** Start in beats from the clip start. */
  start: number;
  /** Length in beats. */
  length: number;
  /** MIDI note number. */
  pitch: number;
};

type ClipProps = {
  name: string;
  color?: TrackColor;
  /** Audio clips draw `peaks`; MIDI clips draw `notes`. */
  kind?: 'audio' | 'midi';
  /** Waveform peaks, 0..1, evenly spaced across the clip. */
  peaks?: number[];
  notes?: ClipNote[];
  /** Clip length in beats; needed to place MIDI notes. */
  lengthBeats?: number;
  selected?: boolean;
  muted?: boolean;
  /** A collaborator currently editing this clip. */
  editingBy?: { name: string; color: PeerColor };
  /** Size and position; clips fill their container by default. */
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

const Waveform: React.FC<{ peaks: number[] }> = ({ peaks }) => {
  const d = useMemo(() => {
    if (peaks.length === 0) return '';
    const n = peaks.length;
    const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
    const top = peaks.map((p, i) => `${x(i).toFixed(2)},${(50 - p * 48).toFixed(2)}`);
    const bottom = peaks.map((p, i) => `${x(i).toFixed(2)},${(50 + p * 48).toFixed(2)}`).reverse();
    return `M${top.join('L')}L${bottom.join('L')}Z`;
  }, [peaks]);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
      <path d={d} fill="var(--c)" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="var(--c)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Notes: React.FC<{ notes: ClipNote[]; length: number }> = ({ notes, length }) => {
  if (notes.length === 0) return null;
  const lo = Math.min(...notes.map((n) => n.pitch));
  const hi = Math.max(...notes.map((n) => n.pitch));
  const rows = Math.max(hi - lo + 1, 8);
  const pad = Math.floor((rows - (hi - lo + 1)) / 2);
  return (
    <svg viewBox={`0 0 ${length} ${rows}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
      {notes.map((n, i) => (
        <rect key={i} x={n.start} width={Math.max(n.length - 0.02, 0.05)} y={rows - 1 - (n.pitch - lo + pad)} height={0.8} fill="var(--c)" rx={0.05} />
      ))}
    </svg>
  );
};

const Clip: React.FC<ClipProps> = ({
  name,
  color = 1,
  kind = 'audio',
  peaks = [],
  notes = [],
  lengthBeats = 4,
  selected,
  muted,
  editingBy,
  style,
  className = '',
  onClick,
}) => {
  const c = trackColor(color);
  const peer = editingBy ? peerColor(editingBy.color) : undefined;
  return (
    <div
      role="group"
      aria-label={`${name} clip${selected ? ', selected' : ''}${muted ? ', muted' : ''}${editingBy ? `, ${editingBy.name} is editing` : ''}`}
      onClick={onClick}
      style={{ ...colorVar(c), ...(peer ? { ['--peer' as string]: peer } : {}), ...style }}
      className={`relative overflow-hidden rounded-pc-sm border cursor-grab select-none min-w-[6px] h-full ${
        selected
          ? 'bg-[color-mix(in_srgb,var(--c)_46%,#0d0d0e)] border-white'
          : 'bg-[color-mix(in_srgb,var(--c)_26%,#0d0d0e)] border-[color-mix(in_srgb,var(--c)_70%,transparent)]'
      } ${peer ? 'shadow-[0_0_0_2px_var(--peer)]' : ''} ${muted ? 'opacity-40 saturate-0' : ''} ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-[15px] px-1.5 bg-[color-mix(in_srgb,var(--c)_78%,#000)] text-inverse text-[10px] font-semibold leading-[15px] truncate">
        {name}
      </div>
      <div className="absolute inset-x-0 top-[18px] bottom-[3px]">
        {kind === 'audio' ? <Waveform peaks={peaks} /> : <Notes notes={notes} length={lengthBeats} />}
      </div>
      {editingBy && (
        <span className="absolute right-1 top-[1px] px-1.5 rounded-full text-[9px] font-semibold leading-[13px] text-inverse bg-[var(--peer)]">
          {editingBy.name}
        </span>
      )}
    </div>
  );
};

/** Deterministic fake peaks for demos and loading states. */
export const demoPeaks = (count: number, seed = 1, shape: 'pluck' | 'pad' | 'vocal' = 'pad') => {
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const env =
      shape === 'pluck' ? Math.exp(-((t * 8) % 1) * 4) : shape === 'vocal' ? 0.35 + 0.55 * Math.abs(Math.sin(t * Math.PI * 5)) : 0.55 + 0.25 * Math.sin(t * Math.PI * 2);
    return Math.min(1, env * (0.55 + rand() * 0.45));
  });
};

export default Clip;
