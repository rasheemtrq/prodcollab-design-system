// Unit tests for the pure editing helpers. Run with `npm test`
// (Node strips the TypeScript types itself; no build step).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beatLabel,
  curve,
  deleteNotes,
  duplicateNotes,
  insertPoint,
  isBlackKey,
  lengthLabel,
  movePoint,
  moveNotes,
  noteName,
  notesInBox,
  notesStartingInCell,
  nudgeVelocity,
  quantizeNotes,
  removePoint,
  resizeNotes,
  setVelocity,
  snapDown,
  snapNearest,
  valueAt,
  type AutomationPoint,
  type RollNote,
} from '../src/app/design-system/components/daw/editing.ts';

const n = (id: string, start: number, length: number, pitch: number, velocity = 100): RollNote => ({ id, start, length, pitch, velocity });
const bounds = { lengthBeats: 4, lowestPitch: 36, highestPitch: 84 };
const ids = (...xs: string[]) => new Set(xs);

test('noteName uses scientific pitch (60 = C4)', () => {
  assert.equal(noteName(60), 'C4');
  assert.equal(noteName(61), 'C♯4');
  assert.equal(noteName(21), 'A0');
  assert.equal(noteName(0), 'C-1');
  assert.equal(noteName(127), 'G9');
});

test('isBlackKey', () => {
  assert.deepEqual([60, 61, 62, 63, 64, 65, 66].map(isBlackKey), [false, true, false, true, false, false, true]);
});

test('snapDown and snapNearest, including float noise', () => {
  assert.equal(snapDown(1.37, 0.25), 1.25);
  assert.equal(snapDown(0.75, 0.25), 0.75); // exact grid line stays put
  assert.equal(snapDown(0.3 * 3, 0.3), 0.9); // 0.8999999999999999 must not fall to 0.6
  assert.equal(snapNearest(1.37, 0.25), 1.25);
  assert.equal(snapNearest(1.38, 0.25), 1.5);
  assert.equal(snapNearest(1.37, 0), 1.37);
});

test('beatLabel is bar.beat.sixteenth, 1-based', () => {
  assert.equal(beatLabel(0), '1.1.1');
  assert.equal(beatLabel(1.5), '1.2.3');
  assert.equal(beatLabel(4), '2.1.1');
  assert.equal(beatLabel(3, 3), '2.1.1');
});

test('lengthLabel', () => {
  assert.equal(lengthLabel(1), '1/4');
  assert.equal(lengthLabel(0.5), '1/8');
  assert.equal(lengthLabel(0.75), '3/16');
  assert.equal(lengthLabel(2), '1/2');
  assert.equal(lengthLabel(4), '1 bar');
  assert.equal(lengthLabel(8), '2 bars');
});

test('moveNotes moves the selection only', () => {
  const notes = [n('a', 0, 1, 60), n('b', 1, 1, 62)];
  const out = moveNotes(notes, ids('a'), 0.5, 2, bounds);
  assert.deepEqual(out[0], n('a', 0.5, 1, 62));
  assert.equal(out[1], notes[1]); // untouched notes keep identity
});

test('moveNotes clamps the group as a whole at the clip edges', () => {
  const notes = [n('a', 0.5, 1, 60), n('b', 2, 1, 64)];
  // Left: the earliest note can only go back 0.5 beats, so both move -0.5.
  const left = moveNotes(notes, ids('a', 'b'), -3, 0, bounds);
  assert.deepEqual(left.map((x) => x.start), [0, 1.5]);
  // Right: the latest end is 3, so the group can only move +1.
  const right = moveNotes(notes, ids('a', 'b'), 5, 0, bounds);
  assert.deepEqual(right.map((x) => x.start), [1.5, 3]);
});

test('moveNotes clamps pitch to the range and keeps intervals', () => {
  const notes = [n('a', 0, 1, 80), n('b', 0, 1, 76)];
  const out = moveNotes(notes, ids('a', 'b'), 0, 12, bounds);
  assert.deepEqual(out.map((x) => x.pitch), [84, 80]);
});

test('moveNotes never pushes an overhanging note backwards', () => {
  const notes = [n('a', 3, 2, 60)]; // already ends at 5 in a 4-beat clip
  assert.equal(moveNotes(notes, ids('a'), 1, 0, bounds), notes);
  assert.equal(moveNotes(notes, ids('a'), -1, 0, bounds)[0].start, 2);
});

test('resizeNotes respects the minimum length and the clip end', () => {
  const notes = [n('a', 0, 1, 60), n('b', 3, 0.5, 60)];
  const longer = resizeNotes(notes, ids('a', 'b'), 2, 0.25, 4);
  assert.deepEqual(longer.map((x) => x.length), [3, 1]);
  const shorter = resizeNotes(notes, ids('a', 'b'), -5, 0.25, 4);
  assert.deepEqual(shorter.map((x) => x.length), [0.25, 0.25]);
});

test('velocity helpers clamp to 1..127', () => {
  const notes = [n('a', 0, 1, 60, 120), n('b', 1, 1, 60, 5)];
  assert.deepEqual(nudgeVelocity(notes, ids('a', 'b'), 20).map((x) => x.velocity), [127, 25]);
  assert.deepEqual(nudgeVelocity(notes, ids('a', 'b'), -20).map((x) => x.velocity), [100, 1]);
  assert.deepEqual(setVelocity(notes, ids('b'), 300).map((x) => x.velocity), [120, 127]);
});

