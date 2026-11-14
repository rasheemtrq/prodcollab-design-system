'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { colorVar, trackColor, type TrackColor } from './color';
import {
  beatLabel,
  clampVelocity,
  deleteNotes,
  duplicateNotes,
  isBlackKey,
  lengthLabel,
  moveNotes,
  noteName,
  notesInBox,
  notesStartingInCell,
  nudgeVelocity,
  quantizeNotes,
  resizeNotes,
  setVelocity,
  snapDown,
  snapNearest,
  type RollNote,
} from './editing';

export type { RollNote };

type PianoRollProps = {
  notes: RollNote[];
  /** Called with the whole new note list after every edit. */
  onChange: (notes: RollNote[]) => void;
  /** Clip length in beats; notes are kept inside it. */
  lengthBeats: number;
  /** Grid in beats: 1 = quarter notes, 0.25 = sixteenths. */
  snap?: number;
  /** Length of new notes in beats. Resizing a note makes that the new default, as in the DAW. */
  defaultLength?: number;
  lowestPitch?: number;
  highestPitch?: number;
  beatWidth?: number;
  rowHeight?: number;
  /** Visible height of the note grid in px; it scrolls vertically. */
  height?: number;
  color?: TrackColor;
  /** Playhead position in beats from the clip start. */
  playhead?: number;
  /** Show the velocity lane under the grid. */
  showVelocity?: boolean;
  /** Called to audition a pitch: on placing, picking or dragging a note, or clicking a key. */
  onPreview?: (pitch: number, velocity: number) => void;
  /** Controlled selection. Leave undefined to let the roll manage it. */
  selection?: string[];
  onSelectionChange?: (ids: string[]) => void;
  label?: string;
  beatsPerBar?: number;
};

const KEYS_W = 56;
const VEL_H = 56;
const EDGE_PX = 7;

let idCounter = 0;
const newId = () => `n${Date.now().toString(36)}${(idCounter++).toString(36)}`;

type Drag =
  | { kind: 'move'; origin: RollNote[]; ids: Set<string>; beat: number; pitch: number; lastPitch: number; preview: string }
  | { kind: 'resize'; origin: RollNote[]; ids: Set<string>; beat: number; anchor: string }
  | { kind: 'box'; beat: number; pitch: number; base: Set<string> };

/**
 * A MIDI note editor with a keyboard, snap grid, playhead and velocity lane.
 * It is controlled: it reports every edit through `onChange` and never
 * keeps its own copy of the notes.
 */
