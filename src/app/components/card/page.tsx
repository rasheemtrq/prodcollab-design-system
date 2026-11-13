'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Card from '@/app/design-system/components/Card';
import source from '@/app/design-system/components/Card.tsx?raw';

export default function CardPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Card"
        source={source}
        usage={`<Card title="Late Night" content="Kai invited you to collaborate." variant="primary" />`}
      >
        <Card title="Card" content="This is a card component with an avatar." />
        <Card title="Card" content="This is a card component with an avatar." variant="primary" />
        <Card title="Card" content="This is a card component with an avatar." variant="secondary" />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'title', type: 'string', description: 'Heading.' },
          { name: 'content', type: 'string', description: 'Body text.' },
          { name: 'variant', type: "'default' | 'primary' | 'secondary'", default: "'default'", description: 'Panel, brand-tinted, or raised.' },
          { name: 'avatarSrc / avatarAlt', type: 'string', default: 'ProdCollab logo', description: 'The avatar image.' },
        ]}
      />
    </div>
  );
}
