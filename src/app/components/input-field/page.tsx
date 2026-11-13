'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import InputField from '@/app/design-system/components/InputField';
import source from '@/app/design-system/components/InputField.tsx?raw';

export default function InputFieldPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="InputField"
        source={source}
        stageClassName="flex-col items-stretch max-w-sm mx-auto"
        usage={`<InputField label="Project name" variant="default" />
<InputField label="Password" variant="password" />
<InputField label="Email" variant="error" errorMessage="Enter a valid email." />`}
      >
        <InputField label="Type here" variant="default" />
        <InputField label="Enter password" variant="password" />
        <InputField label="Type here" variant="outlined" required={false} />
        <InputField label="Type here again" variant="error" />
        <InputField label="Disabled" variant="default" disabled />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'label', type: 'string', description: 'Placeholder and accessible name.' },
          { name: 'variant', type: "'default' | 'outlined' | 'password' | 'error'", description: 'Visual state; password also sets type="password".' },
          { name: 'required', type: 'boolean', default: 'true', description: 'Shows the asterisk and sets the native required attribute.' },
          { name: 'errorMessage', type: 'string', default: "'Invalid input. Please try again.'", description: 'Shown under error fields and linked with aria-describedby.' },
          { name: '...rest', type: 'InputHTMLAttributes', description: 'value, onChange, disabled, name, and so on.' },
        ]}
      />
    </div>
  );
}
