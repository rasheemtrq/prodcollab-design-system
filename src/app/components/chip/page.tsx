'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Chip from '@/app/design-system/components/Chip';
import source from '@/app/design-system/components/Chip.tsx?raw';

export default function ChipPage() {
  return (
    <div>
      <Header01 />
      <DocExample name="Chip" source={source} usage={`<Chip text="bass emo" variant="secondary" dotColor="var(--pc-track-2)" />`}>
        <Chip text="chip" />
        <Chip text="chip" variant="primary" />
        <Chip text="chip" variant="secondary" />
        <Chip text="Drums" variant="secondary" dotColor="var(--pc-track-5)" />
        <Chip text="Vocals" variant="secondary" dotColor="var(--pc-track-3)" />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'text', type: 'string', description: 'Chip label.' },
          { name: 'variant', type: "'default' | 'primary' | 'secondary'", default: "'default'", description: 'Visual style.' },
          { name: 'dotColor', type: 'string', description: 'Fills the dot, e.g. with a track color.' },
        ]}
      />
    </div>
  );
}
