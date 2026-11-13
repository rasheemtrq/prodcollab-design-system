'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Alert from '@/app/design-system/components/Alert';
import source from '@/app/design-system/components/Alert.tsx?raw';

export default function AlertPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Alert"
        source={source}
        stageClassName="flex-col"
        usage={`<Alert message="Project saved." />
<Alert message="Stems exported." variant="success" />
<Alert message="You are offline. Changes will sync when you reconnect." variant="warning" />
<Alert message="Upload failed." variant="error" />`}
      >
        <Alert message="This is a default alert notification!" />
        <Alert message="This is a success notification!" variant="success" />
        <Alert message="You are offline. Changes will sync when you reconnect." variant="warning" />
        <Alert message="This is an error notification!" variant="error" />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'message', type: 'ReactNode', description: 'The text of the alert.' },
          { name: 'variant', type: "'default' | 'success' | 'warning' | 'error'", default: "'default'", description: 'Errors use role="alert" and interrupt screen readers; the others use role="status".' },
        ]}
      />
    </div>
  );
}
