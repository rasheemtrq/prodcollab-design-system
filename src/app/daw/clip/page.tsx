'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Clip from '@/app/design-system/components/daw/Clip';
import source from '@/app/design-system/components/daw/Clip.tsx?raw';
import { demoPeaks } from '@/app/design-system/components/daw/Clip';

const bassline = [0, 0.75, 1.5, 2, 2.75, 3.5].map((start, i) => ({ start, length: i % 3 === 2 ? 0.5 : 0.7, pitch: [36, 36, 43, 41, 39, 34][i] }));
const chords = [0, 2].flatMap((start, i) =>
  (i ? [57, 60, 64, 67] : [55, 58, 62, 65]).map((pitch) => ({ start, length: 1.9, pitch })),
);

export default function ClipPage() {
  const [selected, setSelected] = useState('vox');
  const pick = (id: string) => () => setSelected(id);
  return (
    <div>
      <Header01 />
      <DocExample
        name="Clip"
        source={source}
        stageClassName="flex-col items-stretch"
        usage={`<Clip name="Lead Vox" color={3} peaks={peaks} style={{ width: 240, height: 64 }} />
<Clip name="Bassline" kind="midi" color={2} notes={notes} lengthBeats={4} selected />
<Clip name="Drums" color={5} peaks={peaks} editingBy={{ name: 'Kai', color: 1 }} />`}
      >
        <div className="flex gap-1 h-16">
          <Clip name="Lead Vox" color={3} peaks={demoPeaks(120, 3, 'vocal')} selected={selected === 'vox'} onClick={pick('vox')} style={{ width: 260 }} />
          <Clip name="Vox Chop" color={3} peaks={demoPeaks(60, 9, 'pluck')} selected={selected === 'chop'} onClick={pick('chop')} style={{ width: 130 }} />
        </div>
        <div className="flex gap-1 h-16">
          <Clip name="Bassline" kind="midi" color={2} notes={bassline} lengthBeats={4} selected={selected === 'bass'} onClick={pick('bass')} style={{ width: 200 }} />
          <Clip name="Chords" kind="midi" color={1} notes={chords} lengthBeats={4} selected={selected === 'chords'} onClick={pick('chords')} style={{ width: 200 }} />
        </div>
        <div className="flex gap-1 h-16">
          <Clip name="Drum Loop" color={5} peaks={demoPeaks(160, 5, 'pluck')} editingBy={{ name: 'Kai', color: 1 }} selected={selected === 'drums'} onClick={pick('drums')} style={{ width: 300 }} />
          <Clip name="Riser (muted)" color={8} peaks={demoPeaks(80, 2)} muted style={{ width: 130 }} />
        </div>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'name', type: 'string', description: 'Shown in the header strip.' },
          { name: 'color', type: 'TrackColor', default: '1', description: 'Track swatch or CSS color; body, border and header are tinted from it.' },
          { name: 'kind', type: "'audio' | 'midi'", default: "'audio'", description: 'Waveform or notes.' },
          { name: 'peaks', type: 'number[]', description: 'Audio peaks 0..1, evenly spaced. demoPeaks() makes placeholder data.' },
          { name: 'notes / lengthBeats', type: 'ClipNote[] / number', default: '[] / 4', description: 'MIDI notes { start, length, pitch } in beats.' },
          { name: 'selected', type: 'boolean', description: 'White outline.' },
          { name: 'muted', type: 'boolean', description: 'Faded and desaturated.' },
          { name: 'editingBy', type: '{ name, color: PeerColor }', description: 'Outlines the clip in a collaborator color with their name.' },
          { name: 'style / className / onClick', type: '—', description: 'Position and size. Clips fill their container height.' },
        ]}
      />
    </div>
  );
}
