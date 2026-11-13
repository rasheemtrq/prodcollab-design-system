'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import {
  Clip,
  CollabCursor,
  PresenceStack,
  StepSequencer,
  TrackHeader,
  Transport,
  demoPeaks,
  type ClipNote,
  type TrackColor,
  type TrackKind,
} from '@/app/design-system/components/daw';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

const BARS = 8;
const BEAT_PX = 22;
const LANE = 64;
const HEAD = 210;
const BEATS = BARS * 4;

const bass: ClipNote[] = [0, 0.75, 1.5, 2, 2.75, 3.5, 4, 4.75, 5.5, 6, 6.75, 7.5].map((start, i) => ({
  start,
  length: 0.6,
  pitch: [36, 36, 43, 41, 39, 34][i % 6],
}));
const chords: ClipNote[] = [0, 4].flatMap((start, i) =>
  (i ? [57, 60, 64, 67] : [55, 58, 62, 65]).map((pitch) => ({ start, length: 3.8, pitch })),
);

type Track = {
  id: string;
  name: string;
  kind: TrackKind;
  color: TrackColor;
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  seed: number;
  clips: { id: string; name: string; start: number; length: number; peaks?: number[]; notes?: ClipNote[]; editingBy?: { name: string; color: 1 | 2 } }[];
};

const START: Track[] = [
  {
    id: 'drums', name: 'Drums', kind: 'drums', color: 5, muted: false, soloed: false, armed: false, seed: 0,
    clips: [
      { id: 'd1', name: 'Pattern 1', start: 0, length: 16, peaks: demoPeaks(200, 5, 'pluck') },
      { id: 'd2', name: 'Pattern 2', start: 16, length: 16, peaks: demoPeaks(200, 6, 'pluck'), editingBy: { name: 'Kai', color: 1 } },
    ],
  },
  {
    id: 'bass', name: 'Reese Bass', kind: 'midi', color: 2, muted: false, soloed: false, armed: false, seed: 2,
    clips: [
      { id: 'b1', name: 'Bassline', start: 8, length: 8, notes: bass },
      { id: 'b2', name: 'Bassline', start: 16, length: 8, notes: bass },
      { id: 'b3', name: 'Bassline', start: 24, length: 8, notes: bass },
    ],
  },
  {
    id: 'chords', name: 'Chords', kind: 'midi', color: 1, muted: false, soloed: false, armed: false, seed: 5,
    clips: [
      { id: 'c1', name: 'Chords', start: 0, length: 8, notes: chords },
      { id: 'c2', name: 'Chords', start: 8, length: 8, notes: chords },
      { id: 'c3', name: 'Chords', start: 24, length: 8, notes: chords },
    ],
  },
  {
    id: 'vox', name: 'Lead Vox', kind: 'vocal', color: 3, muted: false, soloed: false, armed: true, seed: 4,
    clips: [
      { id: 'v1', name: 'Verse Take 3', start: 4, length: 12, peaks: demoPeaks(180, 3, 'vocal') },
      { id: 'v2', name: 'Hook Comp', start: 18, length: 12, peaks: demoPeaks(180, 8, 'vocal'), editingBy: { name: 'Maya', color: 2 } },
    ],
  },
  {
    id: 'fx', name: 'Riser FX', kind: 'audio', color: 8, muted: false, soloed: false, armed: false, seed: 7,
    clips: [{ id: 'f1', name: 'Riser', start: 12, length: 4, peaks: demoPeaks(60, 2).map((p, i) => p * (i / 60)) }],
  },
];

const p = (s: string) => s.split('').map((c) => c === 'x');

