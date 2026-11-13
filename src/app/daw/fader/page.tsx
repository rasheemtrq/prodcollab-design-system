'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Fader from '@/app/design-system/components/daw/Fader';
import source from '@/app/design-system/components/daw/Fader.tsx?raw';
import { formatDb } from '@/app/design-system/components/daw/color';

export default function FaderPage() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(-8.5);
  const [c, setC] = useState(-Infinity);
  return (
    <div>
      <Header01 />
      <DocExample
        name="Fader"
        source={source}
        stageClassName="gap-12 items-end"
        usage={`const [db, setDb] = useState(0);

<Fader label="Drums volume" value={db} onChange={setDb} color="var(--pc-track-5)" />`}
      >
        {[
          { label: 'Drums', v: a, set: setA, color: 'var(--pc-track-5)' },
          { label: 'Bass', v: b, set: setB, color: 'var(--pc-track-2)' },
          { label: 'FX', v: c, set: setC, color: 'var(--pc-track-8)' },
        ].map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-2">
            <Fader label={`${f.label} volume`} value={f.v} onChange={f.set} color={f.color} height={200} />
            <span className="font-mono text-xs text-secondary tabular-nums">{formatDb(f.v)}</span>
            <span className="text-xs">{f.label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <Fader label="Disabled" value={-6} height={200} disabled />
          <span className="text-xs text-secondary">Disabled</span>
        </div>
      </DocExample>
      <section className="mb-12 text-sm text-secondary font-light leading-6 max-w-[44rem]">
        <h2 className="text-xl tracking-tight text-primary mb-2">Fader law</h2>
        <p>
          Position is <code>((dB − min) / (max − min))²</code>. With the default −60 to +6 dB range, 0 dB sits at about 83% of
          the travel, and −12 to +6 dB takes almost half the throw. <code>dbToPosition</code> and <code>positionToDb</code> are
          exported for drawing automation lanes on the same curve. The bottom of the travel reads −∞.
        </p>
      </section>
      <PropsTable
        rows={[
          { name: 'value / onChange', type: 'number / (dB) => void', description: 'Gain in dB. At or below minDb reads as −∞.' },
          { name: 'label', type: 'string', description: 'Accessible name.' },
          { name: 'minDb / maxDb', type: 'number', default: '-60 / 6', description: 'Range.' },
          { name: 'color', type: 'string', default: 'var(--pc-text)', description: 'Stripe on the cap.' },
          { name: 'height', type: 'number', default: '160', description: 'Track height in px.' },
          { name: 'showScale', type: 'boolean', default: 'true', description: 'dB tick labels beside the track.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and ignores input.' },
        ]}
      />
    </div>
  );
}
