'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import StepSequencer from '@/app/design-system/components/daw/StepSequencer';
import source from '@/app/design-system/components/daw/StepSequencer.tsx?raw';
import ToolButton from '@/app/design-system/components/daw/ToolButton';
import { useDemoClock } from '@/app/page-components/demo/useDemoClock';

const p = (s: string) => s.split('').map((c) => c === 'x');
const start = [
  { name: 'Kick', color: 4 as const, steps: p('x.........x.....') },
  { name: 'Snare', color: 6 as const, steps: p('....x.......x...') },
  { name: 'Closed HH', color: 8 as const, steps: p('x.x.x.x.x.x.x.xx') },
  { name: 'Open HH', color: 7 as const, steps: p('......x.......x.') },
  { name: 'Clap', color: 3 as const, steps: p('....x.......x..x') },
];

export default function StepSequencerPage() {
  const [rows, setRows] = useState(start);
  const [playing, setPlaying] = useState(false);
  const { t } = useDemoClock(playing);
  const step = playing ? Math.floor((t * 140 * 4) / 60) % 16 : undefined;
  const toggle = (r: number, s: number) =>
    setRows((rs) => rs.map((row, i) => (i === r ? { ...row, steps: row.steps.map((on, j) => (j === s ? !on : on)) } : row)));

  return (
    <div>
      <Header01 />
      <DocExample
        name="StepSequencer"
        source={source}
        stageClassName="flex-col"
        usage={`<StepSequencer
  rows={[{ name: 'Kick', color: 4, steps: [true, false, /* ... */] }]}
  onToggle={(row, step) => toggle(row, step)}
  currentStep={playing ? step : undefined}
/>`}
      >
        <StepSequencer rows={rows} onToggle={toggle} currentStep={step} />
        <ToolButton size="md" pressed={playing} onClick={() => setPlaying((x) => !x)}>
          {playing ? 'Stop' : 'Play'} preview
        </ToolButton>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'rows', type: '{ name, steps: boolean[], color? }[]', description: 'One row per drum sound.' },
          { name: 'onToggle', type: '(row, step) => void', description: 'Called when a step is clicked or activated with Space/Enter.' },
          { name: 'currentStep', type: 'number', description: 'Playhead step, outlined in every row.' },
          { name: 'stepsPerBeat', type: 'number', default: '4', description: 'Sets the beat shading and gaps (4 = 16th notes).' },
          { name: 'label', type: 'string', default: "'Drum pattern'", description: 'Accessible name.' },
        ]}
      />
      <p className="text-sm text-secondary font-light">Keyboard: Tab enters the grid, arrows move, Home/End jump to row ends, Space toggles.</p>
    </div>
  );
}
