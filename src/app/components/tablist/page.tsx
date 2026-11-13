'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Tablist from '@/app/design-system/components/Tablist';
import source from '@/app/design-system/components/Tablist.tsx?raw';

export default function TablistPage() {
  const [view, setView] = useState('Pattern');
  return (
    <div>
      <Header01 />
      <DocExample name="Tablist" source={source} stageClassName="flex-col" usage={`<Tablist tabs={['Pattern', 'Piano roll']} value={view} onChange={setView} sizing="sm" label="Editor view" />`}>
        <Tablist tabs={['Tab 1', 'Tab 2', 'Tab 3']} amount={3} />
        <Tablist tabs={['Tab 1', 'Tab 2', 'Tab 3']} sizing="sm" amount={3} />
        <Tablist tabs={['Tab 1', 'Tab 2', 'Tab 3']} sizing="md" amount={3} />
        <Tablist tabs={['Tab 1', 'Tab 2', 'Tab 3']} sizing="lg" amount={3} />
      </DocExample>
      <DocExample name="Tablist" title="Controlled" stageClassName="flex-col">
        <Tablist tabs={['Pattern', 'Piano roll', 'Automation']} value={view} onChange={setView} sizing="sm" label="Editor view" />
        <p className="text-sm text-secondary">Showing: {view}</p>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'tabs', type: 'string[]', description: 'Tab labels.' },
          { name: 'sizing', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'xs'", description: 'Text and padding size.' },
          { name: 'amount', type: 'number', default: 'tabs.length', description: 'Show only the first N tabs.' },
          { name: 'value / onChange', type: 'string / (tab) => void', description: 'Control the active tab. Leave value undefined for uncontrolled.' },
          { name: 'label', type: 'string', description: 'Accessible name for the tab list.' },
        ]}
      />
    </div>
  );
}
