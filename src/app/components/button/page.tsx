'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Button from '@/app/design-system/components/Button';
import source from '@/app/design-system/components/Button.tsx?raw';

export default function ButtonPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Button"
        source={source}
        stageClassName="flex-col"
        usage={`<Button label="Export" onClick={save} />
<Button label="Share" variant="primary" />
<Button label="Cancel" variant="secondary" size="sm" />
<Button label="Delete track" variant="error" disabled />`}
      >
        <div className="flex gap-4">
          <Button label="Button" />
          <Button label="Button" variant="primary" />
          <Button label="Button" variant="secondary" />
          <Button label="Button" variant="error" />
        </div>
        <div className="flex gap-4 items-center">
          <Button label="Small" variant="primary" size="sm" />
          <Button label="Medium" variant="primary" />
          <Button label="Large" variant="primary" size="lg" />
          <Button label="Disabled" variant="primary" disabled />
        </div>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'label', type: 'ReactNode', description: 'Button text.' },
          { name: 'variant', type: "'default' | 'primary' | 'secondary' | 'error'", default: "'default'", description: 'Visual style.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and text size.' },
          { name: '...rest', type: 'ButtonHTMLAttributes', description: 'onClick, disabled, type (defaults to "button"), aria-*, and so on.' },
        ]}
      />
    </div>
  );
}
