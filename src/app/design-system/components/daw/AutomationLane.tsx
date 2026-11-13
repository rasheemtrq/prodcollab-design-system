'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { colorVar, trackColor, type TrackColor } from './color';
import { beatLabel, curve, insertPoint, movePoint, removePoint, snapNearest, sortPoints, type AutomationPoint } from './editing';

export type { AutomationPoint };

type AutomationLaneProps = {
  points: AutomationPoint[];
  onChange: (points: AutomationPoint[]) => void;
  /** Parameter name, e.g. "Volume" or "Filter cutoff". */
  label: string;
  lengthBeats: number;
  beatWidth?: number;
  height?: number;
  color?: TrackColor;
  /** Grid for point times in beats. Hold Shift while dragging to ignore it. */
  snap?: number;
  /** Readout for a normalized value, e.g. via positionToDb for a volume lane. */
  formatValue?: (v: number) => string;
  /** Value drawn (and used) when the lane has no points. */
  defaultValue?: number;
  /** Playhead position in beats. A dot marks the automated value there. */
  playhead?: number;
  beatsPerBar?: number;
};

let idCounter = 0;
const newId = () => `p${Date.now().toString(36)}${(idCounter++).toString(36)}`;
const DOT = 10;

/**
 * Breakpoint automation for one parameter, drawn in song time under a track.
 * Click empty space to add a point, drag to move it, double-click or
 * right-click to remove it. Points are buttons, so the keyboard can do all
 * of this too. Values are normalized 0..1.
 */
