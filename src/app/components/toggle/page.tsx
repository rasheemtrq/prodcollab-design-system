'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Toggle from '@/app/design-system/components/Toggle';
import source from '@/app/design-system/components/Toggle.tsx?raw';

export default function TogglePage() {
  const [snap, setSnap] = useState(true);
  return (
    <div>
      <Header01 />
      <DocExample name="Toggle" source={source} usage={`<Toggle label="Snap to grid" checked={snap} onChange={setSnap} />`}>
        <Toggle size="small" />
        <Toggle size="medium" />
        <Toggle size="large" />
        <Toggle size="medium" disabled defaultChecked />
      </DocExample>
      <DocExample name="Toggle" title="With a label">
        <label className="flex items-center gap-3 text-sm">
          <Toggle label="Snap to grid" checked={snap} onChange={setSnap} />
          Snap to grid <span className="text-secondary">({snap ? 'on' : 'off'})</span>
        </label>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Switch size.' },
          { name: 'checked / onChange', type: 'boolean / (checked) => void', description: 'Control the state. Leave checked undefined for uncontrolled.' },
          { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'label', type: 'string', default: "'Toggle'", description: 'Accessible name.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch.' },
        ]}
      />
    </div>
  );
}