test('deleteNotes', () => {
  assert.deepEqual(deleteNotes([n('a', 0, 1, 60), n('b', 1, 1, 60)], ids('a')).map((x) => x.id), ['b']);
});

test('quantizeNotes snaps selected starts, or all when nothing is selected', () => {
  const notes = [n('a', 0.12, 0.5, 60), n('b', 1.4, 0.5, 60)];
  assert.deepEqual(quantizeNotes(notes, ids('a'), 0.25, 4).map((x) => x.start), [0, 1.4]);
  assert.deepEqual(quantizeNotes(notes, ids(), 0.5, 4).map((x) => x.start), [0, 1.5]);
  // A note is never quantized past the clip end.
  assert.equal(quantizeNotes([n('c', 3.9, 0.5, 60)], ids(), 1, 4)[0].start, 3.5);
});

test('duplicateNotes places copies after the selection and drops ones past the end', () => {
  let i = 0;
  const makeId = () => `c${i++}`;
  const notes = [n('a', 0, 0.5, 60), n('b', 0.5, 0.75, 62)];
  const { notes: out, added } = duplicateNotes(notes, ids('a', 'b'), 0.25, 4, makeId);
  assert.deepEqual(added, ['c0', 'c1']);
  // Span is 1.25 beats, already on the 0.25 grid.
  assert.deepEqual(out.slice(2).map((x) => x.start), [1.25, 1.75]);
  const late = duplicateNotes([n('z', 3, 1, 60)], ids('z'), 0.25, 4, makeId);
  assert.deepEqual(late.added, []);
});

test('notesInBox finds overlaps in either drag direction', () => {
  const notes = [n('a', 0, 1, 60), n('b', 2, 1, 64), n('c', 3, 1, 72)];
  assert.deepEqual(notesInBox(notes, 0.5, 2.5, 59, 65), ['a', 'b']);
  assert.deepEqual(notesInBox(notes, 2.5, 0.5, 65, 59), ['a', 'b']);
  assert.deepEqual(notesInBox(notes, 1, 2, 60, 64), []); // touching edges do not count
});

test('notesStartingInCell', () => {
  const notes = [n('a', 0, 1, 60), n('b', 0.2, 1, 62), n('c', 0.25, 1, 64)];
  assert.deepEqual(notesStartingInCell(notes, 0.1, 0.25).map((x) => x.id), ['a', 'b']);
  assert.deepEqual(notesStartingInCell(notes, 0.3, 0.25).map((x) => x.id), ['c']);
});

const p = (id: string, t: number, v: number): AutomationPoint => ({ id, t, v });

test('valueAt is flat outside the points and linear between them', () => {
  const pts = [p('b', 4, 1), p('a', 2, 0)]; // unsorted on purpose
  assert.equal(valueAt(pts, 0), 0);
  assert.equal(valueAt(pts, 2), 0);
  assert.equal(valueAt(pts, 3), 0.5);
  assert.equal(valueAt(pts, 4), 1);
  assert.equal(valueAt(pts, 9), 1);
  assert.equal(valueAt([], 3, 0.7), 0.7);
});

test('valueAt takes the later value at a vertical step', () => {
  const pts = [p('a', 0, 0), p('b', 2, 0.2), p('c', 2, 0.8), p('d', 4, 0.8)];
  assert.equal(valueAt(pts, 2), 0.2);
  assert.equal(valueAt(pts, 2.0001) > 0.79, true);
});

test('curve extends flat to both ends', () => {
  assert.deepEqual(curve([p('a', 1, 0.25), p('b', 3, 0.75)], 8), [[0, 0.25], [1, 0.25], [3, 0.75], [8, 0.75]]);
  assert.deepEqual(curve([], 8, 0.5), [[0, 0.5], [8, 0.5]]);
});

test('insertPoint keeps order and clamps', () => {
  const out = insertPoint([p('a', 0, 0), p('c', 4, 1)], p('b', 2, 1.5), 8);
  assert.deepEqual(out.map((x) => x.id), ['a', 'b', 'c']);
  assert.equal(out[1].v, 1);
  assert.equal(insertPoint([], p('z', 99, -1), 8)[0].t, 8);
});

test('movePoint cannot pass its neighbours', () => {
  const pts = [p('a', 0, 0), p('b', 2, 0.5), p('c', 4, 1)];
  const right = movePoint(pts, 'b', 10, 0.3, 8);
  assert.deepEqual(right.map((x) => x.t), [0, 4, 4]);
  const left = movePoint(pts, 'b', -3, 2, 8);
  assert.deepEqual(left[1], p('b', 0, 1));
  const last = movePoint(pts, 'c', 99, 0, 8);
  assert.equal(last[2].t, 8);
  assert.equal(movePoint(pts, 'missing', 1, 1, 8), pts);
});

test('removePoint', () => {
  assert.deepEqual(removePoint([p('a', 0, 0), p('b', 1, 1)], 'a').map((x) => x.id), ['b']);
});
