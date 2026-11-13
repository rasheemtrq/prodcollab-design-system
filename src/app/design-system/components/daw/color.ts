// Helpers shared by the DAW components.
import type { CSSProperties } from 'react';

/** A track swatch (1-8, from tokens.css) or any CSS color. */
export type TrackColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | string;
/** A collaborator swatch (1-6, from tokens.css) or any CSS color. */
export type PeerColor = 1 | 2 | 3 | 4 | 5 | 6 | string;

export const trackColor = (c: TrackColor = 1) => (typeof c === 'number' ? `var(--pc-track-${c})` : c);
export const peerColor = (c: PeerColor = 1) => (typeof c === 'number' ? `var(--pc-peer-${c})` : c);

/** Sets the `--c` custom property that component styles derive tints from. */
export const colorVar = (color: string): CSSProperties => ({ ['--c' as string]: color });

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Formats decibels for readouts: "-6.0 dB", "+1.5 dB", "-∞ dB". */
export const formatDb = (db: number, floor = -60) =>
  db <= floor || !Number.isFinite(db) ? '-∞ dB' : `${db > 0 ? '+' : ''}${db.toFixed(1)} dB`;

export const dbToGain = (db: number) => (Number.isFinite(db) ? 10 ** (db / 20) : 0);
export const gainToDb = (gain: number) => (gain > 0 ? 20 * Math.log10(gain) : -Infinity);
