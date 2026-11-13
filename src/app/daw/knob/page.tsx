'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Knob from '@/app/design-system/components/daw/Knob';
import source from '@/app/design-system/components/daw/Knob.tsx?raw';
import { formatPan } from '@/app/design-system/components/daw/Knob';

export default function KnobPage() {
  const [pan, setPan] = useState(0);
  const [send, setSend] = useState(0.3);
  const [cutoff, setCutoff] = useState(8000);
  const [drive, setDrive] = useState(0.6);
  return (
    <div>
      <Header01 />
      <DocExample
        name="Knob"
        source={source}
        stageClassName="gap-10"
        usage={`<Knob label="Pan" value={pan} onChange={setPan} min={-1} max={1} bipolar formatValue={formatPan} />
<Knob label="Rev" value={send} onChange={setSend} size="sm" color="var(--pc-track-8)" />
<Knob label="Cutoff" value={hz} onChange={setHz} min={20} max={20000} step={10}
      defaultValue={8000} formatValue={(v) => \`\${(v / 1000).toFixed(1)}k\`} size="lg" />`}
      >
        <Knob label="Pan" value={pan} onChange={setPan} min={-1} max={1} bipolar formatValue={formatPan} />
        <Knob label="Rev" value={send} onChange={setSend} size="sm" color="var(--pc-track-8)" />
        <Knob
          label="Cutoff"
          value={cutoff}
          onChange={setCutoff}
          min={20}
          max={20000}
          step={10}
          defaultValue={8000}
          size="lg"
          formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
        />
        <Knob label="Drive" value={drive} onChange={setDrive} size="lg" color="var(--pc-track-4)" />
        <Knob label="Off" value={0.4} disabled />
      </DocExample>
      <section className="mb-12 text-sm text-secondary font-light leading-6 max-w-[44rem]">
        <h2 className="text-xl tracking-tight text-primary mb-2">Interaction</h2>
        <ul className="list-disc pl-5">
          <li>Drag up/down; 160 px covers the full range. Hold <kbd>Shift</kbd> for 10x finer control.</li>
          <li>Scroll over it; Shift-scroll for fine steps.</li>
          <li>Arrow keys move 1% (Shift: 0.1%), PageUp/PageDown 10%, Home/End to the limits.</li>
          <li>Double-click resets to <code>defaultValue</code>; bipolar knobs reset to center.</li>
        </ul>
      </section>
      <PropsTable
        rows={[
          { name: 'value / onChange', type: 'number / (v) => void', description: 'Controlled value.' },
          { name: 'label', type: 'string', description: 'Visible label and accessible name.' },
          { name: 'min / max / step', type: 'number', default: '0 / 1 / —', description: 'Range and snap increment.' },
          { name: 'defaultValue', type: 'number', default: 'center or min', description: 'Double-click reset value.' },
          { name: 'bipolar', type: 'boolean', default: 'false', description: 'Draw the arc from the center (pan, detune).' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '28, 40 or 56 px.' },
          { name: 'color', type: 'string', default: 'var(--pc-accent)', description: 'Arc color, usually the track color.' },
          { name: 'formatValue', type: '(v) => string', default: 'percent', description: 'Readout and aria-valuetext.' },
          { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Visually hide label and readout.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the knob and ignores input.' },
        ]}
      />
    </div>
  );
}
