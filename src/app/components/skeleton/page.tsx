'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Skeleton from '@/app/design-system/components/Skeleton';
import source from '@/app/design-system/components/Skeleton.tsx?raw';

export default function SkeletonPage() {
  return (
    <div>
      <Header01 />
      <DocExample name="Skeleton" source={source} usage={`<Skeleton />\n<Skeleton avatarSize="medium" lineSize="medium" />`}>
        <Skeleton />
        <Skeleton avatarSize="medium" />
        <Skeleton avatarSize="medium" lineSize="medium" />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'avatarSize', type: "'small' | 'medium'", default: "'small'", description: 'Size of the round placeholder.' },
          { name: 'lineSize', type: "'small' | 'medium'", default: "'small'", description: 'Size of the text lines.' },
        ]}
      />
    </div>
  );
}
