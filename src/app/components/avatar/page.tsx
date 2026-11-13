'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Avatar from '@/app/design-system/components/Avatar';
import source from '@/app/design-system/components/Avatar.tsx?raw';

export default function AvatarPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Avatar"
        source={source}
        usage={`<Avatar src="/images/logo-256.png" alt="Kai" />
<Avatar src="/images/logo-256.png" alt="Kai" variant="round" size="lg" />`}
      >
        <Avatar src="/images/logo-256.png" alt="avatar" size="sm" />
        <Avatar src="/images/logo-256.png" alt="avatar" />
        <Avatar src="/images/logo-256.png" alt="avatar" size="lg" />
        <Avatar src="/images/logo-256.png" alt="avatar" variant="round" size="lg" />
        <Avatar src="/images/logo-256.png" alt="avatar" variant="square" size="lg" />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'src', type: 'string', description: 'Image URL.' },
          { name: 'alt', type: 'string', description: "The person's name. Use an empty string if the name is shown beside it." },
          { name: 'variant', type: "'default' | 'round' | 'square'", default: "'default'", description: 'Circle, rounded square, or square.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '24, 36 or 48 px.' },
        ]}
      />
    </div>
  );
}
