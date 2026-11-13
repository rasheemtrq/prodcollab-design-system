'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Tooltip from '@/app/design-system/components/Tooltip';
import source from '@/app/design-system/components/Tooltip.tsx?raw';

export default function TooltipPage() {
  return (
    <div>
      <Header01 />
      <DocExample name="Tooltip" source={source} usage={`<Tooltip text="Bounce in place (Ctrl+B)">Bounce</Tooltip>`}>
        <Tooltip text="This is the tooltip content.">Hover</Tooltip>
        <Tooltip text="Shows immediately" delay={0}>
          No delay
        </Tooltip>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'text', type: 'string', description: 'Tooltip content.' },
          { name: 'children', type: 'ReactNode', description: 'Trigger content. It is wrapped in a focusable button.' },
          { name: 'delay', type: 'number', default: '800', description: 'Milliseconds before showing.' },
        ]}
      />
    </div>
  );
}
