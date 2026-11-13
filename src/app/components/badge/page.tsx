'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Badge from '@/app/design-system/components/Badge';
import source from '@/app/design-system/components/Badge.tsx?raw';
import Avatar from '@/app/design-system/components/Avatar';

export default function BadgePage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Badge"
        source={source}
        usage={`<Badge />
<Badge count={3} label="3 unread comments" />
<Badge variant="success" label="Online">
  <Avatar src="/images/logo-256.png" alt="Kai" />
</Badge>`}
      >
        <Badge />
        <Badge variant="pending" />
        <Badge variant="error" />
        <Badge variant="success" />
        <Badge count={3} />
        <Badge count={12} variant="error" />
        <Badge count={250} />
        <Badge count={4} label="4 unread comments">
          <Avatar src="/images/logo-256.png" alt="Inbox" />
        </Badge>
        <Badge variant="success" label="Online">
          <Avatar src="/images/logo-256.png" alt="Kai" />
        </Badge>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'variant', type: "'notification' | 'pending' | 'error' | 'success'", default: "'notification'", description: 'Color of the badge.' },
          { name: 'count', type: 'number', description: 'Shows a number, capped at 99+. Omit for a dot.' },
          { name: 'label', type: 'string', description: 'Read by screen readers. Without it the badge is decorative.' },
          { name: 'children', type: 'ReactNode', description: 'An element to pin the badge to.' },
        ]}
      />
    </div>
  );
}
