'use client';

import React, { useRef, useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import PianoRoll, { type RollNote } from '@/app/design-system/components/daw/PianoRoll';
import source from '@/app/design-system/components/daw/PianoRoll.tsx?raw';
import Tablist from '@/app/design-system/components/Tablist';
import ToolButton from '@/app/design-system/components/daw/ToolButton';
import { noteName } from '@/app/design-system/components/daw/editing';
import { useDemoClock } from '@/app/page-components/demo/useDemoClock';

// A two-bar progression: chords on beats 1 and 3, a bass note under each.
const CHORDS = [
  [55, 58, 62],
  [53, 57, 60],
  [51, 55, 58],
  [50, 53, 57],
];
const START: RollNote[] = CHORDS.flatMap((chord, i) => [
  ...chord.map((pitch, j) => ({ id: `c${i}${j}`, start: i * 2, length: 1.75, pitch, velocity: 92 - j * 6 })),
  { id: `b${i}`, start: i * 2, length: 0.75, pitch: chord[0] - 12, velocity: 110 },
  { id: `b${i}x`, start: i * 2 + 1.5, length: 0.5, pitch: chord[0] - 12, velocity: 84 },
]);

const SNAPS: Record<string, number> = { '1/4': 1, '1/8': 0.5, '1/16': 0.25, '1/32': 0.125 };

/** A tiny sine "ping" so placing notes makes a sound. Created on first use. */
function usePing() {
  const ctx = useRef<AudioContext | null>(null);
  return (pitch: number, velocity: number) => {
    try {
      ctx.current ??= new AudioContext();
      const ac = ctx.current;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
      gain.gain.setValueAtTime((velocity / 127) * 0.18, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);
      osc.connect(gain).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.36);
    } catch {
      // No audio available (e.g. blocked); the editor still works.
    }
  };
}

export default function PianoRollPage() {
  const [notes, setNotes] = useState(START);
  const [snap, setSnap] = useState('1/16');
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const { t } = useDemoClock(playing);
  const ping = usePing();
  const playhead = playing ? ((t * 120) / 60) % 8 : undefined;
  const one = notes.find((n) => selection.length === 1 && n.id === selection[0]);

  return (
    <div>
      <Header01 />
      <DocExample
        name="PianoRoll"
        source={source}
        stageClassName="flex-col items-stretch"
        usage={`const [notes, setNotes] = useState<RollNote[]>([]);

<PianoRoll
  notes={notes}
  onChange={setNotes}
  lengthBeats={8}
  snap={0.25}
  color={2}
  playhead={playhead}
  onPreview={(pitch, velocity) => engine.ping(trackId, pitch, velocity)}
/>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Tablist tabs={Object.keys(SNAPS)} value={snap} onChange={setSnap} sizing="sm" label="Snap" />
          <ToolButton size="md" pressed={playing} onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Stop' : 'Play'} playhead
          </ToolButton>
          <ToolButton size="md" pressed={sound} onClick={() => setSound((s) => !s)}>
            Preview sound
          </ToolButton>
          <ToolButton size="md" onClick={() => setNotes(START)}>
            Reset
          </ToolButton>
          <span className="text-xs text-secondary font-mono ml-auto">
            {notes.length} notes · {selection.length ? (one ? `${noteName(one.pitch)} vel ${one.velocity}` : `${selection.length} selected`) : 'none selected'}
          </span>
        </div>
        <PianoRoll
          notes={notes}
          onChange={setNotes}
          lengthBeats={8}
          snap={SNAPS[snap]}
          color={2}
          playhead={playhead}
          onPreview={sound ? ping : undefined}
          selection={selection}
          onSelectionChange={setSelection}
          lowestPitch={28}
          highestPitch={79}
        />
      </DocExample>

      <section className="mb-12 text-sm text-secondary font-light leading-6 max-w-[44rem]">
        <h2 className="text-xl tracking-tight text-primary mb-2">Interaction</h2>
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          <span className="text-primary">Click empty grid</span><span>Place a note and keep dragging to slide it</span>
          <span className="text-primary">Drag a note</span><span>Move it (and the rest of the selection); hold Alt to ignore the grid</span>
          <span className="text-primary">Drag its right edge</span><span>Resize; new notes then use that length</span>
          <span className="text-primary">Shift-click / Shift-drag</span><span>Add to the selection / box-select</span>
          <span className="text-primary">Double-click, right-click</span><span>Delete the note</span>
          <span className="text-primary">Alt + scroll on a note</span><span>Change velocity</span>
          <span className="text-primary">Velocity lane</span><span>Drag to paint velocities (only selected notes, if any are selected)</span>
          <span className="text-primary">Arrows</span><span>Move selected notes; Shift+↑/↓ an octave, Shift+←/→ resize, Alt+↑/↓ velocity</span>
          <span className="text-primary">Arrows, nothing selected</span><span>Move the cursor; Enter or Space adds or removes a note there</span>
          <span className="text-primary">Delete · Ctrl/⌘+D · Ctrl/⌘+A · Q · Esc</span><span>Delete, duplicate, select all, quantize, deselect</span>
        </div>
      </section>

      <PropsTable
        rows={[
          { name: 'notes / onChange', type: 'RollNote[] / (notes) => void', description: '{ id, start, length, pitch, velocity }, with start and length in beats. Controlled: every edit reports the whole new list.' },
          { name: 'lengthBeats', type: 'number', description: 'Clip length. Notes stay inside it.' },
          { name: 'snap', type: 'number', default: '0.25', description: 'Grid in beats (0.25 = 1/16). 0 for free placement.' },
          { name: 'defaultLength', type: 'number', default: '1', description: 'Length of new notes, until a resize changes it.' },
          { name: 'lowestPitch / highestPitch', type: 'number', default: '36 / 84', description: 'MIDI range shown (C2–C6).' },
          { name: 'beatWidth / rowHeight / height', type: 'number', default: '48 / 14 / 320', description: 'Zoom and visible height.' },
          { name: 'color', type: 'TrackColor', default: '1', description: 'Note color; brightness follows velocity.' },
          { name: 'playhead', type: 'number', description: 'Beats from the clip start.' },
          { name: 'showVelocity', type: 'boolean', default: 'true', description: 'The velocity lane.' },
          { name: 'onPreview', type: '(pitch, velocity) => void', description: 'Audition hook. Connect it to the engine.' },
          { name: 'selection / onSelectionChange', type: 'string[] / (ids) => void', description: 'Optional controlled selection.' },
        ]}
      />
      <p className="text-sm text-secondary font-light">
        The editing rules (group moves, resizing, quantize, duplicate, box select) are pure functions in <code>daw/editing.ts</code>, unit-tested
        by <code>npm test</code>.
      </p>
    </div>
  );
}
