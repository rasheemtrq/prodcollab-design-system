'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Meter from '@/app/design-system/components/daw/Meter';
import source from '@/app/design-system/components/daw/Meter.tsx?raw';
import { usePeakHold } from '@/app/design-system/components/daw/Meter';
import Button from '@/app/design-system/components/Button';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

export default function MeterPage() {
  const [running, setRunning] = useState(true);
  const [hot, setHot] = useState(false);
  const { t } = useDemoClock(running);
  const boost = hot ? 9 : 0;
  const stereo = [demoLevel(t, 128, 0, -12 + boost), demoLevel(t, 128, 3, -13 + boost)];
  const peaks = usePeakHold(stereo);
  const mono = [demoLevel(t, 128, 1, -18)];
  const monoPeak = usePeakHold(mono);

  return (
    <div>
      <Header01 />
      <DocExample
        name="Meter"
        source={source}
        stageClassName="gap-10 items-end"
        usage={`const levels = [leftDb, rightDb];
const peaks = usePeakHold(levels);

<Meter levels={levels} peaks={peaks} showClip />
<Meter levels={[db]} orientation="horizontal" length={120} />`}
      >
        <div className="flex flex-col items-center gap-2">
          <Meter levels={stereo} peaks={peaks} showClip label="Master level" />
          <span className="text-xs text-secondary">Stereo + clip</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Meter levels={mono} peaks={monoPeak} thickness={8} label="Mono level" />
          <span className="text-xs text-secondary">Mono</span>
        </div>
        <div className="flex flex-col items-start gap-3">
          <Meter levels={stereo} peaks={peaks} orientation="horizontal" length={220} thickness={4} />
          <Meter levels={mono} orientation="horizontal" length={220} thickness={6} />
          <span className="text-xs text-secondary">Horizontal</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="secondary" label={running ? 'Pause signal' : 'Run signal'} onClick={() => setRunning((r) => !r)} />
          <Button size="sm" variant={hot ? 'error' : 'secondary'} label={hot ? 'Back to normal' : 'Push it to clip'} onClick={() => setHot((h) => !h)} />
        </div>
      </DocExample>
      <section className="mb-12 text-sm text-secondary font-light leading-6 max-w-[44rem]">
        <h2 className="text-xl tracking-tight text-primary mb-2">Scale</h2>
        <p>
          The meter is linear in dB from the floor (−60 dBFS by default) to 0 dBFS. It is green below −12 dB, yellow from −12 to −3 dB,
          and red above −3 dB. The colors come from <code>--pc-meter-low / mid / high</code>. The clip light latches at 0 dBFS
          until it is clicked. The demo signal here is simulated.
        </p>
      </section>
      <PropsTable
        rows={[
          { name: 'levels', type: 'number[]', description: 'dBFS per channel. -Infinity is silence.' },
          { name: 'peaks', type: 'number[]', description: 'Peak-hold dBFS per channel, usually from usePeakHold(levels).' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Direction of travel.' },
          { name: 'length / thickness', type: 'number', default: '160 / 5', description: 'Size in px.' },
          { name: 'floorDb', type: 'number', default: '-60', description: 'Bottom of the scale.' },
          { name: 'showClip', type: 'boolean', default: 'false', description: 'Latching clip light; click to reset.' },
          { name: 'label', type: 'string', default: "'Level'", description: 'Accessible name (role="meter").' },
        ]}
      />
    </div>
  );
}
