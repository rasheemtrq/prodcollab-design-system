'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faCopy, faPen, faTrash, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import Header01 from '@/app/page-components/body/Header01';
import Menu, { ContextMenu, type MenuItem } from '@/app/design-system/components/Menu';
import Modal from '@/app/design-system/components/Modal';
import Button from '@/app/design-system/components/Button';
import InputField from '@/app/design-system/components/InputField';
import {
  AutomationLane,
  Clip,
  CollabCursor,
  PianoRoll,
  PresenceStack,
  StepSequencer,
  TrackHeader,
  Transport,
  colorMenuItems,
  dbToPosition,
  demoPeaks,
  formatDb,
  positionToDb,
  trackColor,
  valueAt,
  type AutomationPoint,
  type RollNote,
  type TrackKind,
  type TrackSwatch,
} from '@/app/design-system/components/daw';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

const BARS = 8;
const BEAT_PX = 22;
const LANE = 64;
const AUTO_H = 56;
const HEAD = 210;
const BEATS = BARS * 4;

const riff = (prefix: string): RollNote[] =>
  [0, 0.75, 1.5, 2, 2.75, 3.5, 4, 4.75, 5.5, 6, 6.75, 7.5].map((start, i) => ({
    id: `${prefix}${i}`,
    start,
    length: 0.5,
    pitch: [36, 36, 43, 41, 39, 34][i % 6],
    velocity: i % 2 ? 88 : 112,
  }));
const pad = (prefix: string): RollNote[] =>
  [0, 4].flatMap((start, i) =>
    (i ? [57, 60, 64, 67] : [55, 58, 62, 65]).map((pitch, j) => ({ id: `${prefix}${i}${j}`, start, length: 3.8, pitch, velocity: 90 - j * 5 })),
  );

type ClipData = {
  id: string;
  name: string;
  start: number;
  length: number;
  peaks?: number[];
  notes?: RollNote[];
  editingBy?: { name: string; color: 1 | 2 };
};
type Track = {
  id: string;
  name: string;
  kind: TrackKind;
  color: TrackSwatch;
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  seed: number;
  clips: ClipData[];
  automation?: AutomationPoint[];
  showAuto?: boolean;
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
      { id: 'b1', name: 'Bassline', start: 8, length: 8, notes: riff('b1') },
      { id: 'b2', name: 'Bassline', start: 16, length: 8, notes: riff('b2') },
      { id: 'b3', name: 'Bassline', start: 24, length: 8, notes: riff('b3') },
    ],
  },
  {
    id: 'chords', name: 'Chords', kind: 'midi', color: 1, muted: false, soloed: false, armed: false, seed: 5,
    clips: [
      { id: 'c1', name: 'Chords', start: 0, length: 8, notes: pad('c1') },
      { id: 'c2', name: 'Chords', start: 8, length: 8, notes: pad('c2') },
      { id: 'c3', name: 'Chords', start: 24, length: 8, notes: pad('c3') },
    ],
  },
  {
    id: 'vox', name: 'Lead Vox', kind: 'vocal', color: 3, muted: false, soloed: false, armed: true, seed: 4, showAuto: true,
    clips: [
      { id: 'v1', name: 'Verse Take 3', start: 4, length: 12, peaks: demoPeaks(180, 3, 'vocal') },
      { id: 'v2', name: 'Hook Comp', start: 18, length: 12, peaks: demoPeaks(180, 8, 'vocal'), editingBy: { name: 'Maya', color: 2 } },
    ],
    // Ride the vocal: dip under the drop, push the hook.
    automation: [
      { id: 'a1', t: 4, v: dbToPosition(-6) },
      { id: 'a2', t: 15, v: dbToPosition(-4) },
      { id: 'a3', t: 16, v: dbToPosition(-14) },
      { id: 'a4', t: 18, v: dbToPosition(-2) },
      { id: 'a5', t: 30, v: dbToPosition(0) },
    ],
  },
  {
    id: 'fx', name: 'Riser FX', kind: 'audio', color: 8, muted: false, soloed: false, armed: false, seed: 7,
    clips: [{ id: 'f1', name: 'Riser', start: 12, length: 4, peaks: demoPeaks(60, 2).map((p, i) => p * (i / 60)) }],
  },
];

const steps = (s: string) => s.split('').map((c) => c === 'x');
let copies = 0;

