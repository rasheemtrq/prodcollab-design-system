'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import ChannelStrip from '@/app/design-system/components/daw/ChannelStrip';
import source from '@/app/design-system/components/daw/ChannelStrip.tsx?raw';
import { usePeakHold } from '@/app/design-system/components/daw/Meter';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

export default function ChannelStripPage() {
  const [vol, setVol] = useState(-4);
  const [pan, setPan] = useState(-0.2);
  const [muted, setMuted] = useState(false);
  const [soloed, setSoloed] = useState(false);
  const [master, setMaster] = useState(0);
  const { t } = useDemoClock(true);
  const pre = demoLevel(t, 140, 2, -10);
  const levels = muted ? [-Infinity, -Infinity] : [pre + vol + 3 * Math.min(0, -pan), pre + vol + 3 * Math.min(0, pan)];
  const peaks = usePeakHold(levels);
  const mLevels = levels.map((l) => l + master);
  const mPeaks = usePeakHold(mLevels);

  return (
    <div>
      <Header01 />
      <DocExample
        name="ChannelStrip"
        source={source}
        stageClassName="gap-3 items-start"
        usage={`<ChannelStrip
  name="Reese Bass"
  color={2}
  volume={db} onVolumeChange={setDb}
  pan={pan} onPanChange={setPan}
  muted={muted} onMute={toggleMute}
  soloed={soloed} onSolo={toggleSolo}
  levels={levels} peaks={usePeakHold(levels)}
  inserts={['EQ Eight', 'OTT', 'Saturator']}
/>

<ChannelStrip name="Master" master volume={0} levels={masterLevels} />`}
      >
        <ChannelStrip
          name="Reese Bass"
          color={2}
          volume={vol}
          onVolumeChange={setVol}
          pan={pan}
          onPanChange={setPan}
          muted={muted}
          soloed={soloed}
          onMute={() => setMuted((m) => !m)}
          onSolo={() => setSoloed((s) => !s)}
          levels={levels}
          peaks={peaks}
          inserts={['EQ Eight', 'OTT', 'Saturator']}
          selected
        />
        <ChannelStrip name="Master" master volume={master} onVolumeChange={setMaster} levels={mLevels} peaks={mPeaks} inserts={['Glue Comp', 'Limiter']} />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'name / color', type: 'string / TrackColor', description: 'Label and the top-edge color.' },
          { name: 'volume / onVolumeChange', type: 'number / (dB) => void', description: 'Fader in dB.' },
          { name: 'pan / onPanChange', type: 'number / (v) => void', default: '0', description: '-1 (left) to 1 (right).' },
          { name: 'muted / soloed / onMute / onSolo', type: 'boolean / () => void', description: 'M and S buttons.' },
          { name: 'levels / peaks', type: 'number[]', description: 'Post-fader dBFS per channel for the meter.' },
          { name: 'inserts', type: 'string[]', default: '[]', description: 'Effect names, top to bottom.' },
          { name: 'master', type: 'boolean', default: 'false', description: 'Wider, accent colored, clip light, no pan/M/S.' },
          { name: 'selected / onSelect', type: 'boolean / () => void', description: 'Selection highlight.' },
          { name: 'faderHeight', type: 'number', default: '180', description: 'Fader and meter length.' },
        ]}
      />
    </div>
  );
}
