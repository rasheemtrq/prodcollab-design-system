// Pure editing helpers behind PianoRoll and AutomationLane.
//
// No React and no DOM, so they run under `node --test` (see tests/) and the
// DAW can reuse the same rules. Positions are in beats (quarter notes), the
// unit every DAW component in this system uses.

export type RollNote = {
  id: string;
  /** Start in beats from the clip start. */
  start: number;
  /** Length in beats. */
  length: number;
  /** MIDI note number, 60 = C4. */
  pitch: number;
  /** MIDI velocity, 1..127. */
  velocity: number;
};

export type AutomationPoint = {
  id: string;
  /** Time in beats. */
  t: number;
  /** Normalized value, 0..1. */
  v: number;
};

export type RollBounds = {
  lengthBeats: number;
  lowestPitch: number;
  highestPitch: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Rounds away float noise such as 0.30000000000000004. */
export const tidy = (n: number) => Math.round(n * 1e6) / 1e6;

// ---------------------------------------------------------------- pitch

const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const pc = (pitch: number) => ((pitch % 12) + 12) % 12;

/** 60 → "C4", 61 → "C♯4" (scientific pitch, so MIDI 60 is middle C). */
export const noteName = (pitch: number) => `${NAMES[pc(pitch)]}${Math.floor(pitch / 12) - 1}`;
export const isBlackKey = (pitch: number) => [1, 3, 6, 8, 10].includes(pc(pitch));

// ---------------------------------------------------------------- time

/** Snaps down to the grid cell containing `beat`. `snap` 0 means no grid. */
export const snapDown = (beat: number, snap: number) => (snap > 0 ? tidy(Math.floor(beat / snap + 1e-9) * snap) : beat);
/** Snaps to the nearest grid line. */
export const snapNearest = (beat: number, snap: number) => (snap > 0 ? tidy(Math.round(beat / snap) * snap) : beat);

/** Beats → "1.2.3" (bar.beat.sixteenth, all 1-based). */
export const beatLabel = (beats: number, beatsPerBar = 4) => {
  const b = Math.max(0, beats) + 1e-9;
  return `${Math.floor(b / beatsPerBar) + 1}.${Math.floor(b % beatsPerBar) + 1}.${Math.floor((b % 1) * 4) + 1}`;
};

/** Note length in beats → "1/4", "1/8", "3/16", "2 bars"... */
export const lengthLabel = (beats: number, beatsPerBar = 4) => {
  if (beats >= beatsPerBar && beats % beatsPerBar === 0) {
    const bars = beats / beatsPerBar;
    return `${bars} bar${bars === 1 ? '' : 's'}`;
  }
  // Express as n/d of a whole note (4 beats), with the smallest power-of-two d.
  for (const d of [1, 2, 4, 8, 16, 32, 64]) {
    const n = (beats / 4) * d;
    if (Math.abs(n - Math.round(n)) < 1e-6) return `${Math.round(n)}/${d}`;
  }
  return `${tidy(beats)} beats`;
};

// ---------------------------------------------------------------- notes

const span = (notes: RollNote[]) => ({
  minStart: Math.min(...notes.map((n) => n.start)),
  maxEnd: Math.max(...notes.map((n) => n.start + n.length)),
  minPitch: Math.min(...notes.map((n) => n.pitch)),
  maxPitch: Math.max(...notes.map((n) => n.pitch)),
});

/**
 * Moves the notes in `ids` by `dt` beats and `dp` semitones as one group.
 * The offsets are clamped so no moved note leaves the clip or the pitch range;
 * the group keeps its shape instead of squashing against an edge.
 */
export function moveNotes(notes: RollNote[], ids: ReadonlySet<string>, dt: number, dp: number, b: RollBounds): RollNote[] {
  const moving = notes.filter((n) => ids.has(n.id));
  if (moving.length === 0) return notes;
  const s = span(moving);
  // min/max with 0 so a note that already overhangs never gets pushed backwards.
  const t = clamp(dt, Math.min(0, -s.minStart), Math.max(0, b.lengthBeats - s.maxEnd));
  const p = clamp(dp, Math.min(0, b.lowestPitch - s.minPitch), Math.max(0, b.highestPitch - s.maxPitch));
  if (t === 0 && p === 0) return notes;
  return notes.map((n) => (ids.has(n.id) ? { ...n, start: tidy(n.start + t), pitch: n.pitch + p } : n));
}

/** Changes the length of each note in `ids` by `dl` beats, keeping it at least `minLength` and inside the clip. */
export function resizeNotes(notes: RollNote[], ids: ReadonlySet<string>, dl: number, minLength: number, lengthBeats: number): RollNote[] {
  return notes.map((n) => {
    if (!ids.has(n.id)) return n;
    const room = Math.max(minLength, lengthBeats - n.start);
    return { ...n, length: tidy(clamp(n.length + dl, minLength, room)) };
  });
}

export const clampVelocity = (v: number) => clamp(Math.round(v), 1, 127);

export function setVelocity(notes: RollNote[], ids: ReadonlySet<string>, velocity: number): RollNote[] {
  const v = clampVelocity(velocity);
  return notes.map((n) => (ids.has(n.id) && n.velocity !== v ? { ...n, velocity: v } : n));
}

export function nudgeVelocity(notes: RollNote[], ids: ReadonlySet<string>, by: number): RollNote[] {
  return notes.map((n) => (ids.has(n.id) ? { ...n, velocity: clampVelocity(n.velocity + by) } : n));
}

export const deleteNotes = (notes: RollNote[], ids: ReadonlySet<string>) => notes.filter((n) => !ids.has(n.id));

/** Moves note starts in `ids` (or every note if `ids` is empty) to the nearest grid line. */
export function quantizeNotes(notes: RollNote[], ids: ReadonlySet<string>, grid: number, lengthBeats: number): RollNote[] {
  const all = ids.size === 0;
  return notes.map((n) => {
    if (!all && !ids.has(n.id)) return n;
    const start = clamp(snapNearest(n.start, grid), 0, Math.max(0, lengthBeats - n.length));
    return start === n.start ? n : { ...n, start };
  });
}

/**
 * Copies the notes in `ids` to just after the selection (offset = its span,
 * rounded up to the grid). Copies that would end past the clip are dropped.
 * Returns the new list and the ids of the copies, so they can be selected.
 */
export function duplicateNotes(
  notes: RollNote[],
  ids: ReadonlySet<string>,
  grid: number,
  lengthBeats: number,
  makeId: () => string,
): { notes: RollNote[]; added: string[] } {
  const chosen = notes.filter((n) => ids.has(n.id));
  if (chosen.length === 0) return { notes, added: [] };
  const s = span(chosen);
  const width = s.maxEnd - s.minStart;
  const offset = grid > 0 ? Math.ceil(width / grid - 1e-9) * grid : width;
  const copies = chosen
    .map((n) => ({ ...n, id: makeId(), start: tidy(n.start + offset) }))
    .filter((n) => n.start + n.length <= lengthBeats + 1e-9);
  return { notes: [...notes, ...copies], added: copies.map((n) => n.id) };
}

/** Ids of notes overlapping a box from beat t0..t1 and pitch p0..p1 (inclusive, any order). */
export function notesInBox(notes: RollNote[], t0: number, t1: number, p0: number, p1: number): string[] {
  const [ta, tb] = t0 < t1 ? [t0, t1] : [t1, t0];
  const [pa, pb] = p0 < p1 ? [p0, p1] : [p1, p0];
  return notes.filter((n) => n.start < tb && n.start + n.length > ta && n.pitch >= pa && n.pitch <= pb).map((n) => n.id);
}

/** Notes whose start falls in the grid cell that contains `beat`. Used to paint velocities. */
export function notesStartingInCell(notes: RollNote[], beat: number, grid: number): RollNote[] {
  const cell = snapDown(beat, grid);
  const end = grid > 0 ? cell + grid : cell;
  return notes.filter((n) => n.start >= cell - 1e-9 && n.start < end - 1e-9);
}

// ---------------------------------------------------------------- automation

export const sortPoints = (points: AutomationPoint[]) => [...points].sort((a, b) => a.t - b.t);

/**
 * The automated value at time `t`: flat before the first point and after the
 * last, straight lines in between (the DAW's rule). `fallback` is used when
 * there are no points.
 */
export function valueAt(points: AutomationPoint[], t: number, fallback = 0): number {
  if (points.length === 0) return fallback;
  const s = sortPoints(points);
  if (t <= s[0].t) return s[0].v;
  const last = s[s.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i];
    const b = s[i + 1];
    if (t <= b.t) return b.t === a.t ? b.v : a.v + ((t - a.t) / (b.t - a.t)) * (b.v - a.v);
  }
  return last.v;
}