export default function ArrangementPattern() {
  const [tracks, setTracks] = useState(START);
  const [selectedTrack, setSelectedTrack] = useState('bass');
  const [selectedClip, setSelectedClip] = useState('b2');
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(true);
  const [bpm, setBpm] = useState(140);
  const [offset, setOffset] = useState(0);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [pattern, setPattern] = useState([
    { name: 'Kick', color: 4 as const, steps: steps('x.........x.....') },
    { name: 'Snare', color: 6 as const, steps: steps('....x.......x...') },
    { name: 'Hats', color: 8 as const, steps: steps('x.x.x.x.x.x.x.xx') },
  ]);
  const { t, reset } = useDemoClock(playing);

  const raw = offset + (t * bpm) / 60;
  const pos = looping ? raw % BEATS : Math.min(raw, BEATS);
  const anySolo = tracks.some((x) => x.soloed);

  const patch = (id: string, p: Partial<Track>) => setTracks((ts) => ts.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const flip = (id: string, k: 'muted' | 'soloed' | 'armed' | 'showAuto') => setTracks((ts) => ts.map((x) => (x.id === id ? { ...x, [k]: !x[k] } : x)));
  const move = (id: string, by: -1 | 1) =>
    setTracks((ts) => {
      const i = ts.findIndex((x) => x.id === id);
      const j = i + by;
      if (j < 0 || j >= ts.length) return ts;
      const next = [...ts];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const duplicate = (id: string) =>
    setTracks((ts) => {
      const i = ts.findIndex((x) => x.id === id);
      const src = ts[i];
      const n = ++copies;
      const copy: Track = {
        ...src,
        id: `${src.id}-copy${n}`,
        name: `${src.name} copy`,
        clips: src.clips.map((c) => ({ ...c, id: `${c.id}-copy${n}`, editingBy: undefined, notes: c.notes?.map((x) => ({ ...x, id: `${x.id}-copy${n}` })) })),
      };
      return [...ts.slice(0, i + 1), copy, ...ts.slice(i + 1)];
    });
  const remove = (id: string) => setTracks((ts) => ts.filter((x) => x.id !== id));

  const trackMenu = (tr: Track, index: number): MenuItem[] => [
    { label: 'Rename…', icon: <FontAwesomeIcon icon={faPen} />, onSelect: () => setRenaming({ id: tr.id, name: tr.name }) },
    { label: 'Duplicate', icon: <FontAwesomeIcon icon={faCopy} />, onSelect: () => duplicate(tr.id) },
    {
      type: 'submenu',
      label: 'Color',
      icon: <span className="block w-3 h-3 rounded-full" style={{ background: trackColor(tr.color) }} />,
      items: colorMenuItems(tr.color, (color) => patch(tr.id, { color })),
    },
    { label: 'Move up', icon: <FontAwesomeIcon icon={faArrowUp} />, disabled: index === 0, onSelect: () => move(tr.id, -1) },
    { label: 'Move down', icon: <FontAwesomeIcon icon={faArrowDown} />, disabled: index === tracks.length - 1, onSelect: () => move(tr.id, 1) },
    { type: 'separator' },
    {
      label: 'Show volume automation',
      icon: <FontAwesomeIcon icon={faWaveSquare} />,
      checked: !!tr.showAuto,
      onSelect: () => {
        if (!tr.automation) patch(tr.id, { automation: [] });
        flip(tr.id, 'showAuto');
      },
    },
    { type: 'separator' },
    { label: 'Delete track', icon: <FontAwesomeIcon icon={faTrash} />, danger: true, disabled: tracks.length === 1, onSelect: () => remove(tr.id) },
  ];

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    reset();
    setOffset(Math.max(0, Math.min(BEATS, Math.round(((e.clientX - r.left) / BEAT_PX) * 4) / 4)));
  };

  // The editor panel follows the selected clip.
  const owner = tracks.find((x) => x.clips.some((c) => c.id === selectedClip));
  const clip = owner?.clips.find((c) => c.id === selectedClip);
  const setClipNotes = (notes: RollNote[]) =>
    setTracks((ts) => ts.map((x) => (x.id !== owner?.id ? x : { ...x, clips: x.clips.map((c) => (c.id === selectedClip ? { ...c, notes } : c)) })));
  const clipPlayhead = clip && pos >= clip.start && pos < clip.start + clip.length ? pos - clip.start : undefined;

  // Kai's cursor drifts around the clip they are editing; positions update ~12 Hz like network messages.
  const drumsRow = tracks.findIndex((x) => x.id === 'drums');
  const rowTop = (i: number) => 24 + tracks.slice(0, i).reduce((h, x) => h + LANE + 4 + (x.showAuto ? AUTO_H + 1 : 0), 0);
  const q = Math.floor(t * 12) / 12 + 1.3;
  const kai = drumsRow >= 0 ? { x: HEAD + 20 * BEAT_PX + Math.sin(q * 0.8) * 60, y: rowTop(drumsRow) + LANE * 0.5 + Math.cos(q * 1.3) * 18 } : null;

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
            {tracks.map((tr, index) => {
              const audible = playing && !tr.muted && (!anySolo || tr.soloed);
              const inClip = tr.clips.some((c) => pos >= c.start && pos < c.start + c.length);
              const autoDb = tr.automation?.length ? positionToDb(valueAt(tr.automation, pos, dbToPosition(0))) : 0;
              const items = () => trackMenu(tr, index);
              return (
                <div key={tr.id} className="border-b border-line">
                  <div className="flex" style={{ height: LANE + 4 }}>
                    <div className="shrink-0 sticky left-0 z-10 bg-surface-0 p-0.5" style={{ width: HEAD }}>
                      <ContextMenu label={`${tr.name} options`} items={items}>
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
                          level={audible && inClip ? demoLevel(t, bpm, tr.seed, -14) + autoDb : -Infinity}
                          height={LANE}
                          width={HEAD - 4}
                          menu={
                            <Menu
                              label={`${tr.name} options`}
                              items={trackMenu(tr, index)}
                              triggerClassName="w-6 h-5 grid place-items-center rounded-[4px] text-secondary text-xs hover:bg-surface-3 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            />
                          }
                        />
                      </ContextMenu>
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
                  {tr.showAuto && (
                    <div className="flex border-t border-line" style={{ height: AUTO_H }}>
                      <div className="shrink-0 sticky left-0 z-10 bg-surface-0 flex flex-col justify-center gap-0.5 pl-4 pr-2 text-[10px]" style={{ width: HEAD }}>
                        <span className="text-secondary uppercase tracking-wider">{tr.name} · Volume</span>
                        <span className="font-mono text-primary tabular-nums">{formatDb(autoDb)}</span>
                      </div>
                      <AutomationLane
                        label={`${tr.name} volume`}
                        points={tr.automation ?? []}
                        onChange={(automation) => patch(tr.id, { automation })}
                        lengthBeats={BEATS}
                        beatWidth={BEAT_PX}
                        height={AUTO_H}
                        color={tr.color}
                        defaultValue={dbToPosition(0)}
                        formatValue={(v) => formatDb(positionToDb(v))}
                        playhead={pos}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Playhead */}
            <div aria-hidden className="absolute top-0 bottom-0 w-px bg-playhead z-20 pointer-events-none" style={{ left: HEAD + pos * BEAT_PX }}>
              <div className="absolute -left-[5px] top-0 w-0 h-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-white" />
            </div>

            {kai && <CollabCursor name="Kai" color={1} {...kai} />}
          </div>
        </div>

        {/* Editor panel for the selected clip */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            {owner && <span className="w-2.5 h-2.5 rounded-full" style={{ background: trackColor(owner.color) }} />}
            <span className="font-semibold">{clip ? clip.name : 'No clip selected'}</span>
            {owner && <span className="text-secondary">· {owner.name}</span>}
          </div>
          {clip?.notes && owner ? (
            <PianoRoll
              key={clip.id}
              notes={clip.notes}
              onChange={setClipNotes}
              lengthBeats={clip.length}
              snap={0.25}
              beatWidth={44}
              height={220}
              color={owner.color}
              playhead={clipPlayhead}
              lowestPitch={28}
              highestPitch={79}
            />
          ) : owner?.kind === 'drums' ? (
            <div className="flex flex-wrap items-start gap-4">
              <StepSequencer
                label={`${owner.name}: ${clip?.name ?? ''}`}
                rows={pattern}
                onToggle={(r, s) => setPattern((rs) => rs.map((row, i) => (i === r ? { ...row, steps: row.steps.map((on, j) => (j === s ? !on : on)) } : row)))}
                currentStep={playing ? Math.floor((pos % 4) * 4) : undefined}
              />
            </div>
          ) : (
            <p className="text-xs text-secondary font-light">
              {clip ? 'Audio clip: no note editor. Select a MIDI or drum clip to edit it here.' : 'Select a clip to edit it here.'}
            </p>
          )}
          <p className="text-xs text-secondary font-light leading-5">
            Click a clip to edit it below. Use the ⋯ button or right-click a track for rename, color, move, automation and delete. Click the ruler to move
            the playhead. Edits in the piano roll update the clip above.
          </p>
        </div>
      </div>

      <Modal
        title="Rename track"
        isOpen={renaming !== null}
        onClose={() => setRenaming(null)}
        actions={
          <>
            <Button label="Cancel" variant="secondary" onClick={() => setRenaming(null)} />
            <Button
              label="Rename"
              variant="primary"
              disabled={!renaming?.name.trim()}
              onClick={() => {
                if (renaming?.name.trim()) patch(renaming.id, { name: renaming.name.trim() });
                setRenaming(null);
              }}
            />
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (renaming?.name.trim()) patch(renaming.id, { name: renaming.name.trim() });
            setRenaming(null);
          }}
        >
          <InputField
            label="Track name"
            variant="default"
            required={false}
            value={renaming?.name ?? ''}
            onChange={(e) => setRenaming((r) => (r ? { ...r, name: e.target.value } : r))}
            data-autofocus
          />
        </form>
      </Modal>

      <p className="text-sm text-secondary font-light mt-4 max-w-[44rem]">
        Built from <code>Transport</code>, <code>TrackHeader</code>, <code>Menu</code>, <code>ContextMenu</code>, <code>Clip</code>,{' '}
        <code>AutomationLane</code>, <code>PianoRoll</code>, <code>StepSequencer</code>, <code>Modal</code>, <code>PresenceStack</code> and{' '}
        <code>CollabCursor</code>. The grid uses 22 px per beat, and positions are in beats, the same unit the DAW uses. The volume automation drives
        the track meter through <code>valueAt</code>.
      </p>
    </div>
  );
}