const PianoRoll: React.FC<PianoRollProps> = ({
  notes,
  onChange,
  lengthBeats,
  snap = 0.25,
  defaultLength = 1,
  lowestPitch = 36,
  highestPitch = 84,
  beatWidth = 48,
  rowHeight = 14,
  height = 320,
  color = 1,
  playhead,
  showVelocity = true,
  onPreview,
  selection,
  onSelectionChange,
  label = 'Piano roll',
  beatsPerBar = 4,
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [innerSel, setInnerSel] = useState<string[]>([]);
  const [box, setBox] = useState<{ t0: number; t1: number; p0: number; p1: number } | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  // Keyboard cursor, used to place notes without a mouse.
  const [cursor, setCursor] = useState({ beat: 0, pitch: 60 });
  const [noteLength, setNoteLength] = useState(defaultLength);
  const [focused, setFocused] = useState(false);
  const helpId = useId();

  const sel = useMemo(() => new Set(selection ?? innerSel), [selection, innerSel]);
  const select = (ids: Iterable<string>) => {
    const list = [...ids];
    if (selection === undefined) setInnerSel(list);
    onSelectionChange?.(list);
  };

  const bounds = { lengthBeats, lowestPitch, highestPitch };
  const rows = highestPitch - lowestPitch + 1;
  const width = lengthBeats * beatWidth;
  const latest = useRef({ notes, onChange });
  latest.current = { notes, onChange };

  // Start scrolled to the notes (or middle C) rather than the top of the range.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const pitches = notes.map((n) => n.pitch);
    const center = pitches.length ? (Math.min(...pitches) + Math.max(...pitches)) / 2 : 60;
    el.scrollTop = (highestPitch - center) * rowHeight - height / 2;
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locate = (e: { clientX: number; clientY: number }) => {
    const r = grid.current!.getBoundingClientRect();
    const beat = Math.max(0, Math.min(lengthBeats, (e.clientX - r.left) / beatWidth));
    const row = Math.max(0, Math.min(rows - 1, Math.floor((e.clientY - r.top) / rowHeight)));
    return { beat, pitch: highestPitch - row };
  };

  // ------------------------------------------------------------ pointer

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    grid.current!.focus({ preventScroll: true });
    grid.current!.setPointerCapture(e.pointerId);
    const here = locate(e);
    const noteEl = (e.target as HTMLElement).closest<HTMLElement>('[data-note]');

    if (noteEl) {
      const id = noteEl.dataset.note!;
      const note = notes.find((n) => n.id === id)!;
      let ids = sel;
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        ids = new Set(sel);
        if (ids.has(id)) ids.delete(id);
        else ids.add(id);
        select(ids);
        if (!ids.has(id)) return; // just deselected it
      } else if (!sel.has(id)) {
        ids = new Set([id]);
        select(ids);
      }
      setCursor({ beat: note.start, pitch: note.pitch });
      const rect = noteEl.getBoundingClientRect();
      if (e.clientX > rect.right - Math.min(EDGE_PX, rect.width / 3)) {
        drag.current = { kind: 'resize', origin: notes, ids, beat: here.beat, anchor: id };
      } else {
        onPreview?.(note.pitch, note.velocity);
        drag.current = { kind: 'move', origin: notes, ids, beat: here.beat, pitch: here.pitch, lastPitch: note.pitch, preview: id };
      }
      return;
    }

    if (e.shiftKey) {
      // Shift-drag on empty space draws a selection box.
      drag.current = { kind: 'box', beat: here.beat, pitch: here.pitch, base: new Set(sel) };
      setBox({ t0: here.beat, t1: here.beat, p0: here.pitch, p1: here.pitch });
      return;
    }

    // Empty grid: place a note, then keep hold of it so it can be slid into place.
    const start = snapDown(here.beat, snap);
    if (start >= lengthBeats) return;
    const note: RollNote = {
      id: newId(),
      start,
      length: Math.max(snap || 0.0625, Math.min(noteLength, lengthBeats - start)),
      pitch: here.pitch,
      velocity: 100,
    };
    const next = [...notes, note];
    onChange(next);
    const ids = new Set([note.id]);
    select(ids);
    setCursor({ beat: start, pitch: note.pitch });
    onPreview?.(note.pitch, note.velocity);
    drag.current = { kind: 'move', origin: next, ids, beat: here.beat, pitch: here.pitch, lastPitch: note.pitch, preview: note.id };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const here = locate(e);
    // Alt (Option) ignores the grid while dragging.
    const g = e.altKey ? 0 : snap;
    if (d.kind === 'move') {
      const dt = snapNearest(here.beat - d.beat, g);
      const next = moveNotes(d.origin, d.ids, dt, here.pitch - d.pitch, bounds);
      const heard = next.find((n) => n.id === d.preview);
      if (heard && heard.pitch !== d.lastPitch) {
        d.lastPitch = heard.pitch;
        onPreview?.(heard.pitch, heard.velocity);
      }
      latest.current.onChange(next);
    } else if (d.kind === 'resize') {
      const dl = snapNearest(here.beat - d.beat, g);
      const next = resizeNotes(d.origin, d.ids, dl, g || 0.0625, lengthBeats);
      const anchor = next.find((n) => n.id === d.anchor);
      if (anchor) setNoteLength(anchor.length);
      latest.current.onChange(next);
    } else {
      setBox({ t0: d.beat, t1: here.beat, p0: d.pitch, p1: here.pitch });
      select(new Set([...d.base, ...notesInBox(latest.current.notes, d.beat, here.beat, d.pitch, here.pitch)]));
    }
  };

  const endDrag = () => {
    drag.current = null;
    setBox(null);
  };

  // Double-click or right-click deletes a note.
  const removeAt = (e: React.MouseEvent) => {
    // Look up by position: after pointer capture, the dblclick targets the grid, not the note.
    const noteEl = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-note]');
    if (!noteEl) return false;
    const id = noteEl.dataset.note!;
    onChange(deleteNotes(notes, new Set([id])));
    if (sel.has(id)) select([...sel].filter((x) => x !== id));
    return true;
  };

  // Alt + wheel over a note changes its velocity (and the selection's, if it is selected).
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.altKey) return;
      const noteEl = (e.target as HTMLElement).closest<HTMLElement>('[data-note]');
      if (!noteEl) return;
      e.preventDefault();
      const id = noteEl.dataset.note!;
      const { notes: ns, onChange: change } = latest.current;
      const targets = sel.has(id) ? sel : new Set([id]);
      change(nudgeVelocity(ns, targets, -Math.sign(e.deltaY) * 8));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [sel]);

  // ------------------------------------------------------------ keyboard

  const onKeyDown = (e: React.KeyboardEvent) => {
    // The newest notes, so repeated keys never act on a stale list.
    const notes = latest.current.notes;
    const onChange = (next: RollNote[]) => {
      latest.current.notes = next;
      latest.current.onChange(next);
    };
    const mod = e.ctrlKey || e.metaKey;
    const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const dy = e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0;
    const stepBeats = snap || 0.25;
    const handled = () => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (mod && e.key.toLowerCase() === 'a') {
      select(notes.map((n) => n.id));
      return handled();
    }
    if (e.key === 'Escape' && sel.size) {
      select([]);
      return handled();
    }

    if (sel.size) {
      if (dx || dy) {
        if (e.altKey && dy) onChange(nudgeVelocity(notes, sel, dy * 8));
        else if (e.shiftKey && dx) onChange(resizeNotes(notes, sel, dx * stepBeats, stepBeats, lengthBeats));
        else {
          const next = moveNotes(notes, sel, dx * stepBeats, dy * (e.shiftKey ? 12 : 1), bounds);
          onChange(next);
          const first = next.find((n) => sel.has(n.id));
          if (first) {
            setCursor({ beat: first.start, pitch: first.pitch });
            if (dy) onPreview?.(first.pitch, first.velocity);
          }
        }
        return handled();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        onChange(deleteNotes(notes, sel));
        select([]);
        return handled();
      }
      if (mod && e.key.toLowerCase() === 'd') {
        const out = duplicateNotes(notes, sel, snap, lengthBeats, newId);
        onChange(out.notes);
        if (out.added.length) select(out.added);
        return handled();
      }
    }

    if (e.key.toLowerCase() === 'q' && !mod) {
      onChange(quantizeNotes(notes, sel, snap || 0.25, lengthBeats));
      return handled();
    }

    // No selection: arrows move the cursor, Enter/Space toggles a note there.
    if (dx || dy) {
      setCursor((c) => ({
        beat: Math.max(0, Math.min(lengthBeats - stepBeats, c.beat + dx * stepBeats)),
        pitch: Math.max(lowestPitch, Math.min(highestPitch, c.pitch + dy * (e.shiftKey ? 12 : 1))),
      }));
      return handled();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      const here = notes.filter((n) => n.pitch === cursor.pitch && Math.abs(n.start - cursor.beat) < 1e-6);
      if (here.length) onChange(deleteNotes(notes, new Set(here.map((n) => n.id))));
      else {
        const note = { id: newId(), start: cursor.beat, length: Math.min(noteLength, lengthBeats - cursor.beat), pitch: cursor.pitch, velocity: 100 };
        onChange([...notes, note]);
        onPreview?.(note.pitch, note.velocity);
      }
      return handled();
    }
  };

  // Keep the keyboard cursor visible.
  useEffect(() => {
    if (!focused || sel.size) return;
    const el = scroller.current;
    if (!el) return;
    const y = (highestPitch - cursor.pitch) * rowHeight;
    const x = KEYS_W + cursor.beat * beatWidth;
    if (y < el.scrollTop) el.scrollTop = y;
    else if (y + rowHeight > el.scrollTop + el.clientHeight) el.scrollTop = y + rowHeight - el.clientHeight;
    if (x < el.scrollLeft + KEYS_W) el.scrollLeft = x - KEYS_W;
    else if (x + beatWidth > el.scrollLeft + el.clientWidth) el.scrollLeft = x + beatWidth - el.clientWidth;
  }, [cursor, focused, sel.size, highestPitch, rowHeight, beatWidth]);

  // ------------------------------------------------------------ velocity lane

  const velDrag = useRef(false);
  const paintVelocity = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const beat = (e.clientX - r.left) / beatWidth;
    const v = clampVelocity((1 - (e.clientY - r.top) / r.height) * 127);
    const pool = sel.size ? latest.current.notes.filter((n) => sel.has(n.id)) : latest.current.notes;
    const hit = notesStartingInCell(pool, beat, snap || 0.25);
    if (hit.length) latest.current.onChange(setVelocity(latest.current.notes, new Set(hit.map((n) => n.id)), v));
  };

  // ------------------------------------------------------------ render

  const selectedNotes = notes.filter((n) => sel.has(n.id));
  const status =
    selectedNotes.length === 1
      ? `${noteName(selectedNotes[0].pitch)} at ${beatLabel(selectedNotes[0].start, beatsPerBar)}, ${lengthLabel(selectedNotes[0].length)}, velocity ${selectedNotes[0].velocity}`
      : selectedNotes.length > 1
        ? `${selectedNotes.length} notes selected`
        : focused
          ? `Cursor ${noteName(cursor.pitch)} at ${beatLabel(cursor.beat, beatsPerBar)}`
          : '';

  const bar = beatWidth * beatsPerBar;
  const gridLines = [
    `repeating-linear-gradient(to right, var(--pc-line-strong) 0 1px, transparent 1px ${bar}px)`,
    `repeating-linear-gradient(to right, var(--pc-line) 0 1px, transparent 1px ${beatWidth}px)`,
    snap > 0 && snap < 1
      ? `repeating-linear-gradient(to right, color-mix(in srgb, var(--pc-line) 45%, transparent) 0 1px, transparent 1px ${snap * beatWidth}px)`
      : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="inline-flex flex-col w-fit max-w-full rounded-xl border border-line bg-surface-0 overflow-hidden" style={colorVar(trackColor(color))}>
      <div
        ref={scroller}
        className="relative overflow-x-auto overflow-y-scroll overscroll-contain"
        // overflow-y: scroll, not auto: the fitted width then includes the vertical
        // scrollbar, so a roll that fits never grows a pointless horizontal one.
        style={{ height, maxWidth: '100%' }}
        onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
      >
        <div className="relative flex" style={{ width: KEYS_W + width, height: rows * rowHeight }}>
          {/* Keyboard */}
          <div className="sticky left-0 z-20 shrink-0 bg-surface-1 border-r border-line" style={{ width: KEYS_W }} aria-hidden>
            {Array.from({ length: rows }, (_, r) => {
              const pitch = highestPitch - r;
              const black = isBlackKey(pitch);
              return (
                <div
                  key={pitch}
                  onPointerDown={() => onPreview?.(pitch, 100)}
                  className={`relative flex items-center justify-end pr-1 text-[9px] font-mono cursor-pointer text-[#55565a] hover:brightness-110 ${
                    pitch % 12 === 0 ? 'border-b border-[#55565a]' : pitch % 12 === 5 ? 'border-b border-[#b5b5b9]' : ''
                  }`}
                  style={{
                    height: rowHeight,
                    // Black keys sit over the white ones, 62% of the way across.
                    background: black ? 'linear-gradient(to right, #111112 62%, #d9d9dc 62%)' : '#d9d9dc',
                  }}
                >
                  {pitch % 12 === 0 && noteName(pitch)}
                </div>
              );
            })}
          </div>

          {/* Note grid */}
          <div
            ref={grid}
            role="application"
            aria-roledescription="piano roll"
            aria-label={`${label}. ${notes.length} notes.`}
            aria-describedby={helpId}
            tabIndex={0}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={removeAt}
            onContextMenu={(e) => {
              if (removeAt(e)) e.preventDefault();
            }}
            onKeyDown={onKeyDown}
            className="relative shrink-0 overflow-hidden outline-none touch-none cursor-crosshair"
            style={{ width, backgroundImage: gridLines }}
          >
            {/* Row shading: black-key rows are darker so pitches are easy to follow. */}
            {Array.from({ length: rows }, (_, r) => {
              const pitch = highestPitch - r;
              return (
                <div
                  key={pitch}
                  aria-hidden
                  className={`absolute left-0 right-0 pointer-events-none border-b ${pitch % 12 === 0 ? 'border-line-strong' : 'border-[color-mix(in_srgb,var(--pc-line)_60%,transparent)]'} ${
                    isBlackKey(pitch) ? 'bg-black/35' : ''
                  }`}
                  style={{ top: r * rowHeight, height: rowHeight }}
                />
              );
            })}

            {notes.map((n) => {
              const on = sel.has(n.id);
              const w = Math.max(3, n.length * beatWidth - 1);
              return (
                <div
                  key={n.id}
                  data-note={n.id}
                  aria-hidden
                  title={`${noteName(n.pitch)} · ${lengthLabel(n.length)} · vel ${n.velocity}`}
                  className={`group absolute rounded-[3px] border cursor-grab ${on ? 'border-white z-10' : 'border-black/40'}`}
                  style={{
                    left: n.start * beatWidth,
                    top: (highestPitch - n.pitch) * rowHeight + 1,
                    width: w,
                    height: rowHeight - 1,
                    // Louder notes are brighter.
                    background: `color-mix(in srgb, var(--c) ${45 + (n.velocity / 127) * 55}%, #0d0d0e)`,
                  }}
                >
                  {w > 30 && rowHeight >= 12 && (
                    <span className="absolute left-0.5 top-px px-0.5 rounded-[2px] bg-black/60 text-[9px] leading-[11px] font-semibold text-primary pointer-events-none">{noteName(n.pitch)}</span>
                  )}
                  <span className="absolute right-0 top-0 bottom-0 w-[5px] cursor-ew-resize rounded-r-[2px] group-hover:bg-white/30" />
                </div>
              );
            })}

            {/* Keyboard cursor */}
            {focused && sel.size === 0 && (
              <div
                aria-hidden
                className="absolute pointer-events-none rounded-[3px] ring-2 ring-accent"
                style={{ left: cursor.beat * beatWidth, top: (highestPitch - cursor.pitch) * rowHeight, width: (snap || 0.25) * beatWidth, height: rowHeight }}
              />
            )}

            {box && (
              <div
                aria-hidden
                className="absolute pointer-events-none border border-accent bg-[color-mix(in_srgb,var(--pc-accent)_15%,transparent)]"
                style={{
                  left: Math.min(box.t0, box.t1) * beatWidth,
                  width: Math.abs(box.t1 - box.t0) * beatWidth,
                  top: (highestPitch - Math.max(box.p0, box.p1)) * rowHeight,
                  height: (Math.abs(box.p1 - box.p0) + 1) * rowHeight,
                }}
              />
            )}

            {playhead !== undefined && playhead >= 0 && playhead <= lengthBeats && (
              <div aria-hidden className="absolute top-0 bottom-0 w-px bg-playhead pointer-events-none z-10" style={{ left: playhead * beatWidth }} />
            )}
          </div>
        </div>
      </div>

      {showVelocity && (
        <div className="flex border-t border-line bg-surface-0" style={{ height: VEL_H }}>
          <div className="shrink-0 flex items-end p-1 bg-surface-1 border-r border-line text-[9px] uppercase tracking-wider text-subtle" style={{ width: KEYS_W }}>
            Velocity
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div
              aria-hidden
              title="Drag to paint velocities"
              className="absolute top-0 bottom-0 cursor-ns-resize touch-none"
              style={{ left: -scrollLeft, width, backgroundImage: gridLines }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                velDrag.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                paintVelocity(e);
              }}
              onPointerMove={(e) => velDrag.current && paintVelocity(e)}
              onPointerUp={() => (velDrag.current = false)}
              onPointerCancel={() => (velDrag.current = false)}
            >
              {notes.map((n) => {
                const h = (n.velocity / 127) * (VEL_H - 6);
                const on = sel.has(n.id);
                return (
                  <div key={n.id} className="absolute bottom-0 pointer-events-none" style={{ left: n.start * beatWidth, height: h }}>
                    <div className={`absolute bottom-0 left-0 w-[2px] h-full ${on ? 'bg-white' : 'bg-[var(--c)]'}`} />
                    <div className={`absolute -top-[3px] -left-[2px] w-[6px] h-[6px] rounded-full ${on ? 'bg-white' : 'bg-[var(--c)]'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p id={helpId} className="sr-only">
        With no notes selected, arrow keys move a cursor and Enter adds or removes a note there. Click a note to select it, Shift-click to add
        more, Control or Command plus A selects all. With notes selected: arrows move them, Shift plus up or down moves an octave, Shift plus left
        or right changes length, Alt plus up or down changes velocity, Delete removes them, Control or Command plus D duplicates. Q quantizes.
        Escape clears the selection.
      </p>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
    </div>
  );
};

export default PianoRoll;
