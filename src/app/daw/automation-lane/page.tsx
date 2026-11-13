'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import AutomationLane, { type AutomationPoint } from '@/app/design-system/components/daw/AutomationLane';
import source from '@/app/design-system/components/daw/AutomationLane.tsx?raw';
import Knob from '@/app/design-system/components/daw/Knob';
import Fader, { dbToPosition, positionToDb } from '@/app/design-system/components/daw/Fader';
import ToolButton from '@/app/design-system/components/daw/ToolButton';
import { formatDb } from '@/app/design-system/components/daw/color';
import { valueAt } from '@/app/design-system/components/daw/editing';
import { useDemoClock } from '@/app/page-components/demo/useDemoClock';

const BEATS = 16;
const pos = dbToPosition;

const START_VOL: AutomationPoint[] = [
  { id: 'v1', t: 0, v: pos(-30) },
  { id: 'v2', t: 4, v: pos(0) },
  { id: 'v3', t: 11, v: pos(0) },
  { id: 'v4', t: 12, v: pos(-12) },
  { id: 'v5', t: 16, v: pos(-6) },
];
const START_CUTOFF: AutomationPoint[] = [
  { id: 'c1', t: 0, v: 0.15 },
  { id: 'c2', t: 8, v: 0.9 },
  { id: 'c3', t: 8, v: 0.3 },
  { id: 'c4', t: 15, v: 1 },
];

// Cutoff lane: 0..1 mapped exponentially to 20 Hz–20 kHz.
const hz = (v: number) => 20 * 1000 ** v;
const formatHz = (v: number) => {
  const f = hz(v);
  return f >= 1000 ? `${(f / 1000).toFixed(1)} kHz` : `${Math.round(f)} Hz`;
};

export default function AutomationLanePage() {
  const [vol, setVol] = useState(START_VOL);
  const [cutoff, setCutoff] = useState(START_CUTOFF);
  const [playing, setPlaying] = useState(true);
  const { t } = useDemoClock(playing);
  const playhead = ((t * 120) / 60) % BEATS;
  const volNow = positionToDb(valueAt(vol, playhead, pos(0)));
  const cutNow = valueAt(cutoff, playhead, 0.5);

  return (
    <div>
      <Header01 />
      <DocExample
        name="AutomationLane"
        source={source}
        stageClassName="flex-col items-stretch"
        usage={`// A volume lane on the fader's own curve:
<AutomationLane
  label="Volume"
  points={points}
  onChange={setPoints}
  lengthBeats={32}
  color={3}
  defaultValue={dbToPosition(0)}
  formatValue={(v) => formatDb(positionToDb(v))}
  playhead={beats}
/>

// In the engine (or for a control that follows the lane):
const db = positionToDb(valueAt(points, beats, dbToPosition(0)));`}
      >
        <div className="flex items-center gap-3">
          <ToolButton size="md" pressed={playing} onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Pause' : 'Play'}
          </ToolButton>
          <ToolButton size="md" onClick={() => { setVol(START_VOL); setCutoff(START_CUTOFF); }}>Reset</ToolButton>
          <ToolButton size="md" onClick={() => { setVol([]); setCutoff([]); }}>Clear</ToolButton>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="min-w-0 max-w-full overflow-x-auto overflow-y-hidden rounded-xl border border-line flex flex-col divide-y divide-[var(--pc-line)]">
            <AutomationLane
              label="Volume"
              points={vol}
              onChange={setVol}
              lengthBeats={BEATS}
              beatWidth={28}
              color={3}
              defaultValue={pos(0)}
              formatValue={(v) => formatDb(positionToDb(v))}
              playhead={playhead}
            />
            <AutomationLane
              label="Filter cutoff"
              points={cutoff}
              onChange={setCutoff}
              lengthBeats={BEATS}
              beatWidth={28}
              color={8}
              defaultValue={0.5}
              formatValue={formatHz}
              playhead={playhead}
              snap={0.5}
            />
          </div>
          <div className="flex gap-4 items-end shrink-0">
            {/* These follow the lanes: the same valueAt the engine would use. */}
            <div className="flex flex-col items-center gap-1">
              <Fader label="Volume (automated)" value={volNow} height={140} color="var(--pc-track-3)" showScale={false} disabled />
              <span className="text-[10px] font-mono text-secondary w-14 text-center">{formatDb(volNow)}</span>
            </div>
            <Knob label="Cutoff" value={cutNow} size="lg" color="var(--pc-track-8)" formatValue={formatHz} disabled />
          </div>
        </div>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'points / onChange', type: 'AutomationPoint[] / (points) => void', description: '{ id, t, v }: t in beats, v normalized 0..1. Kept sorted by time.' },
          { name: 'label', type: 'string', description: 'Parameter name; shown in the lane and used in announcements.' },
          { name: 'lengthBeats / beatWidth / height', type: 'number', default: '— / 22 / 72', description: 'Use the same beatWidth as the arrangement.' },
          { name: 'snap', type: 'number', default: '0.25', description: 'Time grid. Shift-drag ignores it.' },
          { name: 'formatValue', type: '(v) => string', default: 'percent', description: 'Readout, e.g. dB through positionToDb.' },
          { name: 'defaultValue', type: 'number', default: '0.5', description: 'Dashed line (and valueAt fallback) when the lane has no points.' },
          { name: 'color', type: 'TrackColor', default: '1', description: 'Usually the track color.' },
          { name: 'playhead', type: 'number', description: 'Shows a dot at the current value.' },
        ]}
      />
      <p className="text-sm text-secondary font-light">
        Two points at the same time make a jump, like the cutoff at bar 3. Dragging cannot move a point past its neighbours. Pure helpers in{' '}
        <code>daw/editing.ts</code>: <code>valueAt</code>, <code>curve</code>, <code>insertPoint</code>, <code>movePoint</code>,{' '}
        <code>removePoint</code>.
      </p>
    </div>
  );
}