/** The polyline to draw from 0 to `lengthBeats`, as [t, v] pairs. */
export function curve(points: AutomationPoint[], lengthBeats: number, fallback = 0): [number, number][] {
  if (points.length === 0) return [[0, fallback], [lengthBeats, fallback]];
  const s = sortPoints(points);
  return [[0, s[0].v], ...s.map((p) => [p.t, p.v] as [number, number]), [lengthBeats, s[s.length - 1].v]];
}

/** Adds a point, keeping the list sorted by time. Values are clamped to 0..1 and the time to the lane. */
export function insertPoint(points: AutomationPoint[], point: AutomationPoint, lengthBeats: number): AutomationPoint[] {
  return sortPoints([...points, { ...point, t: tidy(clamp(point.t, 0, lengthBeats)), v: clamp(point.v, 0, 1) }]);
}

/**
 * Moves one point. Its time is kept between its neighbours, so dragging can
 * never reorder points or make the curve run backwards in time.
 */
export function movePoint(points: AutomationPoint[], id: string, t: number, v: number, lengthBeats: number): AutomationPoint[] {
  const s = sortPoints(points);
  const i = s.findIndex((p) => p.id === id);
  if (i < 0) return points;
  const lo = i > 0 ? s[i - 1].t : 0;
  const hi = i < s.length - 1 ? s[i + 1].t : lengthBeats;
  s[i] = { ...s[i], t: tidy(clamp(t, lo, hi)), v: clamp(v, 0, 1) };
  return s;
}

export const removePoint = (points: AutomationPoint[], id: string) => points.filter((p) => p.id !== id);
