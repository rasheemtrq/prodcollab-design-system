'use client';

import React, { useRef, useState } from 'react';
import { clamp } from './color';

type MeterProps = {
  /** Level per channel in dBFS. One value for mono, two for stereo. */
  levels: number[];
  /** Peak-hold level per channel in dBFS (see usePeakHold). */
  peaks?: number[];
  orientation?: 'vertical' | 'horizontal';
  /** Length along the meter in px (height when vertical). */
  length?: number;
  /** Width of each channel bar in px. */
  thickness?: number;
  /** Bottom of the scale in dBFS. */
  floorDb?: number;
  /** Show the clip light; it latches red once any peak reaches 0 dBFS. */
  showClip?: boolean;
  label?: string;
};

// Zone boundaries in dBFS. They match --pc-meter-low/mid/high.
const MID_DB = -12;
const HIGH_DB = -3;

const toPos = (db: number, floor: number) => (Number.isFinite(db) ? clamp((db - floor) / -floor, 0, 1) : 0);

const Meter: React.FC<MeterProps> = ({
  levels,
  peaks,
  orientation = 'vertical',
  length = 160,
  thickness = 5,
  floorDb = -60,
  showClip = false,
  label = 'Level',
}) => {
  const vertical = orientation === 'vertical';
  const mid = toPos(MID_DB, floorDb) * 100;
  const high = toPos(HIGH_DB, floorDb) * 100;
  const dir = vertical ? 'to top' : 'to right';
  // Hard stops so each zone is a flat color, like segment LEDs.
  const gradient = `linear-gradient(${dir}, var(--pc-meter-low) 0 ${mid}%, var(--pc-meter-mid) ${mid}% ${high}%, var(--pc-meter-high) ${high}% 100%)`;

  // Latches once any channel reaches 0 dBFS; clicking the light clears it.
  const [clipped, setClipped] = useState(false);
  const overs = (peaks ?? levels).some((db) => db >= 0);
  if (showClip && overs && !clipped) setClipped(true);

  const loudest = Math.max(...levels);

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={floorDb}
      aria-valuemax={0}
      aria-valuenow={Number.isFinite(loudest) ? Math.max(floorDb, Math.round(loudest)) : floorDb}
      className={`inline-flex gap-[2px] ${vertical ? 'flex-col items-center' : 'flex-row-reverse items-center'}`}
    >
      {showClip && (
        <button
          type="button"
          aria-label="Clip indicator, click to reset"
          title="Click to reset"
          onClick={() => setClipped(false)}
          className="rounded-xs"
          style={{
            width: vertical ? levels.length * thickness + (levels.length - 1) * 2 : 6,
            height: vertical ? 6 : levels.length * thickness + (levels.length - 1) * 2,
            background: clipped ? 'var(--pc-meter-high)' : 'var(--pc-surface-2)',
          }}
        />
      )}
      <div className={`flex gap-[2px] ${vertical ? 'flex-row' : 'flex-col'}`}>
        {levels.map((db, i) => {
          const p = toPos(db, floorDb) * 100;
          const peak = peaks ? toPos(peaks[i], floorDb) * 100 : 0;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xs bg-surface-inset"
              style={vertical ? { width: thickness, height: length } : { width: length, height: thickness }}
            >
              {/* The gradient spans the whole meter and is clipped, so colors stay put as the level moves. */}
              <div
                className="absolute inset-0"
                style={{
                  background: gradient,
                  clipPath: vertical ? `inset(${100 - p}% 0 0 0)` : `inset(0 ${100 - p}% 0 0)`,
                }}
              />
              {peaks && peak > 0 && (
                <div
                  className="absolute"
                  style={
                    vertical
                      ? { left: 0, right: 0, height: 2, bottom: `calc(${peak}% - 2px)`, background: peak >= high ? 'var(--pc-meter-high)' : 'var(--pc-text)' }
                      : { top: 0, bottom: 0, width: 2, left: `calc(${peak}% - 2px)`, background: peak >= high ? 'var(--pc-meter-high)' : 'var(--pc-text)' }
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Holds each channel's highest recent level for `holdMs`, then lets it fall
 * at `fallDbPerSec`. Call it with the same levels you pass to Meter.
 */
export function usePeakHold(levels: number[], holdMs = 1200, fallDbPerSec = 20) {
  const state = useRef<{ db: number; at: number }[]>([]);
  const now = typeof performance !== 'undefined' ? performance.now() : 0;
  return levels.map((db, i) => {
    const s = (state.current[i] ??= { db: -Infinity, at: now });
    if (db >= s.db) {
      s.db = db;
      s.at = now;
    } else if (now - s.at > holdMs) {
      const fallen = s.db - (fallDbPerSec * (now - s.at - holdMs)) / 1000;
      s.db = Math.max(db, fallen);
      if (s.db === db) s.at = now;
    }
    return s.db;
  });
}

export default Meter;
