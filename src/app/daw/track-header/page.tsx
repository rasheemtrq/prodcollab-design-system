'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import TrackHeader from '@/app/design-system/components/daw/TrackHeader';
import source from '@/app/design-system/components/daw/TrackHeader.tsx?raw';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

const initial = [
  { name: 'Drums', kind: 'drums' as const, color: 5 as const, muted: false, soloed: false, armed: false, seed: 0 },
  { name: 'Reese Bass', kind: 'midi' as const, color: 2 as const, muted: false, soloed: false, armed: false, seed: 2 },
  { name: 'Lead Vox', kind: 'vocal' as const, color: 3 as const, muted: false, soloed: false, armed: true, seed: 4 },
  { name: 'Riser FX', kind: 'audio' as const, color: 8 as const, muted: true, soloed: false, armed: false, seed: 5 },
];

export default function TrackHeaderPage() {
  const [tracks, setTracks] = useState(initial);
  const [selected, setSelected] = useState(0);
  const { t } = useDemoClock(true);
  const anySolo = tracks.some((x) => x.soloed);
  const set = (i: number, k: 'muted' | 'soloed' | 'armed') =>
    setTracks((ts) => ts.map((x, j) => (j === i ? { ...x, [k]: !x[k] } : x)));

  return (
    <div>
      <Header01 />
      <DocExample
        name="TrackHeader"
        source={source}
        stageClassName="flex-col gap-1"
        usage={`<TrackHeader
  name="Lead Vox"
  kind="vocal"
  color={3}
  muted={muted} onMute={toggleMute}
  soloed={soloed} onSolo={toggleSolo}
  armed={armed} onArm={toggleArm}
  level={levelDb}
/>`}
      >
        {tracks.map((x, i) => {
          const audible = !x.muted && (!anySolo || x.soloed);
          return (
            <TrackHeader
              key={x.name}
              {...x}
              selected={selected === i}
              onSelect={() => setSelected(i)}
              onMute={() => set(i, 'muted')}
              onSolo={() => set(i, 'soloed')}
              onArm={() => set(i, 'armed')}
              level={audible ? demoLevel(t, 140, x.seed, -16) : -Infinity}
            />
          );
        })}
      </DocExample>
      <PropsTable
        rows={[
          { name: 'name', type: 'string', description: 'Track name.' },
          { name: 'kind', type: "'audio' | 'midi' | 'drums' | 'vocal'", default: "'audio'", description: 'Sets the icon.' },
          { name: 'color', type: 'TrackColor', default: '1', description: 'Swatch 1–8 from tokens, or any CSS color.' },
          { name: 'muted / soloed / armed', type: 'boolean', description: 'Button states. Muted tracks are dimmed.' },
          { name: 'onMute / onSolo / onArm', type: '() => void', description: 'The R button only renders with onArm.' },
          { name: 'level', type: 'number', description: 'dBFS for the inline meter; omit to hide it.' },
          { name: 'selected / onSelect', type: 'boolean / () => void', description: 'Selection highlight.' },
          { name: 'height / width', type: 'number', default: '64 / 220', description: 'Match the lane height.' },
        ]}
      />
    </div>
  );
}