const AutomationLane: React.FC<AutomationLaneProps> = ({
  points,
  onChange,
  label,
  lengthBeats,
  beatWidth = 22,
  height = 72,
  color = 1,
  snap = 0.25,
  formatValue = (v) => `${Math.round(v * 100)}%`,
  defaultValue = 0.5,
  playhead,
  beatsPerBar = 4,
}) => {
  const lane = useRef<HTMLDivElement>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const drag = useRef<{ id: string; points: AutomationPoint[] } | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pointFocused, setPointFocused] = useState(false);
  const helpId = useId();
  // Handlers read the newest points, so repeated keys never act on a stale list.
  const latest = useRef(points);
  latest.current = points;

  const width = lengthBeats * beatWidth;
  const sorted = sortPoints(points);
  const x = (t: number) => t * beatWidth;
  const y = (v: number) => (1 - v) * (height - DOT) + DOT / 2;

  const locate = (e: { clientX: number; clientY: number; shiftKey: boolean }) => {
    const r = lane.current!.getBoundingClientRect();
    const t = snapNearest(Math.max(0, Math.min(lengthBeats, (e.clientX - r.left) / beatWidth)), e.shiftKey ? 0 : snap);
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - r.top - DOT / 2) / (height - DOT)));
    return { t, v };
  };

  // Focus requests wait for the next render, when an added point's button exists.
  const pendingFocus = useRef<string | null>(null);
  const focusPoint = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    const el = refs.current.get(id);
    if (el) el.focus({ preventScroll: true });
    else pendingFocus.current = id;
  };
  useEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    refs.current.get(id)?.focus({ preventScroll: true });
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    lane.current!.setPointerCapture(e.pointerId);
    const pointEl = (e.target as HTMLElement).closest<HTMLElement>('[data-point]');
    let id = pointEl?.dataset.point;
    let next = points;
    if (!id) {
      const { t, v } = locate(e);
      id = newId();
      next = insertPoint(points, { id, t, v }, lengthBeats);
      onChange(next);
    }
    drag.current = { id, points: next };
    setDragging(true);
    focusPoint(id);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const { t, v } = locate(e);
    d.points = movePoint(d.points, d.id, t, v, lengthBeats);
    onChange(d.points);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const remove = (id: string) => {
    const i = sorted.findIndex((p) => p.id === id);
    onChange(removePoint(points, id));
    // Keep keyboard users in the lane: focus the neighbour.
    const neighbour = sorted[i + 1] ?? sorted[i - 1];
    if (neighbour) focusPoint(neighbour.id);
    else {
      setActive(null);
      lane.current?.focus();
    }
  };

  const onPointKey = (e: React.KeyboardEvent, id: string) => {
    const now = latest.current;
    const p = now.find((x) => x.id === id);
    if (!p) return;
    const fine = e.shiftKey;
    const moves: Record<string, [number, number]> = {
      ArrowUp: [0, fine ? 0.01 : 0.05],
      ArrowDown: [0, fine ? -0.01 : -0.05],
      ArrowRight: [snap || 0.25, 0],
      ArrowLeft: [-(snap || 0.25), 0],
      PageUp: [0, 0.25],
      PageDown: [0, -0.25],
    };
    if (e.key in moves) {
      const [dt, dv] = moves[e.key];
      const next = movePoint(now, p.id, p.t + dt, p.v + dv, lengthBeats);
      latest.current = next;
      onChange(next);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      remove(p.id);
    } else if (e.key === 'Home' || e.key === 'End') {
      focusPoint((e.key === 'Home' ? sorted[0] : sorted[sorted.length - 1])?.id);
    } else return;
    e.preventDefault();
    e.stopPropagation();
  };

  // The lane itself: Enter adds a point at the playhead (or the start).
  const onLaneKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const t = Math.max(0, Math.min(lengthBeats, snapNearest(playhead ?? 0, snap)));
      const id = newId();
      onChange(insertPoint(points, { id, t, v: valueHere(t) }, lengthBeats));
      focusPoint(id);
    }
  };

  const line = curve(points, lengthBeats, defaultValue);
  const linePath = line.map(([t, v], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const areaPath = `${linePath}L${width},${height}L0,${height}Z`;
  const valueHere = (t: number) => {
    // Same rule as valueAt, reusing the drawn polyline.
    for (let i = 0; i < line.length - 1; i++) {
      const [ta, va] = line[i];
      const [tb, vb] = line[i + 1];
      if (t <= tb) return tb === ta ? vb : va + ((t - ta) / (tb - ta)) * (vb - va);
    }
    return line[line.length - 1][1];
  };
  const activePoint = sorted.find((p) => p.id === active);
  const bar = beatWidth * beatsPerBar;

  return (
    <div
      ref={lane}
      role="group"
      aria-label={`${label} automation, ${points.length} point${points.length === 1 ? '' : 's'}`}
      aria-describedby={helpId}
      tabIndex={0}
      onKeyDown={onLaneKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={(e) => {
        // By position: pointer capture makes the dblclick target the lane, not the point.
        const id = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-point]')?.dataset.point;
        if (id) remove(id);
      }}
      onContextMenu={(e) => {
        const id = (e.target as HTMLElement).closest<HTMLElement>('[data-point]')?.dataset.point;
        if (id) {
          e.preventDefault();
          remove(id);
        }
      }}
      className="relative shrink-0 overflow-hidden bg-surface-0 cursor-crosshair touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      style={{
        ...colorVar(trackColor(color)),
        width,
        height,
        backgroundImage: `repeating-linear-gradient(to right, var(--pc-line-strong) 0 1px, transparent 1px ${bar}px), repeating-linear-gradient(to right, color-mix(in srgb, var(--pc-line) 70%, transparent) 0 1px, transparent 1px ${beatWidth}px)`,
      }}
    >
      <svg className="absolute inset-0 pointer-events-none" width={width} height={height} aria-hidden>
        <path d={areaPath} fill="color-mix(in srgb, var(--c) 16%, transparent)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--c)"
          strokeWidth={1.5}
          strokeDasharray={points.length ? undefined : '4 4'}
          strokeOpacity={points.length ? 1 : 0.6}
        />
      </svg>

      <span className="absolute left-1.5 top-1 text-[10px] text-secondary pointer-events-none select-none">{label}</span>

      {sorted.map((p) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            ref={(el) => {
              if (el) refs.current.set(p.id, el);
              else refs.current.delete(p.id);
            }}
            type="button"
            data-point={p.id}
            aria-label={`${label} point at ${beatLabel(p.t, beatsPerBar)}: ${formatValue(p.v)}`}
            tabIndex={on || (!activePoint && p === sorted[0]) ? 0 : -1}
            onFocus={() => {
              setActive(p.id);
              setPointFocused(true);
            }}
            onBlur={() => setPointFocused(false)}
            onKeyDown={(e) => onPointKey(e, p.id)}
            className={`absolute rounded-full border-2 outline-none cursor-grab focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--pc-surface-0)] ${
              on ? 'bg-white border-white' : 'bg-surface-0 border-[var(--c)] hover:bg-[var(--c)]'
            }`}
            style={{ width: DOT, height: DOT, left: x(p.t) - DOT / 2, top: y(p.v) - DOT / 2 }}
          />
        );
      })}

      {/* Readout while dragging or focused. */}
      {activePoint && (dragging || pointFocused) && (
        <div
          aria-hidden
          className="absolute z-10 px-1.5 py-0.5 rounded bg-surface-inverse text-inverse text-[10px] font-mono whitespace-nowrap pointer-events-none -translate-x-1/2"
          style={{
            // Kept inside the lane: centred on the point, but never past either end,
            // and below the point when there is no room above it.
            left: Math.min(Math.max(x(activePoint.t), 48), width - 48),
            top: y(activePoint.v) - 26 >= 0 ? y(activePoint.v) - 26 : y(activePoint.v) + 9,
          }}
        >
          {formatValue(activePoint.v)} · {beatLabel(activePoint.t, beatsPerBar)}
        </div>
      )}

      {playhead !== undefined && playhead >= 0 && playhead <= lengthBeats && (
        <>
          <div aria-hidden className="absolute top-0 bottom-0 w-px bg-playhead opacity-70 pointer-events-none" style={{ left: x(playhead) }} />
          <div
            aria-hidden
            className="absolute w-1.5 h-1.5 rounded-full bg-playhead pointer-events-none"
            style={{ left: x(playhead) - 3, top: y(valueHere(playhead)) - 3 }}
          />
        </>
      )}

      <p id={helpId} className="sr-only">
        Points are listed in time order. Up and down change a point&rsquo;s value (Shift for fine steps), left and right move it in time, Delete
        removes it, Home and End jump to the first and last point. On the lane itself, Enter adds a point at the playhead.
      </p>
    </div>
  );
};

export default AutomationLane;