export default function ArrangementPattern() {
  const [tracks, setTracks] = useState(START);
  const [selectedTrack, setSelectedTrack] = useState('vox');
  const [selectedClip, setSelectedClip] = useState('v1');
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(true);
  const [bpm, setBpm] = useState(140);
  const [offset, setOffset] = useState(0);
  const [pattern, setPattern] = useState([
    { name: 'Kick', color: 4 as const, steps: p('x.........x.....') },
    { name: 'Snare', color: 6 as const, steps: p('....x.......x...') },
    { name: 'Hats', color: 8 as const, steps: p('x.x.x.x.x.x.x.xx') },
  ]);
  const { t, reset } = useDemoClock(playing);

  const raw = offset + (t * bpm) / 60;
  const pos = looping ? raw % BEATS : Math.min(raw, BEATS);
  const anySolo = tracks.some((x) => x.soloed);
  const flip = (id: string, k: 'muted' | 'soloed' | 'armed') => setTracks((ts) => ts.map((x) => (x.id === id ? { ...x, [k]: !x[k] } : x)));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    reset();
    setOffset(Math.max(0, Math.min(BEATS, Math.round(((e.clientX - r.left) / BEAT_PX) * 4) / 4)));
  };

  // Kai's cursor drifts around the clip they are editing; positions update ~12 Hz like network messages.
  const q = Math.floor(t * 12) / 12 + 1.3;
  const kai = { x: HEAD + 20 * BEAT_PX + Math.sin(q * 0.8) * 60, y: 24 + LANE * 0.5 + Math.cos(q * 1.3) * 18 };

  return (
    <div>
      <Header01 />
      <div className="flex flex-col gap-3 p-4 rounded-[2rem] bg-primary border border-secondary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Transport
            playing={playing}
            onPlayToggle={() => setPlaying((x) => !x)}
            onStop={() => {
              setPlaying(false);
              reset();
              setOffset(0);
            }}
            position={pos}
            bpm={bpm}
            onBpmChange={setBpm}
            looping={looping}
            onLoopToggle={() => setLooping((x) => !x)}
          />
          <PresenceStack
            people={[
              { name: 'Kai', color: 1, activity: 'Editing Pattern 2' },
              { name: 'Maya', color: 2, activity: 'Editing Hook Comp' },
              { name: 'Theo', color: 3, status: 'idle' },
            ]}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface-0">
          <div className="relative" style={{ width: HEAD + BEATS * BEAT_PX }}>
            {/* Ruler */}
            <div className="flex h-6 border-b border-line">
              <div className="shrink-0 sticky left-0 z-10 bg-surface-0" style={{ width: HEAD }} />
              <div className="relative flex-1 cursor-pointer" onClick={seek} role="presentation">
                {Array.from({ length: BARS }, (_, b) => (
                  <span
                    key={b}
                    className="absolute top-0 h-full border-l border-line-strong pl-1 text-[10px] font-mono text-subtle leading-6"
                    style={{ left: b * 4 * BEAT_PX }}
                  >
                    {b + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Tracks */}
            {tracks.map((tr) => {
              const audible = playing && !tr.muted && (!anySolo || tr.soloed);
              const inClip = tr.clips.some((c) => pos >= c.start && pos < c.start + c.length);
              return (
                <div key={tr.id} className="flex border-b border-line" style={{ height: LANE + 4 }}>
                  <div className="shrink-0 sticky left-0 z-10 bg-surface-0 p-0.5" style={{ width: HEAD }}>
                    <TrackHeader
                      name={tr.name}
                      kind={tr.kind}
                      color={tr.color}
                      muted={tr.muted}
                      soloed={tr.soloed}
                      armed={tr.armed}
                      onMute={() => flip(tr.id, 'muted')}
                      onSolo={() => flip(tr.id, 'soloed')}
                      onArm={() => flip(tr.id, 'armed')}
                      selected={selectedTrack === tr.id}
                      onSelect={() => setSelectedTrack(tr.id)}
                      level={audible && inClip ? demoLevel(t, bpm, tr.seed, -14) : -Infinity}
                      height={LANE}
                      width={HEAD - 4}
                    />
                  </div>
                  <div
                    className={`relative flex-1 ${selectedTrack === tr.id ? 'bg-[#101011]' : ''}`}
                    style={{
                      backgroundImage: `repeating-linear-gradient(to right, var(--pc-line) 0 1px, transparent 1px ${BEAT_PX}px), repeating-linear-gradient(to right, var(--pc-line-strong) 0 1px, transparent 1px ${BEAT_PX * 4}px)`,
                    }}
                  >
                    {tr.clips.map((c) => (
                      <Clip
                        key={c.id}
                        name={c.name}
                        color={tr.color}
                        kind={c.notes ? 'midi' : 'audio'}
                        peaks={c.peaks}
                        notes={c.notes}
                        lengthBeats={c.length}
                        muted={tr.muted}
                        selected={selectedClip === c.id}
                        editingBy={c.editingBy}
                        onClick={() => {
                          setSelectedClip(c.id);
                          setSelectedTrack(tr.id);
                        }}
                        style={{ position: 'absolute', top: 2, bottom: 2, height: 'auto', left: c.start * BEAT_PX, width: c.length * BEAT_PX - 1 }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Playhead */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 w-px bg-playhead z-20 pointer-events-none"
              style={{ left: HEAD + pos * BEAT_PX }}
            >
              <div className="absolute -left-[5px] top-0 w-0 h-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-white" />
            </div>

            <CollabCursor name="Kai" color={1} {...kai} />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <StepSequencer
            label="Drums: Pattern 2"
            rows={pattern}
            onToggle={(r, s) => setPattern((rs) => rs.map((row, i) => (i === r ? { ...row, steps: row.steps.map((on, j) => (j === s ? !on : on)) } : row)))}
            currentStep={playing ? Math.floor((pos % 4) * 4) : undefined}
          />
          <p className="text-xs text-secondary font-light max-w-[16rem] leading-5">
            Click the ruler to move the playhead. Kai&rsquo;s cursor and the clip outlines show where collaborators are working.
          </p>
        </div>
      </div>
      <p className="text-sm text-secondary font-light mt-4 max-w-[44rem]">
        Built from <code>Transport</code>, <code>TrackHeader</code>, <code>Clip</code>, <code>StepSequencer</code>,{' '}
        <code>PresenceStack</code> and <code>CollabCursor</code>. The grid uses 22 px per beat, and the playhead position is in beats,
        the same unit the DAW uses.
      </p>
    </div>
  );
}
